import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../middleware/catchAsync.js';

export const getUsers = catchAsync(async (req, res) => {
  const { search, role, page = 1, limit = 10 } = req.query;
  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  if (role) query.role = role;

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [users, total] = await Promise.all([
    User.find(query).sort('-createdAt').skip((pageNum - 1) * limitNum).limit(limitNum),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: users.map((u) => u.toSafeObject()),
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) || 1 },
    },
  });
});

export const updateUserRole = catchAsync(async (req, res, next) => {
  const { role } = req.body;
  if (!['student', 'instructor', 'admin'].includes(role)) {
    return next(new AppError('Invalid role', 400));
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
});

export const setUserActive = catchAsync(async (req, res, next) => {
  const { isActive } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: !!isActive }, { new: true });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, data: { user: user.toSafeObject() } });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  if (user._id.toString() === req.user._id.toString()) {
    return next(new AppError('You cannot delete your own account here.', 400));
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted' });
});
