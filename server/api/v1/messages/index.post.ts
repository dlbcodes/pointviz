// server/api/v1/messages.post.ts
import { requireUser } from "~~/server/utils/auth";

const VALID_KINDS = ["help", "feedback"];

export default defineEventHandler(async (event) => {
	const { kind, subject, message, rating } = await readBody(event);

	if (!VALID_KINDS.includes(kind)) {
		throw createError({ statusCode: 400, statusMessage: "Invalid message kind." });
	}
	if (!message || !String(message).trim()) {
		throw createError({ statusCode: 400, statusMessage: "Message is required." });
	}

	// capture who sent it, if logged in
	const user = await requireUser(event).catch(() => null);

	const to = process.env.CONTACT_EMAIL;
	const from = process.env.EMAIL_FROM;
	const apiKey = process.env.RESEND_API_KEY;
	if (!to || !from || !apiKey) {
		throw createError({ statusCode: 500, statusMessage: "Email not configured." });
	}

	const label = kind === "help" ? "Help request" : "Feedback";
	await $fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: { Authorization: `Bearer ${apiKey}` },
		body: {
			from,
			to,
			reply_to: user?.email ?? undefined, // so you can reply straight to them
			subject: subject ? `[${label}] ${subject}` : `New ${label.toLowerCase()}`,
			text: [
				`${label} received.`,
				``,
				rating ? `Rating: ${rating}/5` : null,
				subject ? `Subject: ${subject}` : null,
				``,
				String(message).trim(),
				``,
				`— From: ${user?.email ?? "anonymous"}${user?.name ? ` (${user.name})` : ""}`,
			]
				.filter((l) => l !== null)
				.join("\n"),
		},
	});

	return { ok: true };
});