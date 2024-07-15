import { Request, Response } from 'express';
import { User } from '../model/user';
import { validateUser, validatePartialUser } from '../schemas/users';
import logger from '../utils/logs';

abstract class UserController {

    static async getUser(req: Request, res: Response) {
        const { email } = req.params;
        try {
            const user = await User.getUser(email);
            res.status(200).json(user);

        } catch (error) {
            res.status(404).json({ message: "User not found" });
        }
    }

    static async createUser(req: Request, res: Response) {
        const { username, fullname, email, nationality, password } = req.body;
        let { birthdate } = req.body;

        if (!username || !fullname || !email || !birthdate || !nationality || !password) {
            //logger.error('Missing required fields');
            return res.status(400).json({ error: 'data error' });
        }

        try {
            birthdate = new Date(birthdate);
            const validatedData = validateUser({
                username,
                fullname,
                password,
                email,
                birthdate,
                nationality,
            });

            if (!validatedData.success) {
                //logger.error(`The data entered is incorrect`);
                return res.status(400).json({
                    message:
                        "Incorrect data entered. Please check again. Password has to be at least 8 characters long, should include capital letters, numbers and special characters.",
                });
            }

            const response = await User.createUser(validatedData.data);
            //logger.info(`User created successfully`);
            return res.status(201).json(response);

        } catch (error) {
            //logger.error(`Error creating user`);
            return res.status(500).json({ message: "Error creating user" });
        }
    }

    static async updateUser(req: Request, res: Response) {
        const { id } = req.params;
        const userData = req.body;

        try {
            const { username, fullname, password, email, nationality } = req.body;
            let dataToValidate = req.body;
            let { birthdate } = req.body;
            if (birthdate) {
                birthdate = new Date(birthdate);
                dataToValidate = {
                    username,
                    fullname,
                    password,
                    email,
                    birthdate,
                    nationality,
                };
            }

            const validatedData = validatePartialUser(dataToValidate);
            if (!validatedData.success) {
                logger.error("Invalid data for update");
                return res.status(400).json({ message: "Invalid data for update" });
            }


            const result = await User.updateUser(id, userData);
            if (id == undefined) {
                logger.error(`User with ID "${id}" not found or no changes made`);
                return res.status(404).json({ message: 'Usuario no encontrado o no se realizaron cambios' });
            } else (id == id)
            logger.info(`User updated successfully`)
            return res.status(200).json({ message: 'User updated successfully' });

        } catch (error) {
            logger.error(`Error updating user`);
            return res.status(500).json({ error: 'Error updating user' });
        }
    }

    static async deleteUser(req: Request, res: Response) {
        const { id } = req.params;

        try {
            const deleted = await User.deleteUser(id);
            if (deleted === 0) {
                logger.error(`User with ID ${id} not found or no changes made`);
                return res.status(404).json({ message: 'User not found or no changes made' });
            }

            logger.info(`User deleted successfully with ID: ${id}`);
            return res.status(200).json({ message: 'User deleted successfully' });

        } catch (error) {
            logger.error(`Error deleting user`);
            return res.status(500).json({ message: 'Error deleting user' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const validatedData = validatePartialUser(req.body);
            if (!validatedData.success) {
               // logger.error("Invalid login credentials");
                return res.status(400).json({ message: "Invalid credentials" });
            }
    
            const { email, password } = validatedData.data as any;
            const user = await User.login({ email, password });
            
            if (!user) {
                //logger.error(`User with email ${email} not found or invalid credentials`);
                return res.status(401).json({ message: "Invalid credentials" });
            }
    
            const { accessToken, refreshToken } = user;
            //logger.info(`User logged in successfully`);
            
            res
                .status(200)
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    sameSite: "strict",
                })
                .set("Authorization", accessToken)
                .json({
                    message: "User logged in successfully",
                    accessToken: accessToken,
                });
    
        } catch (error) {
            //logger.error(`Error in login process`);
            return res.status(500).json({ message: "Error in login process" });
        }
    }
    
    static async logout(req: Request, res: Response) {
        const validatedData = validatePartialUser(req.body);
        if (!validatedData.success) {

            return res.status(400).json({ message: "Wrong credentials" });
        }

        const { email } = validatedData.data as any;

        const userLogOut = await User.logout(email);

        if (userLogOut == 200) {

            return res.status(200).json({ message: "Sucessful logout" });
        }

        return res.status(500).json({ message: "Error at logout" });
    }
}

export default UserController;