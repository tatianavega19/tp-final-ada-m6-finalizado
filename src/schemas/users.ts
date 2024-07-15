import { z } from "zod";

const User = z.object({
    username: z.string({required_error: "User name is required",}),
    fullname: z.string({required_error: "Full name is required",}),
    password: z
        .string({required_error: "Password is required",})
        .min(8, { message: "Must be 8 or more characters" })
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Must contain at least one digit" })
        .regex(/[@$!%*?&]/, { message: "Must contain at least one special character (@$!%*?&)",}),
    email: z
        .string({required_error: "Email is required",})
        .email(),
    birthdate: z.date({required_error: "Birth date is required",}),
    nationality: z.string({required_error: "Nationality is required",}),
});

const validateUser = (userData: any) => User.safeParse(userData);
const validatePartialUser = (userData: any) => User.partial().safeParse(userData);

export { validateUser, validatePartialUser };