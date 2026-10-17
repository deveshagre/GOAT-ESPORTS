"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = "a[href], button:not(:disabled), [role='button']";
const NATIVE_CURSOR_SELECTOR = "input:not([type='button']):not([type='submit']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true'], [data-native-cursor], p, h1, h2, h3, h4, h5, h6, li, label, blockquote";

/** Progressive enhancement for a fine pointer. The native cursor remains the fallback. */
export function InteractionEffects() {
  const ringRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const body = document.body;
    const ring = ringRef.current;
    if (!ring) return;

    let targetX = 0;
    let targetY = 0;
    let ringX = 0;
    let ringY = 0;
    let hasPointer = false;
    let frameId = 0;
    let activeCard: HTMLElement | null = null;
    let cardTargetX = 0;
    let cardTargetY = 0;
    let cardX = 0;
    let cardY = 0;
    let activeMagnet: HTMLElement | null = null;
    let clickTimer = 0;
    let trailTimer = 0;

    const setPosition = (element: HTMLElement, x: number, y: number) => {
      element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const clearCard = () => {
      if (activeCard) {
        activeCard.classList.remove("is-cursor-tilting");
        activeCard.style.removeProperty("--cursor-tilt-x");
        activeCard.style.removeProperty("--cursor-tilt-y");
        activeCard.style.removeProperty("--cursor-art-x");
        activeCard.style.removeProperty("--cursor-art-y");
      }
      activeCard = null;
      cardTargetX = 0;
      cardTargetY = 0;
      cardX = 0;
      cardY = 0;
    };

    const clearMagnet = () => {
      activeMagnet?.style.removeProperty("--magnet-x");
      activeMagnet?.style.removeProperty("--magnet-y");
      activeMagnet = null;
    };

    const stopFrame = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const animate = () => {
      frameId = 0;
      if (!hasPointer || !body.classList.contains("cursor-visible")) return;

      ringX += (targetX - ringX) * 0.22;
      ringY += (targetY - ringY) * 0.22;
      setPosition(ring, ringX, ringY);

      if (activeCard) {
        cardX += (cardTargetX - cardX) * 0.26;
        cardY += (cardTargetY - cardY) * 0.26;
        activeCard.style.setProperty("--cursor-tilt-x", `${cardX.toFixed(2)}deg`);
        activeCard.style.setProperty("--cursor-tilt-y", `${cardY.toFixed(2)}deg`);
        activeCard.style.setProperty("--cursor-art-x", `${(targetX / window.innerWidth - .5) * -4}px`);
        activeCard.style.setProperty("--cursor-art-y", `${(targetY / window.innerHeight - .5) * -3}px`);
      }

      const ringMoving = Math.abs(targetX - ringX) > 0.25 || Math.abs(targetY - ringY) > 0.25;
      const cardMoving = activeCard && (Math.abs(cardTargetX - cardX) > 0.035 || Math.abs(cardTargetY - cardY) > 0.035);
      if (ringMoving || cardMoving) frameId = window.requestAnimationFrame(animate);
    };

    const queueFrame = () => {
      if (!frameId) frameId = window.requestAnimationFrame(animate);
    };

    const syncCapabilities = () => {
      const enabled = pointerMedia.matches && !motionMedia.matches;
      body.classList.toggle("cursor-enabled", enabled);
      if (!enabled) leave();
    };

    const leave = () => {
      hasPointer = false;
      body.classList.remove("cursor-visible", "cursor-native");
      ring.classList.remove("is-interactive", "is-button", "is-nav", "is-card", "is-pressed", "is-clicked", "is-fast");
      clearCard();
      clearMagnet();
      stopFrame();
      window.clearTimeout(clickTimer);
      window.clearTimeout(trailTimer);
      ring.style.setProperty("--trail-angle", "0deg");
      ring.style.setProperty("--trail-length", "0px");
      delete ring.dataset.pointerX;
      delete ring.dataset.pointerY;
      delete ring.dataset.pointerTime;
    };

    const updateHoverState = (event: PointerEvent) => {
      if (!pointerMedia.matches || motionMedia.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen") || !(event.target instanceof Element)) return;
      const target = event.target;
      if (target.closest(NATIVE_CURSOR_SELECTOR) && !target.closest(INTERACTIVE_SELECTOR)) {
        body.classList.add("cursor-native");
        ring.classList.remove("is-interactive", "is-button", "is-nav", "is-card");
        clearCard();
        clearMagnet();
        return;
      }

      body.classList.remove("cursor-native");
      const interactive = target.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      const card = target.closest<HTMLElement>(".game-directory-item, .platform-panel, .arena-card");
      const magnet = target.closest<HTMLElement>(".button, .header-cta");
      ring.classList.toggle("is-interactive", Boolean(interactive));
      ring.classList.toggle("is-button", Boolean(magnet));
      ring.classList.toggle("is-nav", Boolean(target.closest(".primary-nav a, .footer-nav a")));
      ring.classList.toggle("is-card", Boolean(card));

      if (activeCard !== card) {
        clearCard();
        activeCard = card;
        if (activeCard) activeCard.classList.add("is-cursor-tilting");
      }
      if (activeMagnet !== magnet) {
        clearMagnet();
        activeMagnet = magnet;
      }
    };

    const move = (event: PointerEvent) => {
      if (!pointerMedia.matches || motionMedia.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!hasPointer) {
        ringX = targetX;
        ringY = targetY;
        setPosition(ring, ringX, ringY);
      }
      hasPointer = true;
      body.classList.add("cursor-visible");

      const previousX = Number(ring.dataset.pointerX ?? targetX);
      const previousY = Number(ring.dataset.pointerY ?? targetY);
      const now = performance.now();
      const previousTime = Number(ring.dataset.pointerTime ?? now);
      const elapsed = Math.max(1, now - previousTime);
      const deltaX = targetX - previousX;
      const deltaY = targetY - previousY;
      const distance = Math.hypot(deltaX, deltaY);
      const speed = distance / elapsed;
      ring.dataset.pointerX = String(targetX);
      ring.dataset.pointerY = String(targetY);
      ring.dataset.pointerTime = String(now);
      ring.style.setProperty("--trail-angle", `${Math.atan2(deltaY, deltaX) * (180 / Math.PI)}deg`);
      ring.style.setProperty("--trail-length", `${Math.min(54, Math.max(14, speed * 23))}px`);
      window.clearTimeout(trailTimer);
      if (speed > 1.1) {
        ring.classList.add("is-fast");
        trailTimer = window.setTimeout(() => ring.classList.remove("is-fast"), 120);
      } else {
        ring.classList.remove("is-fast");
      }

      if (activeCard) {
        const bounds = activeCard.getBoundingClientRect();
        const relativeX = Math.max(-.5, Math.min(.5, (targetX - bounds.left) / bounds.width - .5)) * 2;
        const relativeY = Math.max(-.5, Math.min(.5, (targetY - bounds.top) / bounds.height - .5)) * 2;
        cardTargetX = relativeY * -3.5;
        cardTargetY = relativeX * 3.5;
      }
      if (activeMagnet) {
        const bounds = activeMagnet.getBoundingClientRect();
        activeMagnet.style.setProperty("--magnet-x", `${Math.max(-2.4, Math.min(2.4, (targetX - (bounds.left + bounds.width / 2)) / bounds.width * 4.8))}px`);
        activeMagnet.style.setProperty("--magnet-y", `${Math.max(-2, Math.min(2, (targetY - (bounds.top + bounds.height / 2)) / bounds.height * 4))}px`);
      }
      queueFrame();
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        leave();
        return;
      }
      if (!pointerMedia.matches || motionMedia.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      if (event.target instanceof Element && event.target.closest(NATIVE_CURSOR_SELECTOR) && !event.target.closest(INTERACTIVE_SELECTOR)) return;
      ring.classList.add("is-pressed", "is-clicked");
      window.clearTimeout(clickTimer);
      clickTimer = window.setTimeout(() => ring.classList.remove("is-clicked"), 280);
    };
    const up = () => ring.classList.remove("is-pressed");

    syncCapabilities();
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", updateHoverState, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    window.addEventListener("pointercancel", up, { passive: true });
    window.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    pointerMedia.addEventListener("change", syncCapabilities);
    motionMedia.addEventListener("change", syncCapabilities);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", updateHoverState);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      pointerMedia.removeEventListener("change", syncCapabilities);
      motionMedia.removeEventListener("change", syncCapabilities);
      leave();
      body.classList.remove("cursor-enabled", "cursor-visible", "cursor-native");
      ring.style.removeProperty("--trail-angle");
      ring.style.removeProperty("--trail-length");
      delete ring.dataset.pointerX;
      delete ring.dataset.pointerY;
      delete ring.dataset.pointerTime;
    };
  }, []);

  return (
    <div className="goat-cursor" aria-hidden="true">
      <span ref={ringRef} className="goat-cursor-ring" />
    </div>
  );
}

