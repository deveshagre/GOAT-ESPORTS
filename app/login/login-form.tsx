"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loginAction, registerAction } from "@/app/actions/auth";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginState, loginFormAction, isLoginPending] = useActionState(loginAction, null);
  const [registerState, registerFormAction, isRegisterPending] = useActionState(registerAction, null);

  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const fillDemo = (email: string, pass: string) => {
    setEmailInput(email);
    setPasswordInput(pass);
  };

  const currentError = mode === "login" ? loginState?.error : registerState?.error;
  const isPending = mode === "login" ? isLoginPending : isRegisterPending;

  return (
    <div className="auth-card">
      <div className="auth-card-header">
        <Link href="/" className="auth-brand" aria-label="GOAT Esports Home">
          <Image
            src="/images/logo/goat-logo-header.svg"
            alt="GOAT Esports"
            width={180}
            height={46}
            priority
          />
        </Link>
        <p className="auth-eyebrow">PORTAL ACCESS</p>
        <h1 className="auth-title">
          {mode === "login" ? "AUTHENTICATE" : "CREATE ACCOUNT"}
        </h1>
        <p className="auth-subtitle">
          {mode === "login"
            ? "Sign in to access your player profile, roster schedule, or owner dashboard."
            : "Join the GOAT community to follow competitive fixtures and team updates."}
        </p>
      </div>

      {/* Google Sign-in */}
      <a
        href={`/api/auth/google${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
        className="auth-google-btn"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        <span>CONTINUE WITH GOOGLE</span>
      </a>

      <div className="auth-divider">
        <span>OR WITH EMAIL</span>
      </div>

      {/* Tabs */}
      <div className="auth-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-tab ${mode === "login" ? "is-active" : ""}`}
          onClick={() => setMode("login")}
        >
          SIGN IN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`auth-tab ${mode === "register" ? "is-active" : ""}`}
          onClick={() => setMode("register")}
        >
          REGISTER
        </button>
      </div>

      {/* Error alert */}
      {currentError && (
        <div className="auth-alert" role="alert">
          <span className="auth-alert-icon">⚠</span>
          <span>{currentError}</span>
        </div>
      )}

      {/* Form */}
      {mode === "login" ? (
        <form action={loginFormAction} className="auth-form">
          <input type="hidden" name="redirectTo" value={redirectTo || "/?intro=1"} />
          <div className="auth-field">
            <label htmlFor="login-email">EMAIL ADDRESS</label>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="e.g. owner@goatesports.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">PASSWORD</label>
            <input
              id="login-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={isPending} className="button button-red auth-submit">
            {isPending ? "VERIFYING..." : "SIGN IN TO PORTAL →"}
          </button>
        </form>
      ) : (
        <form action={registerFormAction} className="auth-form">
          <div className="auth-field">
            <label htmlFor="register-name">YOUR NAME / CALLSIGN</label>
            <input
              id="register-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Alex Hunter"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-email">EMAIL ADDRESS</label>
            <input
              id="register-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@domain.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-password">PASSWORD</label>
            <input
              id="register-password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              placeholder="Min 6 characters"
            />
          </div>

          <button type="submit" disabled={isPending} className="button button-red auth-submit">
            {isPending ? "CREATING..." : "COMPLETE REGISTRATION →"}
          </button>
        </form>
      )}

      {/* Quick Demo Credentials */}
      <div className="auth-demo-box">
        <p className="auth-demo-title">TEST CREDENTIALS (CLICK TO FILL):</p>
        <div className="auth-demo-buttons">
          <button
            type="button"
            className="auth-demo-btn auth-demo-btn--owner"
            onClick={() => {
              setMode("login");
              fillDemo("owner@goatesports.com", "goat2026");
            }}
          >
            <strong>OWNER</strong>
            <span>owner@goatesports.com</span>
          </button>

          <button
            type="button"
            className="auth-demo-btn auth-demo-btn--player"
            onClick={() => {
              setMode("login");
              fillDemo("player@goatesports.com", "goat2026");
            }}
          >
            <strong>PLAYER</strong>
            <span>player@goatesports.com</span>
          </button>

          <button
            type="button"
            className="auth-demo-btn auth-demo-btn--fan"
            onClick={() => {
              setMode("login");
              fillDemo("fan@goatesports.com", "goat2026");
            }}
          >
            <strong>VISITOR / FAN</strong>
            <span>fan@goatesports.com</span>
          </button>
        </div>
      </div>
    </div>
  );
}
