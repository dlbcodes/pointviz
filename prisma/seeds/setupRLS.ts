// prisma/seeds/setupRLS.ts
import postgres from "postgres";
import "dotenv/config";

const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!dbUrl) throw new Error("Missing DIRECT_URL/DATABASE_URL");
const sql = postgres(dbUrl);

async function main() {
	console.log("⏳ Setting up RLS...");
	try {
		// Enable RLS on both tables
		await sql`ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;`;
		await sql`ALTER TABLE public."Chart" ENABLE ROW LEVEL SECURITY;`;

		// User: a user can only see/update their own row
		await sql`DROP POLICY IF EXISTS "user_select_own" ON public."User";`;
		await sql`
			CREATE POLICY "user_select_own" ON public."User"
			FOR SELECT USING (auth.uid() = id::uuid);
		`;
		await sql`DROP POLICY IF EXISTS "user_update_own" ON public."User";`;
		await sql`
			CREATE POLICY "user_update_own" ON public."User"
			FOR UPDATE USING (auth.uid() = id::uuid);
		`;

		// Chart: owner can do everything with their charts
		await sql`DROP POLICY IF EXISTS "chart_all_own" ON public."Chart";`;
		await sql`
			CREATE POLICY "chart_all_own" ON public."Chart"
			FOR ALL USING (auth.uid() = "userId"::uuid);
		`;

		// Chart: ANYONE can read a PUBLIC chart (for /c/[slug] shared pages)
		await sql`DROP POLICY IF EXISTS "chart_select_public" ON public."Chart";`;
		await sql`
			CREATE POLICY "chart_select_public" ON public."Chart"
			FOR SELECT USING ("isPublic" = true);
		`;

		console.log("✅ RLS policies applied.");
	} catch (e) {
		console.error("❌ RLS setup error:", e);
		process.exitCode = 1;
	} finally {
		await sql.end();
		process.exit();
	}
}

main();