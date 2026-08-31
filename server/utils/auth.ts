import type { H3Event } from "h3";
import { serverSupabaseClient } from "#supabase/server";

/**
 * Require an authenticated user. Returns the full validated User (has `.id`).
 * Uses getUser() which validates against the auth server (secure).
 * Throws 401 if not logged in.
 */
export const requireUser = async (event: H3Event) => {
	const supabase = await serverSupabaseClient(event);
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();
	if (error || !user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthorized. Please log in.",
		});
	}
	return user;
};

/** Convenience — just the id (throws 401 if not logged in). */
export const resolveUserId = async (event: H3Event): Promise<string> => {
	const user = await requireUser(event);
	return user.id;
};

/**
 * Best-effort user resolution — returns the user if logged in, else null.
 * Never throws. For endpoints that work for both anonymous and authed callers
 * (e.g. public template detail that also reports `hasAccess`, anonymous reports).
 */
export const optionalUser = async (event: H3Event) => {
	try {
		return await requireUser(event);
	} catch {
		return null;
	}
};