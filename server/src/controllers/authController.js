import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../middleware/catchAsync.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/jwt.js';

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const allowedRole = ['student', 'instructor'].includes(role) ? role : 'student';

  const user = await User.create({ name, email, password, role: allowedRole });
  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(201).json({ success: true, data: { user: user.toSafeObject(), token } });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password.', 401));
  }
  if (!user.isActive) {
    return next(new AppError('This account has been deactivated.', 403));
  }

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(200).json({ success: true, data: { user: user.toSafeObject(), token } });
});

export const logout = catchAsync(async (req, res) => {
  clearAuthCookie(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

export const getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
});

export const updateMe = catchAsync(async (req, res, next) => {
  const { name, bio, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { ...(name && { name }), ...(bio !== undefined && { bio }), ...(avatar !== undefined && { avatar }) } },
    { new: true, runValidators: true }
  );
  res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  const token = signToken(user._id);
  setAuthCookie(res, token);

  res.status(200).json({ success: true, message: 'Password updated successfully', data: { token } });
});
