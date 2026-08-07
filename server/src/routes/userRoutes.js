import { Router } from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { getUsers, updateUserRole, setUserActive, deleteUser } from '../controllers/userController.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/', getUsers);
router.patch('/:id/role', updateUserRole);
router.patch('/:id/active', setUserActive);
router.delete('/:id', deleteUser);

export default router;
