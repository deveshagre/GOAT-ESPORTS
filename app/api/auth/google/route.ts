import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const clientId = process.env.AUTH_GOOGLE_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Google OAuth is not configured. Missing AUTH_GOOGLE_ID." }, { status: 500 });
  }

  const { searchParams, origin } = new URL(request.url);
  const redirectTo = searchParams.get("redirect") || "/?intro=1";

  // Callback URL
  const callbackUrl = `${origin}/api/auth/callback/google`;

  const state = Buffer.from(JSON.stringify({ redirectTo })).toString("base64url");

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", callbackUrl);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("state", state);
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl.toString());
}
