import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { enroll, getMyEnrollments, updateProgress } from '../controllers/enrollmentController.js';

const router = Router();

router.use(protect, restrictTo('student'));

router.get('/me', getMyEnrollments);
router.post('/:courseId', [body('cardNumber').optional().isString()], validate, enroll);
router.patch('/:courseId/progress', [body('lessonId').notEmpty()], validate, updateProgress);

export default router;
