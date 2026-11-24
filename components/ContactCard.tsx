"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";

const TILT_VARS = ["--rx", "--ry", "--gx", "--gy"] as const;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function MouseIcon() {
  return (
    <svg {...iconProps}>
      <rect x="5" y="2" width="14" height="20" rx="7" />
      <path className="contact-flip-wheel" d="M12 6v4" />
    </svg>
  );
}

function TapIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 14a8 8 0 0 1-8 8" />
      <path d="M18 11v-1a2 2 0 0 0-4 0" />
      <path d="M14 10V9a2 2 0 0 0-4 0v1" />
      <path d="M10 9.5V4a2 2 0 0 0-4 0v10" />
      <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
    </svg>
  );
}

// Mouse icon + "Click" on mouse devices, finger + "Tap" on touch screens (swapped in CSS).
function FlipHint({ back = false }: { back?: boolean }) {
  return (
    <span className="contact-flip" aria-hidden="true">
      <span className="contact-flip-mouse">
        <MouseIcon />
        {back ? "Click to flip back" : "Click to flip"}
      </span>
      <span className="contact-flip-touch">
        <TapIcon />
        {back ? "Tap to flip back" : "Tap to flip"}
      </span>
    </span>
  );
}

// Same artwork as app/icon.svg (the favicon).
function CatMark() {
  return (
    <svg className="contact-mark" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="contact-mark-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c7d3ff" />
          <stop offset="1" stopColor="#7f95f0" />
        </linearGradient>
      </defs>
      <path fill="url(#contact-mark-bg)" d="M32 0C56.3 0 64 7.7 64 32S56.3 64 32 64 0 56.3 0 32 7.7 0 32 0Z" />
      <g fill="#101013">
        <path d="M14 34 16 12 29 24Z" />
        <path d="M50 34 48 12 35 24Z" />
        <ellipse cx="32" cy="37" rx="19" ry="16" />
      </g>
      <g fill="#c7d3ff">
        <ellipse cx="24.5" cy="36" rx="2.8" ry="4" />
        <ellipse cx="39.5" cy="36" rx="2.8" ry="4" />
        <path d="M29.5 43h5L32 46Z" />
      </g>
    </svg>
  );
}

export default function ContactCard() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const toggle = () => setFlipped((value) => !value);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    toggle();
  };

  // Tilt is driven from the un-tilted wrapper so the pointer rect stays stable.
  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    const y = Math.min(Math.max((event.clientY - rect.top) / rect.height, 0), 1);

    card.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
    card.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    card.style.setProperty("--gx", `${x * 100}%`);
    card.style.setProperty("--gy", `${y * 100}%`);
  };

  const resetTilt = () => {
    const card = cardRef.current;
    if (!card) return;
    TILT_VARS.forEach((name) => card.style.removeProperty(name));
  };

  return (
    <div
      className="contact-scene mx-auto w-full max-w-[30rem]"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={`contact-card focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-current ${flipped ? "is-flipped" : ""}`}
      >
        <span className="sr-only">Contact card. Press to flip it over.</span>
        <span className="contact-card-inner">
          <span className="contact-face contact-front" aria-hidden={flipped}>
            <CatMark />
            <span className="contact-front-body">
              <span className="contact-name">Rafael Dalmazo</span>
              <span className="contact-role">UI &amp; Tools Tech Artist</span>
              <span className="contact-divider" />
              <span className="contact-phrase">I do both. Please don&apos;t make me choose.</span>
            </span>
            <FlipHint />
            <span className="contact-sheen" />
          </span>

          <span className="contact-face contact-back" aria-hidden={!flipped}>
            <span className="contact-photo">
              <Image
                src={asset("/images/contact.jpeg")}
                alt="Portrait of Rafael Dalmazo"
                fill
                loading="eager"
                draggable={false}
                sizes="(min-width: 640px) 160px, 33vw"
                className="object-cover"
              />
            </span>
            <span className="contact-back-body">
              <span className="contact-bar" />
              <span className="contact-lead">
                I build the UI players touch, and the tools that ship it.
              </span>
              <span className="contact-body">
                Shaders, Widget Blueprints and C++/Python tools, from Fortnite battle passes to
                mobile LiveOps.
              </span>
            </span>
            <FlipHint back />
            <span className="contact-sheen" />
          </span>
        </span>
      </div>
    </div>
  );
}
