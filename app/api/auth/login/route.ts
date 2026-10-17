import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth/users";
import { setSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await authenticateUser(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await setSession(user);
    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
