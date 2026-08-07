import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import catchAsync from '../middleware/catchAsync.js';

export const getDashboardStats = catchAsync(async (req, res) => {
  const { role, _id } = req.user;

  if (role === 'student') {
    const enrollments = await Enrollment.find({ student: _id }).populate('course', 'title thumbnail price lessons');
    const completed = enrollments.filter((e) => e.progress === 100).length;
    const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;
    const totalSpent = enrollments.reduce((sum, e) => sum + e.amountPaid, 0);

    const recentActivity = enrollments
      .slice()
      .sort((a, b) => b.updatedAt - a.updatedAt)
      .slice(0, 5)
      .map((e) => ({
        type: 'enrollment',
        courseTitle: e.course?.title,
        progress: e.progress,
        date: e.updatedAt,
      }));

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEnrollments: enrollments.length,
          completed,
          inProgress,
          totalSpent,
        },
        recentActivity,
      },
    });
  }

  if (role === 'instructor') {
    const courses = await Course.find({ instructor: _id });
    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } })
      .populate('student', 'name')
      .populate('course', 'title')
      .sort('-createdAt')
      .limit(10);

    const totalRevenue = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: null, total: { $sum: '$amountPaid' } } },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCourses: courses.length,
          publishedCourses: courses.filter((c) => c.published).length,
          totalStudents: await Enrollment.countDocuments({ course: { $in: courseIds } }),
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentActivity: enrollments.slice(0, 5).map((e) => ({
          type: 'new_enrollment',
          studentName: e.student?.name,
          courseTitle: e.course?.title,
          date: e.createdAt,
        })),
      },
    });
  }

  // admin
  const [totalUsers, totalCourses, totalEnrollments, revenueAgg, recentUsers, recentEnrollments] = await Promise.all([
    User.countDocuments(),
    Course.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.aggregate([{ $group: { _id: null, total: { $sum: '$amountPaid' } } }]),
    User.find().sort('-createdAt').limit(5).select('name email role createdAt'),
    Enrollment.find().populate('student', 'name').populate('course', 'title').sort('-createdAt').limit(5),
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentActivity: [
        ...recentUsers.map((u) => ({ type: 'new_user', name: u.name, role: u.role, date: u.createdAt })),
        ...recentEnrollments.map((e) => ({
          type: 'new_enrollment',
          studentName: e.student?.name,
          courseTitle: e.course?.title,
          date: e.createdAt,
        })),
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 8),
    },
  });
});
