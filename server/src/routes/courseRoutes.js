import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  uploadThumbnail,
  addLesson,
  updateLesson,
  deleteLesson,
} from '../controllers/courseController.js';
import { getCourseEnrollments } from '../controllers/enrollmentController.js';

const router = Router();

function optionalAuth(req, res, next) {
  if (req.cookies?.token || req.headers.authorization) return protect(req, res, next);
  next();
}

router.get('/', optionalAuth, getCourses);
router.get('/:id', optionalAuth, getCourse);

router.post(
  '/',
  protect,
  restrictTo('instructor', 'admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 150 }),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  createCourse
);

router.patch('/:id', protect, restrictTo('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, restrictTo('instructor', 'admin'), deleteCourse);
router.post('/:id/thumbnail', protect, restrictTo('instructor', 'admin'), upload.single('thumbnail'), uploadThumbnail);

router.get('/:courseId/enrollments', protect, restrictTo('instructor', 'admin'), getCourseEnrollments);

router.post(
  '/:id/lessons',
  protect,
  restrictTo('instructor', 'admin'),
  [body('title').trim().notEmpty().withMessage('Lesson title is required')],
  validate,
  addLesson
);
router.patch('/:id/lessons/:lessonId', protect, restrictTo('instructor', 'admin'), updateLesson);
router.delete('/:id/lessons/:lessonId', protect, restrictTo('instructor', 'admin'), deleteLesson);

export default router;
