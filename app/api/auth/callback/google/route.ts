import { NextResponse } from "next/server";
import { setSession } from "@/lib/auth/session";
import { getUserByEmail, registerUser } from "@/lib/auth/users";
import type { UserRole } from "@/lib/auth/types";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`);
  }

  let redirectTo = "/account";
  try {
    if (state) {
      const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8"));
      if (parsed.redirectTo) redirectTo = parsed.redirectTo;
    }
  } catch {
    // default to /account
  }

  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  const redirectUri = `${origin}/api/auth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${origin}/login?error=missing_google_credentials`);
  }

  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      return NextResponse.redirect(`${origin}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch user profile from Google
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileResponse.ok) {
      return NextResponse.redirect(`${origin}/login?error=profile_fetch_failed`);
    }

    const googleUser = await profileResponse.json();
    const email = (googleUser.email as string)?.toLowerCase().trim();
    const name = (googleUser.name as string) || email.split("@")[0];

    // Check if user already exists
    let user = await getUserByEmail(email);

    // Determine role
    const configuredOwnerEmail = process.env.OWNER_EMAIL?.toLowerCase().trim();
    const isOwner = Boolean(configuredOwnerEmail && email === configuredOwnerEmail);

    if (!user) {
      // Auto-register new Google user with a random secure password
      const tempPass = `google_oauth_${Date.now()}_${Math.random().toString(36)}`;
      const reg = await registerUser(email, tempPass, name);
      user = reg.user ?? null;
    }

    if (user && isOwner && user.role !== "OWNER") {
      user.role = "OWNER";
    }

    const finalRole: UserRole = isOwner ? "OWNER" : (user?.role || "VISITOR");

    await setSession({
      id: user?.id || `user_google_${googleUser.sub}`,
      email,
      name: user?.name || name,
      role: finalRole,
    });

    if (!redirectTo || redirectTo === "/account" || redirectTo === "/admin") {
      redirectTo = "/?intro=1";
    }

    return NextResponse.redirect(`${origin}${redirectTo}`);
  } catch {
    return NextResponse.redirect(`${origin}/login?error=oauth_internal_error`);
  }
}
