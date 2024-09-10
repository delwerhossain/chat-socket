import express from 'express';
import { UserController } from './users.controller';

const router = express.Router();

// Define routes
router.post('/', UserController.createUser);
router.get('/', UserController.getAUser);
router.patch('/:id', UserController.updateAUser);

export const userRoutes = router;
