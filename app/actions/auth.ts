"use server";

import { redirect } from "next/navigation";
import { authenticateUser, registerUser } from "@/lib/auth/users";
import { setSession, clearSession } from "@/lib/auth/session";

export type AuthActionResult = {
  success?: boolean;
  error?: string;
};

export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawRedirect = formData.get("redirectTo") as string;
  const redirectTo = (!rawRedirect || rawRedirect === "/account" || rawRedirect === "/admin") ? "/?intro=1" : rawRedirect;

  if (!email || !password) {
    return { error: "Please provide both email and password." };
  }

  const user = await authenticateUser(email, password);
  if (!user) {
    return { error: "Invalid email or password. Please try again." };
  }

  await setSession(user);
  redirect(redirectTo);
}

export async function registerAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const result = await registerUser(email, password, name);
  if (result.error || !result.user) {
    return { error: result.error || "Failed to create account." };
  }

  await setSession(result.user);
  redirect("/?intro=1");
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect("/login");
}
