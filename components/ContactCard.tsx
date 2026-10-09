"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";

const TILT_VARS = ["--rx", "--ry", "--gx", "--gy"] as const;

function FlipHint() {
  return (
    <span className="contact-flip" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="55%" height="55%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-3-6.7" />
        <path d="M21 4v5h-5" />
      </svg>
    </span>
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
                src="/images/contact.jpeg"
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
                I work at the intersection of art, tools, and engineering.
              </span>
              <span className="contact-body">
                Building UI materials and Blueprints, writing pipeline tools in Python and C++, and
                helping teams ship LiveOps content faster.
              </span>
            </span>
            <FlipHint />
            <span className="contact-sheen" />
          </span>
        </span>
      </div>
    </div>
  );
}
