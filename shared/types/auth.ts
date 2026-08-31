import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email("Enter a valid email."),
	password: z.string().min(1, "Password is required."),
});

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required."),
	email: z.string().email("Enter a valid email."),
	password: z.string().min(8, "At least 8 characters."),
});

export const resetSchema = z.object({
	email: z.string().email("Enter a valid email."),
});

export const recoverSchema = z.object({
	password: z.string().min(8, "At least 8 characters."),
});

export const changePasswordSchema = z
	.object({
		password: z.string().min(8, "At least 8 characters."),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	});


export type LoginSchemaType = z.infer<typeof loginSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type ResetSchemaType = z.infer<typeof resetSchema>;
export type RecoverSchemaType = z.infer<typeof recoverSchema>;
export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;