import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import AppError from '../utils/AppError.js';

const router = Router();

router.post('/', protect, upload.single('image'), (req, res, next) => {
  if (!req.file) return next(new AppError('No image file uploaded', 400));
  res.status(200).json({ success: true, data: { url: `/uploads/${req.file.filename}` } });
});

export default router;
