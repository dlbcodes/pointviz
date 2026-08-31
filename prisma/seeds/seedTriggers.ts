import postgres from "postgres";
import "dotenv/config";

// DIRECT connection — creating triggers on the auth schema needs it,
// and it avoids the pooler for DDL.
const dbUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!dbUrl) {
	throw new Error("Couldn't find db url (set DIRECT_URL or DATABASE_URL)");
}
const sql = postgres(dbUrl);

async function main() {
	console.log("⏳ Setting up database triggers...");
	try {
		// On new signup → create a User row mirroring the auth user.
		await sql`
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
    INSERT INTO public."User" (id, email, name, "avatarUrl", "createdAt", "updatedAt")
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(
        NEW.raw_user_meta_data->>'name',
        NEW.raw_user_meta_data->>'full_name',
        split_part(NEW.email, '@', 1)
      ),
      COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
      ),
      NOW(),
      NOW()
    );
    RETURN NEW;
  END;
  $$;
`;

		await sql`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`;
		await sql`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE PROCEDURE public.handle_new_user();
    `;

		console.log("✅ Created 'handle_new_user' trigger.");
		console.log("🎉 Triggers set up successfully.");
	} catch (error) {
		console.error("❌ Error setting up triggers:", error);
		process.exitCode = 1;
	} finally {
		await sql.end();
		process.exit();
	}
}

main();