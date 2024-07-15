import { Router } from "express";
import DB from '../controller/database';
import { authorizeUser } from "../middlewares/token-validator";
import UserController from "../controller/user";

const userRouter = Router();

userRouter.get('/', DB.testConnection);
userRouter.post('/user', UserController.createUser);
userRouter.post('/login', UserController.login);
userRouter.get('/me/:email', authorizeUser, UserController.getUser);
userRouter.patch('/me/:id', authorizeUser, UserController.updateUser);
userRouter.delete("/logout/:id", authorizeUser, UserController.logout);
userRouter.delete("/user/:id", authorizeUser, UserController.deleteUser); //No funciona

userRouter.use('*', (_req, res) => {res.status(404).json({ message: 'Resource not found' });});

export { userRouter };