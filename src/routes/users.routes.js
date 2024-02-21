import { Router } from 'express';
import { UserController } from '../controllers/users.js';

export const usersRoutes = Router();

usersRoutes.post('/', UserController.create);
usersRoutes.get('/checkIn', UserController.checkIn);
usersRoutes.patch('/subPaid', UserController.subPaid);
