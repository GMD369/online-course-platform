import crypto from 'crypto';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../middleware/catchAsync.js';

// Mock payment gateway: simulates a checkout without any real money movement.
function mockCharge({ amount, cardNumber }) {
  if (amount > 0) {
    const lastFour = cardNumber?.slice(-4) || '0000';
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 12) {
      return { success: false, reason: 'Invalid card number' };
    }
    return { success: true, reference: `MOCK-${crypto.randomBytes(6).toString('hex').toUpperCase()}-${lastFour}` };
  }
  return { success: true, reference: 'FREE-ENROLLMENT' };
}

export const enroll = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course || !course.published) return next(new AppError('Course not available', 404));

  const existing = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (existing) return next(new AppError('You are already enrolled in this course', 409));

  const { cardNumber } = req.body;
  const payment = mockCharge({ amount: course.price, cardNumber });
  if (!payment.success) {
    return next(new AppError(payment.reason || 'Payment failed', 402));
  }

  const enrollment = await Enrollment.create({
    student: req.user._id,
    course: course._id,
    paymentStatus: course.price > 0 ? 'paid' : 'free',
    amountPaid: course.price,
    paymentReference: payment.reference,
  });

  course.enrollmentCount += 1;
  await course.save();

  res.status(201).json({ success: true, data: { enrollment } });
});

export const getMyEnrollments = catchAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: 'course', populate: { path: 'instructor', select: 'name' } })
    .sort('-createdAt');
  res.status(200).json({ success: true, data: { enrollments } });
});

export const updateProgress = catchAsync(async (req, res, next) => {
  const { lessonId, completed } = req.body;
  const enrollment = await Enrollment.findOne({ student: req.user._id, course: req.params.courseId }).populate('course');
  if (!enrollment) return next(new AppError('Enrollment not found', 404));

  const set = new Set(enrollment.completedLessons.map((id) => id.toString()));
  if (completed) set.add(lessonId);
  else set.delete(lessonId);
  enrollment.completedLessons = Array.from(set);

  const totalLessons = enrollment.course.lessons.length || 1;
  enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
  await enrollment.save();

  res.status(200).json({ success: true, data: { enrollment } });
});

export const getCourseEnrollments = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError('Course not found', 404));

  const isOwner = course.instructor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this data.', 403));
  }

  const enrollments = await Enrollment.find({ course: course._id })
    .populate('student', 'name email avatar')
    .sort('-createdAt');

  res.status(200).json({ success: true, data: { enrollments } });
});
