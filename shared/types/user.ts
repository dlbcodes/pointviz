// shared/types/user.ts
import { z } from "zod";

export const updateMeSchema = z
	.object({
		name: z.string().trim().min(1, "Name can't be empty.").max(80).optional(),
		avatarUrl: z.string().url("Must be a valid URL.").nullable().optional(),
	})
	.refine((d) => Object.keys(d).length > 0, { message: "Nothing to update." });

export type UpdateMeInput = z.infer<typeof updateMeSchema>;

export interface Me {
	id: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	plan: "FREE" | "PRO";
	customizeCount: number;
	customizeResetAt: string;
	createdAt: string;
}