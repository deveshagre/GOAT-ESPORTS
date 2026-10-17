import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const session = await getSession();
  const { redirect: redirectParam } = await searchParams;

  if (session) {
    redirect(redirectParam || "/");
  }

  return (
    <main className="public-page auth-page" id="home">
      <div className="auth-container">
        <LoginForm redirectTo={redirectParam} />
      </div>
    </main>
  );
}
