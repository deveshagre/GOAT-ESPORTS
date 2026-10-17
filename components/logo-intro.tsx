"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const INTRO_SESSION_KEY = "goat-esports-intro-seen-v1";
const INTRO_DURATION_MS = 2_000;

type PreviousPageState = {
  main: HTMLElement | null;
  mainWasInert: boolean;
  mainAriaHidden: string | null;
  bodyOverflow: string;
  documentOverflow: string;
  scrollY: number;
  focusedElement: HTMLElement | null;
};

export function LogoIntro({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const hasStartedRef = useRef(false);
  const skipButtonRef = useRef<HTMLButtonElement>(null);
  const previousPageStateRef = useRef<PreviousPageState | null>(null);

  const restorePage = useCallback(() => {
    const previous = previousPageStateRef.current;
    if (!previous) return;

    if (previous.main) {
      previous.main.inert = previous.mainWasInert;
      if (previous.mainAriaHidden === null) {
        previous.main.removeAttribute("aria-hidden");
      } else {
        previous.main.setAttribute("aria-hidden", previous.mainAriaHidden);
      }
    }
    document.body.style.overflow = previous.bodyOverflow;
    document.documentElement.style.overflow = previous.documentOverflow;
    window.scrollTo({ top: previous.scrollY, behavior: "instant" });

    if (previous.focusedElement?.isConnected) {
      previous.focusedElement.focus({ preventScroll: true });
    }
    previousPageStateRef.current = null;
  }, []);

  const finishIntro = useCallback(() => {
    restorePage();
    setIsVisible(false);
  }, [restorePage]);

  useEffect(() => {
    // If user navigates away from "/", allow intro to trigger again on return
    if (pathname !== "/") {
      hasStartedRef.current = false;
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Check if URL has ?intro=1 (e.g. freshly redirected from account creation or login)
    let forceIntro = false;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      forceIntro = params.get("intro") === "1";
      if (forceIntro) {
        window.history.replaceState({}, "", "/");
      }
    }

    // For non-logged-in visitors without forceIntro, check sessionStorage
    if (!isLoggedIn && !forceIntro) {
      let alreadySeen = false;
      try {
        alreadySeen = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
      } catch {
        // Storage disabled
      }
      if (alreadySeen) return;

      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "true");
      } catch {
        // Continue
      }
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.requestAnimationFrame(() => {
      const main = document.getElementById("site-content");
      const activeElement = document.activeElement;
      const focusedElement = activeElement instanceof HTMLElement ? activeElement : null;

      previousPageStateRef.current = {
        main,
        mainWasInert: main?.inert ?? false,
        mainAriaHidden: main?.getAttribute("aria-hidden") ?? null,
        bodyOverflow: document.body.style.overflow,
        documentOverflow: document.documentElement.style.overflow,
        scrollY: window.scrollY,
        focusedElement,
      };

      if (main) {
        main.inert = true;
        main.setAttribute("aria-hidden", "true");
      }
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      setIsVisible(true);
    });

  }, [pathname, isLoggedIn]);

  useEffect(() => {
    if (!isVisible) return;
    const timeoutId = window.setTimeout(finishIntro, INTRO_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [finishIntro, isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    skipButtonRef.current?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        finishIntro();
      } else if (event.key === "Tab") {
        event.preventDefault();
        skipButtonRef.current?.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [finishIntro, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="goat-intro" role="dialog" aria-modal="true" aria-labelledby="goat-intro-title">
      <h1 id="goat-intro-title" className="visually-hidden">GOAT Esports</h1>
      <Image className="intro-glass-art intro-glass-art-desktop" src="/images/goat-ruby-glass-shards-v2.png" alt="" fill sizes="100vw" aria-hidden="true" />
      <Image className="intro-glass-art intro-glass-art-mobile" src="/images/goat-ruby-glass-mobile-v2.png" alt="" fill sizes="100vw" aria-hidden="true" />
      <div className="goat-intro-sweep" aria-hidden="true" />
      <div className="goat-intro-mark" aria-hidden="true">
        <Image
          src="/images/logo/goat-logo-primary.svg"
          alt="GOAT Esports"
          width={280}
          height={260}
          priority
          sizes="(max-width: 640px) 70vw, 42svh"
          onError={finishIntro}
        />
      </div>
      <button ref={skipButtonRef} className="goat-intro-skip" type="button" onClick={finishIntro}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
