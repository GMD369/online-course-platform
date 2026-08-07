import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../middleware/catchAsync.js';

export const getCourses = catchAsync(async (req, res) => {
  const { search, category, level, minPrice, maxPrice, sort, page = 1, limit = 9, mine, status } = req.query;

  const query = {};

  if (req.user?.role === 'instructor' && mine === 'true') {
    query.instructor = req.user._id;
  } else if (req.user?.role === 'admin' && status === 'all') {
    // no published filter — admins can see drafts too
  } else {
    query.published = true;
  }

  if (search) {
    query.$text = { $search: search };
  }
  if (category) query.category = category;
  if (level) query.level = level;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'price-asc': 'price',
    'price-desc': '-price',
    popular: '-enrollmentCount',
  };
  const sortBy = sortMap[sort] || '-createdAt';

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [courses, total] = await Promise.all([
    Course.find(query)
      .populate('instructor', 'name email avatar')
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Course.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      courses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    },
  });
});

export const getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'name email avatar bio');
  if (!course) return next(new AppError('Course not found', 404));

  let enrolled = false;
  if (req.user) {
    enrolled = !!(await Enrollment.exists({ student: req.user._id, course: course._id }));
  }

  res.status(200).json({ success: true, data: { course, enrolled } });
});

function assertOwnerOrAdmin(course, user) {
  const isOwner = course.instructor.toString() === user._id.toString();
  if (!isOwner && user.role !== 'admin') {
    throw new AppError('You do not have permission to modify this course.', 403);
  }
}

export const createCourse = catchAsync(async (req, res) => {
  const { title, description, category, level, price } = req.body;
  const course = await Course.create({
    title,
    description,
    category,
    level,
    price,
    instructor: req.user._id,
  });
  res.status(201).json({ success: true, data: { course } });
});

export const updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  const allowed = ['title', 'description', 'category', 'level', 'price', 'thumbnail', 'published'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined) course[field] = req.body[field];
  });
  await course.save();

  res.status(200).json({ success: true, data: { course } });
});

export const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  await course.deleteOne();
  await Enrollment.deleteMany({ course: course._id });

  res.status(200).json({ success: true, message: 'Course deleted' });
});

export const uploadThumbnail = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  if (!req.file) return next(new AppError('No image file uploaded', 400));

  course.thumbnail = `/uploads/${req.file.filename}`;
  await course.save();

  res.status(200).json({ success: true, data: { thumbnail: course.thumbnail } });
});

// ---- Lessons ----

export const addLesson = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  const { title, content, videoUrl, duration } = req.body;
  course.lessons.push({ title, content, videoUrl, duration, order: course.lessons.length });
  await course.save();

  res.status(201).json({ success: true, data: { course } });
});

export const updateLesson = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  const lesson = course.lessons.id(req.params.lessonId);
  if (!lesson) return next(new AppError('Lesson not found', 404));

  ['title', 'content', 'videoUrl', 'duration', 'order'].forEach((field) => {
    if (req.body[field] !== undefined) lesson[field] = req.body[field];
  });
  await course.save();

  res.status(200).json({ success: true, data: { course } });
});

export const deleteLesson = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  assertOwnerOrAdmin(course, req.user);

  course.lessons.pull({ _id: req.params.lessonId });
  await course.save();

  res.status(200).json({ success: true, data: { course } });
});