/** A small, RAF-coalesced parallax shift limited to the decorative hero artwork. */
export function HeroGlassMotion() {
  useEffect(() => {
    const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.querySelector<HTMLElement>(".hero");
    if (!hero) return;
    let pointerX = 0;
    let pointerY = 0;
    let frameId = 0;

    const render = () => {
      frameId = 0;
      const bounds = hero.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (pointerX - bounds.left) / bounds.width - .5));
      const y = Math.max(-.5, Math.min(.5, (pointerY - bounds.top) / bounds.height - .5));
      hero.style.setProperty("--glass-x", `${(x * 9).toFixed(2)}px`);
      hero.style.setProperty("--glass-y", `${(y * 7).toFixed(2)}px`);
      hero.style.setProperty("--hero-image-x", `${(x * -4).toFixed(2)}px`);
      hero.style.setProperty("--hero-image-y", `${(y * -3).toFixed(2)}px`);
      hero.style.setProperty("--glass-light-x", `${(50 + x * 20).toFixed(1)}%`);
      hero.style.setProperty("--glass-light-y", `${(45 + y * 18).toFixed(1)}%`);
    };
    const move = (event: PointerEvent) => {
      if (!pointerMedia.matches || motionMedia.matches || (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frameId) frameId = window.requestAnimationFrame(render);
    };
    const reset = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      hero.style.setProperty("--glass-x", "0px");
      hero.style.setProperty("--glass-y", "0px");
      hero.style.setProperty("--hero-image-x", "0px");
      hero.style.setProperty("--hero-image-y", "0px");
      hero.style.setProperty("--glass-light-x", "50%");
      hero.style.setProperty("--glass-light-y", "45%");
    };
    const syncCapabilities = () => {
      if (!pointerMedia.matches || motionMedia.matches) reset();
    };

    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    pointerMedia.addEventListener("change", syncCapabilities);
    motionMedia.addEventListener("change", syncCapabilities);
    return () => {
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      pointerMedia.removeEventListener("change", syncCapabilities);
      motionMedia.removeEventListener("change", syncCapabilities);
      reset();
    };
  }, []);

  return null;
}
