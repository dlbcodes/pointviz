import { z } from "zod";

// ── help / feedback (contact messages, emailed to you) ──
export const messageKindSchema = z.enum(["help", "feedback"]);
export type MessageKind = z.infer<typeof messageKindSchema>;

export const helpInputSchema = z.object({
	kind: z.literal("help"),
	subject: z.string().min(1, "A subject is required"),
	message: z.string().min(1, "A message is required"),
});

export const feedbackInputSchema = z.object({
	kind: z.literal("feedback"),
	message: z.string().min(1, "Feedback can't be empty"),
	rating: z.number().int().min(1).max(5).optional(),
});

export const messageInputSchema = z.discriminatedUnion("kind", [
	helpInputSchema,
	feedbackInputSchema,
]);
export type MessageInput = z.infer<typeof messageInputSchema>;

// ── reports (moderation records, stored) ──
export const reportReasonSchema = z.enum([
	"copyright",
	"inappropriate",
	"spam",
	"broken",
	"other",
]);
export type ReportReason = z.infer<typeof reportReasonSchema>;

export const reportInputSchema = z.object({
	templateId: z.string().optional(),
	reason: reportReasonSchema,
	details: z.string().max(2000).nullable().optional(),
});
export type ReportInput = z.infer<typeof reportInputSchema>;