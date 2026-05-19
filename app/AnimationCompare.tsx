"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import s from "./AnimationCompare.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Design tokens ─────────────────────────────────────────────────────────────
const FM_COLOR = "#a78bfa";
const FM_BG = "rgba(109,40,217,0.15)";
const GSAP_COLOR = "#34d399";
const GSAP_BG = "rgba(20,83,45,0.2)";

// ─── Layout helpers ─────────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: string }) {
  return (
    <h2
      style={{
        fontFamily: "Inter,sans-serif",
        fontSize: "clamp(22px,3vw,36px)",
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "-0.02em",
        margin: "0 0 8px",
      }}
    >
      {children}
    </h2>
  );
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        background: `${color}22`,
        border: `1px solid ${color}55`,
        borderRadius: 99,
        padding: "3px 12px",
        fontFamily: "monospace",
        fontSize: 11,
        fontWeight: 700,
        color,
        letterSpacing: "0.1em",
      }}
    >
      {label}
    </span>
  );
}

function DemoBox({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 12,
        background: `${color}66`,
        border: `2px solid ${color}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color,
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function CodeBlock({ code, color }: { code: string; color: string }) {
  return (
    <pre
      style={{
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${color}30`,
        borderRadius: 12,
        padding: "16px 20px",
        fontFamily: "'Fira Code',monospace",
        fontSize: 12,
        lineHeight: 1.75,
        color: "rgba(255,255,255,0.75)",
        margin: 0,
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {code}
    </pre>
  );
}

function DemoCard({
  color,
  badge,
  demo,
  code,
}: {
  color: string;
  badge: string;
  demo: React.ReactNode;
  code: string;
}) {
  return (
    <div
      style={{
        background: color === FM_COLOR ? FM_BG : GSAP_BG,
        border: `1px solid ${color}30`,
        borderRadius: 16,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge color={color} label={badge} />
      </div>
      <div
        style={{
          minHeight: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.2)",
          borderRadius: 12,
          padding: 20,
        }}
      >
        {demo}
      </div>
      <CodeBlock code={code} color={color} />
    </div>
  );
}

function SectionWrap({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        padding: "60px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <SectionTitle>{title}</SectionTitle>
      <p
        style={{
          fontFamily: "Inter,sans-serif",
          fontSize: 15,
          color: "rgba(255,255,255,0.4)",
          marginBottom: 32,
        }}
      >
        {desc}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 20,
        }}
      >
        {children}
      </div>
    </section>
  );
}

// A self-contained scrollable viewport for demos that need scroll-driven animation.
// height: visible height. innerHeight: total scrollable content height.
function ScrollBox({
  children,
  height = 340,
}: {
  children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode;
  height?: number;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={boxRef}
      style={{
        height,
        overflowY: "scroll",
        position: "relative",
        borderRadius: 12,
        background: "rgba(0,0,0,0.25)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(255,255,255,0.15) transparent",
      }}
    >
      {children(boxRef)}
    </div>
  );
}

// ─── 1. Basic Move ─────────────────────────────────────────────────────────────
function BasicMoveFramer() {
  return (
    <motion.div
      animate={{ x: 80 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <DemoBox color={FM_COLOR} label="BOX" />
    </motion.div>
  );
}

function BasicMoveGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      gsap.to(ref.current, { x: 80, duration: 0.8, ease: "power3.out" });
    },
    { scope: ref },
  );
  return (
    <div ref={ref}>
      <DemoBox color={GSAP_COLOR} label="BOX" />
    </div>
  );
}

// ─── 2. Hover ─────────────────────────────────────────────────────────────────
function HoverFramer() {
  return (
    <motion.div
      whileHover={{ scale: 1.15, y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <DemoBox color={FM_COLOR} label="HOVER" />
    </motion.div>
  );
}

function HoverGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const el = ref.current!;
      const enter = () =>
        gsap.to(el, { scale: 1.15, y: -6, duration: 0.3, ease: "back.out(2)" });
      const leave = () =>
        gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} style={{ cursor: "pointer" }}>
      <DemoBox color={GSAP_COLOR} label="HOVER" />
    </div>
  );
}

// ─── 3. Entrance ──────────────────────────────────────────────────────────────
function EntranceFramer() {
  const [key, setKey] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <DemoBox color={FM_COLOR} label="IN" />
      </motion.div>
      <button
        onClick={() => setKey((k) => k + 1)}
        style={{
          background: `${FM_COLOR}20`,
          border: `1px solid ${FM_COLOR}50`,
          borderRadius: 8,
          padding: "4px 14px",
          color: FM_COLOR,
          fontFamily: "monospace",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        replay
      </button>
    </div>
  );
}

function EntranceGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useGSAP(
    () => {
      const play = () =>
        gsap.fromTo(
          boxRef.current,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        );
      play();
      btn.current?.addEventListener("click", play);
      return () => btn.current?.removeEventListener("click", play);
    },
    { scope: containerRef },
  );
  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div ref={boxRef}>
        <DemoBox color={GSAP_COLOR} label="IN" />
      </div>
      <button
        ref={btn}
        style={{
          background: `${GSAP_COLOR}20`,
          border: `1px solid ${GSAP_COLOR}50`,
          borderRadius: 8,
          padding: "4px 14px",
          color: GSAP_COLOR,
          fontFamily: "monospace",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        replay
      </button>
    </div>
  );
}

// ─── 4. Heavy Stagger (20 elements — exposes FM delay drift) ──────────────────
// Framer: each element is a separate React instance with its own timer
// GSAP:   one call, one rAF tick, all elements share a single timeline
const STAGGER_COUNT = 20;
const STAGGER_PALETTE = [
  "#f472b6",
  "#fb923c",
  "#facc15",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#f87171",
  "#4ade80",
  "#38bdf8",
  "#c084fc",
];

function StaggerFramer() {
  const [key, setKey] = useState(0);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* 4 rows × 5 cols — all timed with JS delay, each is an isolated React animation */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 6,
        }}
      >
        {Array.from({ length: STAGGER_COUNT }).map((_, i) => (
          <motion.div
            key={`${key}-${i}`}
            initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                background: STAGGER_PALETTE[i % STAGGER_PALETTE.length],
              }}
            />
          </motion.div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
        }}
      >
        20 React instances · delay[i] × 0.06s
        <br />
        <span style={{ color: "#f87171" }}>
          last element waits {(19 * 0.06).toFixed(2)}s — timer drift visible
        </span>
      </p>
      <button
        onClick={() => setKey((k) => k + 1)}
        style={{
          background: `${FM_COLOR}20`,
          border: `1px solid ${FM_COLOR}50`,
          borderRadius: 8,
          padding: "4px 14px",
          color: FM_COLOR,
          fontFamily: "monospace",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        replay
      </button>
    </div>
  );
}

function StaggerGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  useGSAP(
    () => {
      const play = () =>
        gsap.fromTo(
          ".gsap-dot",
          { opacity: 0, y: 30, scale: 0.5, rotation: -45 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: {
              amount: 1.2, // total stagger duration spread across all 20
              from: "start", // can be "center", "edges", "random"
              grid: [4, 5],
            },
          },
        );
      play();
      btn.current?.addEventListener("click", play);
      return () => btn.current?.removeEventListener("click", play);
    },
    { scope: ref },
  );
  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5,1fr)",
          gap: 6,
        }}
      >
        {Array.from({ length: STAGGER_COUNT }).map((_, i) => (
          <div
            key={i}
            className="gsap-dot"
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: STAGGER_PALETTE[i % STAGGER_PALETTE.length],
            }}
          />
        ))}
      </div>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
        }}
      >
        20 DOM nodes · 1 gsap.fromTo() call
        <br />
        <span style={{ color: GSAP_COLOR }}>
          stagger grid:[4,5] amount:1.2s — zero timer drift
        </span>
      </p>
      <button
        ref={btn}
        style={{
          background: `${GSAP_COLOR}20`,
          border: `1px solid ${GSAP_COLOR}50`,
          borderRadius: 8,
          padding: "4px 14px",
          color: GSAP_COLOR,
          fontFamily: "monospace",
          fontSize: 11,
          cursor: "pointer",
        }}
      >
        replay
      </button>
    </div>
  );
}

// ─── 5. Sequence / Scrub Timeline (scroll-driven) ───────────────────────────────
// Visual: a glowing orb that slides in → expands with color shift → shrinks and fades out.
// A progress arc + phase label beneath make the 3 phases obvious.

const SEQ_PHASE_COLORS = ["#a78bfa", "#ec4899", "#38bdf8"] as const;
const SEQ_PHASE_LABELS = ["Slide In", "Expand", "Fade Out"] as const;
const SEQ_PHASE_SUBS = [
  "x -80→0 · opacity 0→1",
  "scale 1→2 · color shift",
  "opacity 1→0",
] as const;

// Thin arc progress bar drawn with SVG
function PhaseArc({ progress, color }: { progress: number; color: string }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <svg
      width={72}
      height={72}
      style={{ position: "absolute", top: 8, right: 8 }}
    >
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={3}
      />
      <circle
        cx={36}
        cy={36}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - progress)}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ transition: "none" }}
      />
      <text
        x={36}
        y={40}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={11}
        fontWeight={700}
        fill={color}
      >
        {Math.round(progress * 100)}%
      </text>
    </svg>
  );
}

function SequenceFramer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    offset: ["start start", "end end"],
  });

  const [prog, setProg] = useState(0);
  useEffect(
    () => scrollYProgress.on("change", (v) => setProg(v)),
    [scrollYProgress],
  );
  const phase = prog < 0.33 ? 0 : prog < 0.66 ? 1 : 2;
  const color = SEQ_PHASE_COLORS[phase];

  // Phase 1: slide in (0→0.33)
  const x = useTransform(scrollYProgress, [0, 0.33], [-80, 0]);
  // Phase 2: scale orb up then back (0.33→0.66)
  const orbScale = useTransform(
    scrollYProgress,
    [0.33, 0.5, 0.66],
    [1, 2.2, 1],
  );
  // opacity: fade in, hold, fade out
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.7, 1],
    [0, 1, 1, 0],
  );

  return (
    <div style={{ height: "300%", paddingTop: 12 }}>
      <div
        style={{
          position: "sticky",
          top: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* scene */}
        <motion.div style={{ x, opacity }}>
          <div
            style={{
              position: "relative",
              background: "rgba(0,0,0,0.35)",
              border: `1px solid ${color}35`,
              borderRadius: 20,
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              overflow: "hidden",
              minHeight: 160,
            }}
          >
            {/* glow bg */}
            <motion.div
              style={{ scale: orbScale }}
              transition={{ type: "tween" }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 40px 10px ${color}55`,
                  opacity: 0.9,
                }}
              />
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <p
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
                }}
              >
                {SEQ_PHASE_LABELS[phase]}
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 10,
                  color: "rgba(255,255,255,0.4)",
                  margin: "4px 0 0",
                }}
              >
                {SEQ_PHASE_SUBS[phase]}
              </p>
            </div>
            <PhaseArc progress={prog} color={color} />
          </div>
        </motion.div>
        {/* status */}
        <div
          style={{
            padding: "8px 14px",
            background: `${FM_COLOR}12`,
            border: `1px solid ${FM_COLOR}30`,
            borderRadius: 10,
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: FM_COLOR,
              margin: 0,
            }}
          >
            phase {phase + 1}/3 · scroll to advance
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "#f87171",
              margin: "2px 0 0",
            }}
          >
            each useTransform is 1 frame behind scroll
          </p>
        </div>
      </div>
    </div>
  );
}

function SequenceGSAP({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  // SVG arc refs
  const arcRef = useRef<SVGCircleElement>(null);
  const arcTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    const orb = orbRef.current;
    if (!scroller || !inner || !orb) return;

    const r = 28;
    const circ = 2 * Math.PI * r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: inner,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const phase = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          const color = SEQ_PHASE_COLORS[phase];
          if (labelRef.current)
            labelRef.current.textContent = SEQ_PHASE_LABELS[phase];
          if (subRef.current)
            subRef.current.textContent = SEQ_PHASE_SUBS[phase];
          if (statusRef.current)
            statusRef.current.textContent = `phase ${phase + 1}/3 · ${(p * 100).toFixed(0)}%`;
          if (arcRef.current) {
            arcRef.current.style.strokeDashoffset = String(circ * (1 - p));
            arcRef.current.style.stroke = color;
          }
          if (arcTextRef.current) {
            arcTextRef.current.textContent = `${Math.round(p * 100)}%`;
            arcTextRef.current.style.fill = color;
          }
          orb.style.boxShadow = `0 0 40px 10px ${color}55`;
          orb.style.background = color;
          inner.querySelector<HTMLDivElement>(".seq-scene")!.style.borderColor =
            `${color}35`;
        },
      },
    });
    // Phase 1: slide in
    tl.fromTo(
      inner.querySelector(".seq-scene")!,
      { x: -80, opacity: 0 },
      { x: 0, opacity: 1, ease: "power2.out" },
    )
      // Phase 2: expand orb
      .to(orb, { scale: 2.2, ease: "none" }, "<end")
      .to(orb, { scale: 1, ease: "power2.inOut" })
      // Phase 3: fade out
      .to(inner.querySelector(".seq-scene")!, {
        opacity: 0,
        ease: "power2.in",
      });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} style={{ height: "300%", paddingTop: 12 }}>
      <div
        style={{
          position: "sticky",
          top: 12,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div
          className="seq-scene"
          style={{
            position: "relative",
            background: "rgba(0,0,0,0.35)",
            border: `1px solid ${SEQ_PHASE_COLORS[0]}35`,
            borderRadius: 20,
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            overflow: "hidden",
            minHeight: 160,
          }}
        >
          <div
            ref={orbRef}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: SEQ_PHASE_COLORS[0],
              boxShadow: `0 0 40px 10px ${SEQ_PHASE_COLORS[0]}55`,
              opacity: 0.9,
            }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              ref={labelRef}
              style={{
                fontFamily: "Inter,sans-serif",
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                margin: 0,
              }}
            >
              Slide In
            </p>
            <p
              ref={subRef}
              style={{
                fontFamily: "monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.4)",
                margin: "4px 0 0",
              }}
            >
              {SEQ_PHASE_SUBS[0]}
            </p>
          </div>
          <svg
            width={72}
            height={72}
            style={{ position: "absolute", top: 8, right: 8 }}
          >
            <circle
              cx={36}
              cy={36}
              r={28}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={3}
            />
            <circle
              ref={arcRef}
              cx={36}
              cy={36}
              r={28}
              fill="none"
              stroke={SEQ_PHASE_COLORS[0]}
              strokeWidth={3}
              strokeDasharray={2 * Math.PI * 28}
              strokeDashoffset={2 * Math.PI * 28}
              strokeLinecap="round"
              transform="rotate(-90 36 36)"
            />
            <text
              ref={arcTextRef}
              x={36}
              y={40}
              textAnchor="middle"
              fontFamily="monospace"
              fontSize={11}
              fontWeight={700}
              fill={SEQ_PHASE_COLORS[0]}
            >
              0%
            </text>
          </svg>
        </div>
        <div
          style={{
            padding: "8px 14px",
            background: `${GSAP_COLOR}12`,
            border: `1px solid ${GSAP_COLOR}30`,
            borderRadius: 10,
          }}
        >
          <p
            ref={statusRef}
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: GSAP_COLOR,
              margin: 0,
            }}
          >
            phase 1/3 · scroll to advance
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: GSAP_COLOR,
              margin: "2px 0 0",
            }}
          >
            1 timeline · all props same rAF tick
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Heavy Scroll Parallax (8 layers) ────────────────────────────────────────
// Scene: layered SVG landscape — sky, stars, clouds, mountains (far/near), trees, ground.
// Each layer moves at a different speed. Scroll fast and watch FM layers desync.

// speeds: slow = far away (background), fast = close (foreground)
const PX_LAYERS = [
  { id: "sky", speed: 0.0, color: FM_COLOR },
  { id: "stars", speed: 0.08, color: FM_COLOR },
  { id: "cloud-far", speed: 0.18, color: FM_COLOR },
  { id: "mountain-far", speed: 0.35, color: FM_COLOR },
  { id: "cloud-near", speed: 0.5, color: FM_COLOR },
  { id: "mountain-near", speed: 0.65, color: FM_COLOR },
  { id: "trees", speed: 1.0, color: FM_COLOR },
  { id: "ground", speed: 1.4, color: FM_COLOR },
];

// SVG scene — one <g> per layer, each translated by scroll
function ParallaxScene({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 400 260"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{ display: "block" }}
    >
      {/* layer 0 – sky gradient */}
      <defs>
        <linearGradient
          id={`sky-${accent.slice(1)}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#050816" />
          <stop offset="100%" stopColor="#1a1040" />
        </linearGradient>
      </defs>
      <rect width={400} height={260} fill={`url(#sky-${accent.slice(1)})`} />

      {/* layer 1 – stars (small dots scattered high) */}
      <g id={`${accent}-stars`}>
        {[
          [30, 20],
          [80, 10],
          [140, 30],
          [200, 8],
          [260, 18],
          [320, 28],
          [370, 12],
          [60, 45],
          [170, 50],
          [300, 42],
          [350, 55],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={i % 3 === 0 ? 1.5 : 1}
            fill={accent}
            opacity={0.6 + (i % 3) * 0.15}
          />
        ))}
      </g>

      {/* layer 2 – clouds far */}
      <g id={`${accent}-cloud-far`} opacity={0.35}>
        <ellipse cx={80} cy={70} rx={50} ry={16} fill="#fff" />
        <ellipse cx={280} cy={55} rx={60} ry={14} fill="#fff" />
        <ellipse cx={170} cy={80} rx={40} ry={12} fill="#fff" />
      </g>

      {/* layer 3 – mountains far */}
      <g id={`${accent}-mountain-far`}>
        <polygon points="0,200 80,90 160,200" fill="#2e1b6e" />
        <polygon points="100,200 200,80 300,200" fill="#3b2080" />
        <polygon points="220,200 330,95 400,200" fill="#2a1660" />
        <polygon points="280,200 380,100 400,170 400,200" fill="#231450" />
      </g>

      {/* layer 4 – clouds near */}
      <g id={`${accent}-cloud-near`} opacity={0.55}>
        <ellipse cx={50} cy={110} rx={55} ry={18} fill="#c4b5fd" />
        <ellipse cx={320} cy={100} rx={65} ry={20} fill="#c4b5fd" />
      </g>

      {/* layer 5 – mountains near */}
      <g id={`${accent}-mountain-near`}>
        <polygon points="-20,260 60,145 160,260" fill={accent} opacity={0.55} />
        <polygon
          points="120,260 230,130 340,260"
          fill={accent}
          opacity={0.65}
        />
        <polygon
          points="280,260 370,148 420,220 420,260"
          fill={accent}
          opacity={0.5}
        />
      </g>

      {/* layer 6 – trees */}
      <g id={`${accent}-trees`}>
        {[20, 60, 110, 160, 210, 260, 310, 355].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${215 - (i % 3) * 8})`}>
            <rect x={-3} y={12} width={6} height={18} fill="#1e1040" />
            <polygon points="0,-2 12,18 -12,18" fill={accent} opacity={0.75} />
            <polygon points="0,-12 9,8 -9,8" fill={accent} opacity={0.9} />
          </g>
        ))}
      </g>

      {/* layer 7 – ground strip */}
      <g id={`${accent}-ground`}>
        <rect y={240} width={400} height={20} fill="#0d0820" />
        <rect y={236} width={400} height={6} fill={accent} opacity={0.25} />
      </g>
    </svg>
  );
}

function ScrollProgressBar({
  scrollerRef,
  color,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  color: string;
}) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [scrollerRef]);

  return (
    <div
      style={{
        position: "absolute",
        right: 6,
        top: 8,
        bottom: 8,
        width: 4,
        borderRadius: 2,
        background: "rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          borderRadius: 2,
          background: color,
          height: `${progress * 100}%`,
          transition: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${progress * 100}%`,
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}`,
        }}
      />
    </div>
  );
}

function ScrollParallaxFramer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    offset: ["start start", "end end"],
  });

  // one hook per layer — this is what causes 1-frame-late desync
  const y0 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[0].speed * -160],
  );
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[1].speed * -160],
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[2].speed * -160],
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[3].speed * -160],
  );
  const y4 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[4].speed * -160],
  );
  const y5 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[5].speed * -160],
  );
  const y6 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[6].speed * -160],
  );
  const y7 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PX_LAYERS[7].speed * -160],
  );
  const ys = [y0, y1, y2, y3, y4, y5, y6, y7];
  const layerIds = [
    `${FM_COLOR}-stars`,
    `${FM_COLOR}-cloud-far`,
    `${FM_COLOR}-mountain-far`,
    `${FM_COLOR}-cloud-near`,
    `${FM_COLOR}-mountain-near`,
    `${FM_COLOR}-trees`,
    `${FM_COLOR}-ground`,
  ];

  return (
    <div style={{ height: "350%", position: "relative" }}>
      <div className={s.parallaxViewport}>
        {/* base scene rendered once */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ParallaxScene accent={FM_COLOR} />
        </div>
        {/* each layer wrapped in its own motion.g equivalent via SVG overlay */}
        {ys.slice(1).map((y, i) => (
          <motion.div key={i} className={s.parallaxLayer} style={{ y }}>
            <svg
              viewBox="0 0 400 260"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              style={{ position: "absolute", inset: 0 }}
            >
              <use href={`#${layerIds[i]}`} />
            </svg>
          </motion.div>
        ))}
        {/* speed legend */}
        <div className={s.parallaxLabel}>
          {PX_LAYERS.slice(1).map((l) => (
            <div key={l.id} className={s.parallaxLabelRow}>
              <div
                className={s.parallaxLabelDot}
                style={{ background: FM_COLOR }}
              />
              <span className={s.parallaxLabelText} style={{ color: FM_COLOR }}>
                {l.id} ×{l.speed}
              </span>
            </div>
          ))}
        </div>
        <ScrollProgressBar scrollerRef={scrollerRef} color={FM_COLOR} />
        <p className={s.parallaxNote} style={{ color: "#f87171" }}>
          8 useTransform · 1 frame late each · desync at fast scroll
        </p>
      </div>
    </div>
  );
}

function ScrollParallaxGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const accent = GSAP_COLOR;
  const layerIds = [`${accent}-stars`,`${accent}-cloud-far`,`${accent}-mountain-far`,`${accent}-cloud-near`,`${accent}-mountain-near`,`${accent}-trees`,`${accent}-ground`];

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    if (!scroller || !inner) return;

    const tweens = PX_LAYERS.map((layer, i) => {
      const el = inner.querySelector<SVGUseElement | HTMLElement>(`.gpx-${i}`);
      if (!el || layer.speed === 0) return null;
      gsap.set(el, { y: 0 });
      return gsap.to(el, {
        y: layer.speed * -160,
        ease: "none",
        scrollTrigger: { trigger: inner, scroller, start: "top top", end: "bottom bottom", scrub: true },
      });
    });

    return () => tweens.forEach(t => { t?.scrollTrigger?.kill(); t?.kill(); });
  }, [scrollerRef]);

  return (
    <div ref={innerRef} style={{ height: "350%", position: "relative" }}>
      <div className={s.parallaxViewport}>
        {/* base scene */}
        <div style={{ position: "absolute", inset: 0 }}>
          <ParallaxScene accent={GSAP_COLOR} />
        </div>
        {/* each layer is a plain div GSAP moves directly — no React re-render per frame */}
        {PX_LAYERS.slice(1).map((_, i) => (
          <div key={i} className={`gpx-${i + 1} ${s.parallaxLayer}`}>
            <svg viewBox="0 0 400 260" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
              <use href={`#${layerIds[i]}`} />
            </svg>
          </div>
        ))}
        <div className={s.parallaxLabel}>
          {PX_LAYERS.slice(1).map((l) => (
            <div key={l.id} className={s.parallaxLabelRow}>
              <div className={s.parallaxLabelDot} style={{ background: GSAP_COLOR }} />
              <span className={s.parallaxLabelText} style={{ color: GSAP_COLOR }}>{l.id} ×{l.speed}</span>
            </div>
          ))}
        </div>
        <ScrollProgressBar scrollerRef={scrollerRef} color={GSAP_COLOR} />
        <p className={s.parallaxNote} style={{ color: GSAP_COLOR }}>8 tweens · batched scrub · all layers same rAF tick</p>
      </div>
    </div>
  );
}

// ─── 7. Card Stacking ────────────────────────────────────────────────────────────
// GSAP demos.gsap.com/card-stack pattern:
// All cards start stacked at top. Each card is sticky; as you scroll into its
// segment the PREVIOUS cards scale down + push up to reveal this card on top.
// Framer: useSpring gives springy overshoot. GSAP: scrub:true, instant 1:1.

const STACK_CARDS = [
  { label: "Product Design", sub: "UX · Figma · Systems",   color: "#a78bfa", bg: "rgba(109,40,217,0.7)"  },
  { label: "Frontend Dev",   sub: "React · Next.js · TS",   color: "#818cf8", bg: "rgba(79,70,229,0.7)"   },
  { label: "Animation",      sub: "GSAP · Framer · CSS",    color: "#f472b6", bg: "rgba(219,39,119,0.7)"  },
  { label: "Performance",    sub: "rAF · Compositor · GPU", color: "#38bdf8", bg: "rgba(14,165,233,0.7)"  },
];

// Each card occupies one scroll segment. Total inner height gives enough scroll room.
const CARD_H         = 100;
const CARD_SPACING   = 10;   // gap between stacked cards (peek amount)
const STACK_SEGMENT  = 280;  // scroll px allocated per card transition
const STACK_INNER_H  = STACK_CARDS.length * STACK_SEGMENT + 60;

// Card i sticks at top + i*CARD_SPACING so the deck is visible from the start.
// When card j > i is being scrolled in, card i scales to (1 - (j-i)*0.06) and
// translates up by (j-i)*CARD_SPACING to make room for the new card.

interface StackCardFMProps {
  card: typeof STACK_CARDS[number];
  i: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function StackCardFM({ card, i, total, scrollYProgress }: StackCardFMProps) {
  const stickyTop = i * CARD_SPACING;

  // This card shrinks as cards AFTER it arrive (progress goes past i/total).
  // At progress = (i+1)/total the next card is fully in → this card at final state.
  // Max shrink = (total-1-i) cards will land on top of this one.
  const maxCards = total - 1 - i;
  const scaleFrom = 1;
  const scaleTo = Math.max(0.7, 1 - maxCards * 0.06);
  const yTo = -(maxCards * CARD_SPACING);

  const rawScale = useTransform(
    scrollYProgress,
    [(i + 1) / total, 1],
    [scaleFrom, scaleTo],
  );
  const rawY = useTransform(scrollYProgress, [(i + 1) / total, 1], [0, yTo]);
  const scale = useSpring(rawScale, { stiffness: 260, damping: 28, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 260, damping: 28, mass: 0.5 });

  return (
    <motion.div
      style={{
        position: "sticky",
        top: stickyTop,
        zIndex: i + 1,
        scale,
        y,
        transformOrigin: "top center",
      }}
    >
      <div
        className={s.stackCard}
        style={{
          background: card.bg,
          borderColor: `${card.color}60`,
          height: CARD_H,
        }}
      >
        <div className={s.stackCardDot} style={{ background: card.color }} />
        <div style={{ flex: 1 }}>
          <p className={s.stackCardLabel}>{card.label}</p>
          <p className={s.stackCardSub}>{card.sub}</p>
        </div>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: card.color,
            opacity: 0.6,
          }}
        >
          {i + 1}/{total}
        </span>
      </div>
    </motion.div>
  );
}

function CardStackFramer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    offset: ["start start", "end end"],
  });
  return (
    <div style={{ height: STACK_INNER_H, padding: "0 4px" }}>
      {STACK_CARDS.map((card, i) => (
        <StackCardFM
          key={i}
          card={card}
          i={i}
          total={STACK_CARDS.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function CardStackGSAP({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    if (!scroller || !inner) return;

    const total = STACK_CARDS.length;
    const triggers: ScrollTrigger[] = [];

    STACK_CARDS.forEach((_, i) => {
      const el = inner.querySelector(`.gsc-${i}`) as HTMLElement | null;
      if (!el) return;
      const maxCards = total - 1 - i;
      if (maxCards === 0) return; // last card never shrinks

      // This card starts shrinking when card i+1 begins entering (progress > (i+1)/total)
      const st = ScrollTrigger.create({
        trigger: inner,
        scroller,
        start: `${((i + 1) / total) * 100}% top`,
        end: "100% top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          gsap.set(el, {
            scale: 1 - p * maxCards * 0.06,
            y: -(p * maxCards * CARD_SPACING),
            transformOrigin: "top center",
          });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [scrollerRef]);

  return (
    <div ref={innerRef} style={{ height: STACK_INNER_H, padding: "0 4px" }}>
      {STACK_CARDS.map((card, i) => (
        <div
          key={i}
          className={`gsc-${i}`}
          style={{ position: "sticky", top: i * CARD_SPACING, zIndex: i + 1 }}
        >
          <div
            className={s.stackCard}
            style={{
              background: card.bg,
              borderColor: `${card.color}60`,
              height: CARD_H,
            }}
          >
            <div
              className={s.stackCardDot}
              style={{ background: card.color }}
            />
            <div style={{ flex: 1 }}>
              <p className={s.stackCardLabel}>{card.label}</p>
              <p className={s.stackCardSub}>{card.sub}</p>
            </div>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: card.color,
                opacity: 0.6,
              }}
            >
              {i + 1}/{STACK_CARDS.length}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 8. Scroll Smoothing ──────────────────────────────────────────────────────
// Demo: a vertical track with a "target" hairline that moves 1:1 with scroll,
// and a large ball that tries to follow it — either via spring (FM) or scrub (GSAP).
// The gap between the hairline and the ball is the lag you're comparing.
// Ball travel: maps scrollTop 0→SMOOTH_SCROLL_HEIGHT to track top→bottom.

// ScrollBox height = 360px. Inner height = 360 + 340 = 700px → max scrollTop = 340px
const SMOOTH_SCROLL_HEIGHT = 340; // max scrollTop inside the 360px ScrollBox
const SMOOTH_INNER_HEIGHT = 700; // total inner content height
const TRACK_H = 200; // track height in px
const BALL_R = 18; // ball radius px

function SmoothTrack({
  targetPct,
  ballPct,
  color,
  note,
}: {
  targetPct: number; // 0–1 where the hairline is
  ballPct: number; // 0–1 where the ball is (may lag or overshoot)
  color: string;
  note: string;
}) {
  const trackTop = BALL_R;
  const trackBot = TRACK_H - BALL_R;
  const hairY = trackTop + targetPct * (trackBot - trackTop);
  const ballY = trackTop + ballPct * (trackBot - trackTop);
  const lag = Math.round((ballPct - targetPct) * (trackBot - trackTop));

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 80,
          height: TRACK_H,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        {/* track groove */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: BALL_R,
            bottom: BALL_R,
            width: 2,
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.1)",
            borderRadius: 1,
          }}
        />
        {/* target hairline */}
        <div
          style={{
            position: "absolute",
            left: 8,
            right: 8,
            top: hairY - 1,
            height: 2,
            background: "rgba(255,255,255,0.35)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 4,
            top: hairY - 8,
            fontFamily: "monospace",
            fontSize: 7,
            color: "rgba(255,255,255,0.4)",
            lineHeight: 1,
          }}
        >
          TGT
        </div>
        {/* ball */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: ballY,
            transform: "translate(-50%, -50%)",
            width: BALL_R * 2,
            height: BALL_R * 2,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 14px ${color}88`,
          }}
        />
        {/* lag indicator */}
        {Math.abs(lag) > 2 && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: Math.min(hairY, ballY),
              height: Math.abs(lag),
              width: 2,
              transform: "translateX(-50%)",
              background: lag > 0 ? "#f87171" : "#fb923c",
              opacity: 0.6,
            }}
          />
        )}
      </div>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: "rgba(255,255,255,0.35)",
          margin: 0,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {note}
      </p>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: 9,
          color: lag > 2 ? "#f87171" : lag < -2 ? "#fb923c" : GSAP_COLOR,
          margin: 0,
        }}
      >
        {Math.abs(lag) <= 2
          ? "frame-perfect"
          : lag > 0
            ? `lags +${lag}px`
            : `overshoots ${lag}px`}
      </p>
    </div>
  );
}

function ScrollSmoothingFramer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  // raw scrollTop → MotionValue → spring
  const rawY = useMotionValue(0);
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 14, mass: 0.8 });

  const [rawPct, setRawPct] = useState(0);
  const [smoothPct, setSmoothPct] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const pct = el.scrollTop / SMOOTH_SCROLL_HEIGHT;
      rawY.set(el.scrollTop);
      setRawPct(Math.min(pct, 1));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [rawY, scrollerRef]);

  useEffect(
    () =>
      smoothY.on("change", (v) =>
        setSmoothPct(Math.min(v / SMOOTH_SCROLL_HEIGHT, 1)),
      ),
    [smoothY],
  );

  return (
    <div style={{ height: SMOOTH_INNER_HEIGHT }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: "8px 14px",
            background: `${FM_COLOR}12`,
            border: `1px solid ${FM_COLOR}30`,
            borderRadius: 10,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: FM_COLOR,
              margin: "0 0 2px",
            }}
          >
            useSpring · stiffness:60 damping:14 mass:0.8
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            spring overshoots · lags on fast scroll · can&apos;t stop exactly on
            target
          </p>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          <SmoothTrack
            targetPct={rawPct}
            ballPct={rawPct}
            color="rgba(255,255,255,0.4)"
            note={"scroll\nposition\n(target)"}
          />
          <SmoothTrack
            targetPct={rawPct}
            ballPct={smoothPct}
            color={FM_COLOR}
            note={"spring\nball\n(FM)"}
          />
        </div>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.3)",
            margin: 0,
          }}
        >
          ↑ scroll inside this box
        </p>
      </div>
    </div>
  );
}

function ScrollSmoothingGSAP({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const [rawPct, setRawPct] = useState(0);
  const [ballPct, setBallPct] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    const ball = ballRef.current;
    if (!scroller || !inner || !ball) return;

    const trackTop = BALL_R;
    const trackBot = TRACK_H - BALL_R;

    const onScroll = () =>
      setRawPct(Math.min(scroller.scrollTop / SMOOTH_SCROLL_HEIGHT, 1));
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // scrub: 0.6 → ball catches up over ~0.6s (smooth but no overshoot)
    const tween = gsap.fromTo(
      ball,
      { y: trackTop },
      {
        y: trackBot,
        ease: "none",
        scrollTrigger: {
          trigger: inner,
          scroller,
          start: "top top",
          end: `+=${SMOOTH_SCROLL_HEIGHT}`,
          scrub: 0.6,
          onUpdate: (self) => setBallPct(self.progress),
        },
      },
    );

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollerRef]);

  const trackTop = BALL_R;
  const trackBot = TRACK_H - BALL_R;
  const hairY = trackTop + rawPct * (trackBot - trackTop);
  const lag = Math.round((ballPct - rawPct) * (trackBot - trackTop));

  return (
    <div ref={innerRef} style={{ height: SMOOTH_INNER_HEIGHT }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          paddingTop: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            padding: "8px 14px",
            background: `${GSAP_COLOR}12`,
            border: `1px solid ${GSAP_COLOR}30`,
            borderRadius: 10,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: GSAP_COLOR,
              margin: "0 0 2px",
            }}
          >
            scrub: 0.6 · linear ease · no overshoot
          </p>
          <p
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              margin: 0,
            }}
          >
            ball catches up over 0.6s · stops exactly · scrub:true =
            frame-perfect 0 lag
          </p>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* reference track — raw scroll */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 80,
                height: TRACK_H,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: BALL_R,
                  bottom: BALL_R,
                  width: 2,
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top: hairY - 1,
                  height: 2,
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 4,
                  top: hairY - 8,
                  fontFamily: "monospace",
                  fontSize: 7,
                  color: "rgba(255,255,255,0.4)",
                  lineHeight: 1,
                }}
              >
                TGT
              </div>
            </div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "rgba(255,255,255,0.35)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              scroll{"\n"}position{"\n"}(target)
            </p>
          </div>
          {/* GSAP ball — positioned by GSAP directly, no React state y */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                position: "relative",
                width: 80,
                height: TRACK_H,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: BALL_R,
                  bottom: BALL_R,
                  width: 2,
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 1,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  top: hairY - 1,
                  height: 2,
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: 1,
                }}
              />
              {Math.abs(lag) > 2 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: Math.min(
                      hairY,
                      trackTop + ballPct * (trackBot - trackTop),
                    ),
                    height: Math.abs(lag),
                    width: 2,
                    transform: "translateX(-50%)",
                    background: "#fb923c",
                    opacity: 0.6,
                  }}
                />
              )}
              <div
                ref={ballRef}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  transform: "translate(-50%, -50%)",
                  width: BALL_R * 2,
                  height: BALL_R * 2,
                  borderRadius: "50%",
                  background: GSAP_COLOR,
                  boxShadow: `0 0 14px ${GSAP_COLOR}88`,
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: "rgba(255,255,255,0.35)",
                margin: 0,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              scrub{"\n"}ball{"\n"}(GSAP)
            </p>
            <p
              style={{
                fontFamily: "monospace",
                fontSize: 9,
                color: Math.abs(lag) <= 2 ? GSAP_COLOR : "#fb923c",
                margin: 0,
              }}
            >
              {Math.abs(lag) <= 2 ? "frame-perfect" : `lags ${Math.abs(lag)}px`}
            </p>
          </div>
        </div>
 <p style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", margin: 0 }}>↑ scroll inside this box</p>
      </div>
    </div>
  );
}

// ─── 8.1 ScrollSmoother-style demo ───────────────────────────────────────────
// Inspired by demos.gsap.com/demo/smooth-scrolling/
// A sticky viewport with a dot-grid background + floating cards/circles.
// The WHOLE content wrapper lags behind scroll — creating the "smooth scroll" feel.
// Framer: useSpring on a wrapper Y. GSAP: scrub:N on a wrapper tween.
// Parallax: inner items also move at their own speeds within the lagging wrapper.

const SS_INNER_H  = 1200; // total scrollable height
const SS_TRAVEL   = 300;  // max px the content wrapper lags behind scroll

const SS_ITEMS = [
  { label: "Typography",  x: "12%",  y: 60,  size: 80,  speed: 0.4, color: "#a78bfa", shape: "rect"   },
  { label: "Motion",      x: "68%",  y: 110, size: 64,  speed: 0.9, color: "#f472b6", shape: "circle" },
  { label: "Layout",      x: "38%",  y: 200, size: 72,  speed: 0.2, color: "#34d399", shape: "rect"   },
  { label: "Performance", x: "78%",  y: 280, size: 56,  speed: 1.1, color: "#38bdf8", shape: "circle" },
  { label: "Color",       x: "22%",  y: 340, size: 88,  speed: 0.6, color: "#fb923c", shape: "rect"   },
  { label: "Interaction", x: "55%",  y: 420, size: 60,  speed: 1.4, color: "#facc15", shape: "circle" },
];

// dot grid background SVG
function DotGrid({ color }: { color: string }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`dots-${color.slice(1)}`} x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={color} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dots-${color.slice(1)})`} />
    </svg>
  );
}

function SSItem({ item, color, scrollPct }: { item: typeof SS_ITEMS[number]; color: string; scrollPct: number }) {
  const extraY = scrollPct * item.speed * -40; // each item drifts at its own speed
  return (
    <div style={{
      position: "absolute",
      left: item.x,
      top: item.y + extraY,
      width: item.size,
      height: item.size,
      borderRadius: item.shape === "circle" ? "50%" : 14,
      background: `${color}18`,
      border: `1.5px solid ${color}50`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backdropFilter: "blur(4px)",
    }}>
      <span style={{ fontFamily: "Inter,sans-serif", fontSize: 9, fontWeight: 700, color, textAlign: "center", lineHeight: 1.3 }}>{item.label}</span>
    </div>
  );
}

function ScrollSmootherFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const rawY    = useMotionValue(0);
  const smoothY = useSpring(rawY, { stiffness: 70, damping: 15, mass: 1.2 });
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const p = Math.min(el.scrollTop / SS_TRAVEL, 1);
      setPct(p);
      rawY.set(-(el.scrollTop * 0.28));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [rawY, scrollerRef]);

  return (
    <div style={{ height: SS_INNER_H }}>
      <div style={{ position: "sticky", top: 0, height: 300, overflow: "hidden", borderRadius: 10 }}>
        <motion.div style={{ y: smoothY, position: "relative", height: SS_INNER_H, background: "#07050f" }}>
          <DotGrid color={FM_COLOR} />
          {SS_ITEMS.map((item, i) => <SSItem key={i} item={item} color={FM_COLOR} scrollPct={pct} />)}
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontFamily: "monospace", fontSize: 9, color: `${FM_COLOR}80`, whiteSpace: "nowrap" }}>
            useSpring · whole page lags + overshoots
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ScrollSmootherGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef   = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner    = innerRef.current;
    const wrapper  = wrapperRef.current;
    if (!scroller || !inner || !wrapper) return;

    const onScroll = () => setPct(Math.min(scroller.scrollTop / SS_TRAVEL, 1));
    scroller.addEventListener("scroll", onScroll, { passive: true });

    const tween = gsap.fromTo(wrapper,
      { y: 0 },
      {
        y: -(SS_TRAVEL * 0.28),
        ease: "none",
        scrollTrigger: { trigger: inner, scroller, start: "top top", end: `+=${SS_TRAVEL}`, scrub: 1.5 },
      }
    );

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} style={{ height: SS_INNER_H }}>
      <div style={{ position: "sticky", top: 0, height: 300, overflow: "hidden", borderRadius: 10 }}>
        <div ref={wrapperRef} style={{ position: "relative", height: SS_INNER_H, background: "#07050f" }}>
          <DotGrid color={GSAP_COLOR} />
          {SS_ITEMS.map((item, i) => <SSItem key={i} item={item} color={GSAP_COLOR} scrollPct={pct} />)}
          <div style={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", fontFamily: "monospace", fontSize: 9, color: `${GSAP_COLOR}80`, whiteSpace: "nowrap" }}>
            scrub:1.5 · smooth deceleration, stops exactly
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 9. SVG Path Draw ─────────────────────────────────────────────────────────
const SVG_PATH =
  "M646.792 70.0006C468.654 75.3352 108.612 130.358 93.5518 307.77C78.4919 485.183 379.41 589.741 531.752 619.843C668.406 638.514 927.073 727.297 868.507 933.059C795.299 1190.26 596.593 1397.17 287.029 1422.32C-22.5346 1447.46 56.948 1089.67 171.989 1089.67C287.029 1089.67 554.76 1130.82 600.776 1907";

function PathDrawFramer({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    container: scrollerRef,
    offset: ["start start", "end end"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05], [0.2, 1]);

  return (
    <div style={{ height: "200%" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 947 1977"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="fm-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="12"
                floodColor={`${FM_COLOR}cc`}
              />
            </filter>
          </defs>
          {/* ghost */}
          <path
            d={SVG_PATH}
            fill="none"
            stroke={`${FM_COLOR}18`}
            strokeWidth={80}
            strokeLinecap="round"
          />
          {/* drawing path */}
          <motion.path
            d={SVG_PATH}
            fill="none"
            stroke={FM_COLOR}
            strokeWidth={80}
            strokeLinecap="round"
            style={{ pathLength, opacity: pathOpacity }}
            filter="url(#fm-glow)"
          />
        </svg>
        <p
          style={{
            position: "absolute",
            bottom: 8,
            fontFamily: "monospace",
            fontSize: 9,
            color: FM_COLOR,
            margin: 0,
          }}
        >
          motion pathLength · scroll to draw · 1 frame late
        </p>
      </div>
    </div>
  );
}

function PathDrawGSAP({
  scrollerRef,
}: {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;
    const path = pathRef.current;
    if (!scroller || !inner || !path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: inner,
        scroller,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} style={{ height: "200%" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <svg
          viewBox="0 0 947 1977"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="gsap-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="12"
                floodColor={`${GSAP_COLOR}cc`}
              />
            </filter>
          </defs>
          {/* ghost */}
          <path
            d={SVG_PATH}
            fill="none"
            stroke={`${GSAP_COLOR}18`}
            strokeWidth={80}
            strokeLinecap="round"
          />
          {/* drawing path */}
          <path
            ref={pathRef}
            d={SVG_PATH}
            fill="none"
            stroke={GSAP_COLOR}
            strokeWidth={80}
            strokeLinecap="round"
            filter="url(#gsap-glow)"
          />
        </svg>
        <p
          style={{
            position: "absolute",
            bottom: 8,
            fontFamily: "monospace",
            fontSize: 9,
            color: GSAP_COLOR,
            margin: 0,
          }}
        >
          strokeDashoffset · scrub:1 · same-frame draw
        </p>
      </div>
    </div>
  );
}

// ─── Scale Warning Banner ─────────────────────────────────────────────────────
function ScaleWarning() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 24px 40px",
      }}
    >
      <div
        style={{
          background: "rgba(251,191,36,0.08)",
          border: "1px solid rgba(251,191,36,0.3)",
          borderRadius: 14,
          padding: "20px 24px",
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
        <div>
          <p
            style={{
              fontFamily: "Inter,sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "rgba(251,191,36,0.9)",
              margin: "0 0 6px",
            }}
          >
            Scaling to a full page causes problems
          </p>
          <p
            style={{
              fontFamily: "Inter,sans-serif",
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              margin: 0,
              lineHeight: 1.65,
            }}
          >
            Every{" "}
            <code style={{ color: "#fbbf24", fontFamily: "monospace" }}>
              useScroll
            </code>{" "}
            /{" "}
            <code style={{ color: "#fbbf24", fontFamily: "monospace" }}>
              ScrollTrigger
            </code>{" "}
            instance adds a scroll listener and a per-frame calculation. Card
            stacking (N sticky contexts) + parallax (N useTransform chains) + a
            spring-based SmoothWrapper (negates native scroll for the whole
            page) all compound on top of each other. On a page with 20+ sections
            this causes{" "}
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>
              jank on mid-range devices
            </strong>{" "}
            — each react re-render from useSpring fires on the main thread, and
            GSAP ScrollTrigger has to recalculate N triggers on every scroll
            tick.
            <br />
            <br />
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>
              Mitigation:
            </strong>{" "}
            virtualize off-screen sections, batch ScrollTriggers with{" "}
            <code style={{ color: "#34d399", fontFamily: "monospace" }}>
              ScrollTrigger.batch()
            </code>
            , and avoid mixing SmoothWrapper + GSAP on the same page (they fight
            over the scroll position).
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function AnimationCompare() {
  return (
    <div style={{ background: "#070711", color: "#fff", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "80px 24px 40px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Badge color={FM_COLOR} label="FRAMER MOTION" />
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 20 }}>
            vs
          </span>
          <Badge color={GSAP_COLOR} label="GSAP" />
        </div>
        <h1
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(36px,6vw,80px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            background: "linear-gradient(135deg,#a78bfa,#fff 50%,#34d399)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0 0 16px",
          }}
        >
          Animation Comparison
        </h1>
        <p
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: 16,
            color: "rgba(255,255,255,0.35)",
            maxWidth: 520,
            margin: "0 auto",
          }}
        >
          เปรียบเทียบ code + live demo ทุก pattern — Left = Framer, Right = GSAP
        </p>
      </div>

      {/* 1. Basic Move */}
      <SectionWrap
        title="1. Basic Move"
        desc="เคลื่อนกล่องไปขวา 80px ทันทีตอน mount — x บวก = ขวา"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={<BasicMoveFramer />}
          code={`<motion.div
  animate={{ x: 80 }}
  transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
/>`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={<BasicMoveGSAP />}
          code={`useGSAP(() => {
  gsap.to(ref.current, {
    x: 80,
    duration: 0.8,
    ease: "power3.out"
  });
}, { scope: ref });`}
        />
      </SectionWrap>

      {/* 2. Hover */}
      <SectionWrap
        title="2. Hover Effect"
        desc="scale + lift เมื่อ hover — Framer ใช้ whileHover prop, GSAP ใช้ event listener"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={<HoverFramer />}
          code={`<motion.div
  whileHover={{ scale: 1.15, y: -6 }}
  transition={{ type: "spring", stiffness: 300 }}
/>`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={<HoverGSAP />}
          code={`useGSAP(() => {
  const enter = () => gsap.to(el, {
    scale: 1.15, y: -6, ease: "back.out(2)"
  });
  const leave = () => gsap.to(el, {
    scale: 1, y: 0, ease: "power2.out"
  });
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
}, { scope: ref });`}
        />
      </SectionWrap>

      {/* 3. Entrance */}
      <SectionWrap
        title="3. Entrance Animation"
        desc="fade + slide in ตอน mount — กด replay เพื่อดูซ้ำ"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={<EntranceFramer />}
          code={`<motion.div
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
/>`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={<EntranceGSAP />}
          code={`useGSAP(() => {
  gsap.fromTo(ref.current,
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.7,
      ease: "power3.out" }
  );
}, { scope: ref });`}
        />
      </SectionWrap>

      {/* 4. Heavy Stagger */}
      <SectionWrap
        title="4. Heavy Stagger (20 elements)"
        desc="Framer: 20 React instances แต่ละตัว schedule timer แยกกัน — GSAP: 1 call, stagger grid, zero drift"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={<StaggerFramer />}
          code={`// 20 React animation instances — each schedules its own timer
// Last element fires after 19 × 0.06 = 1.14s of accumulated delay
{Array.from({ length: 20 }).map((_, i) => (
  <motion.div
    initial={{ opacity:0, y:30, scale:0.5, rotate:-45 }}
    animate={{ opacity:1, y:0, scale:1, rotate:0 }}
    transition={{ delay: i * 0.06, duration: 0.5 }}
  />
))}`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={<StaggerGSAP />}
          code={`// 1 call — GSAP internally batches all 20 in one rAF tick
gsap.fromTo(".dot",
  { opacity:0, y:30, scale:0.5, rotation:-45 },
  {
    opacity:1, y:0, scale:1, rotation:0,
    duration: 0.5, ease: "power3.out",
    stagger: {
      amount: 1.2,   // total spread = 1.2s
      from: "start",
      grid: [4, 5],  // aware of 2D layout
    },
  }
)`}
        />
      </SectionWrap>

      {/* 5. Scroll-scrubbed Sequence */}
      <SectionWrap
        title="5. Scroll-scrubbed Sequence (3 phases)"
        desc="scrub a multi-step timeline by scroll position — เลื่อนใน box เพื่อดู — FM อ่าน scrollYProgress จาก frame ก่อน, GSAP อ่านตรงจาก scroll event"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={320}>
              {(ref) => <SequenceFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// 6 independent useTransform chains, each sampling
// scrollYProgress from the PREVIOUS rAF frame
const x      = useTransform(progress, [0, 0.33], [-80, 0]);
const rotate = useTransform(progress, [0.33, 0.66], [0, 360]);
const scale  = useTransform(progress, [0.33,0.5,0.66], [1,1.4,1]);
const yExit  = useTransform(progress, [0.66, 1], [0, -60]);
const opExit = useTransform(progress, [0,0.15,0.8,1], [0,1,1,0]);
// ⚠️ every chain is 1 frame behind scroll — compounds with scroll speed`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={320}>
              {(ref) => <SequenceGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// 1 timeline, all phases in one scrub call
// ScrollTrigger reads scrollY and applies tweens BEFORE paint
const tl = gsap.timeline({
  scrollTrigger: { trigger: ref.current, scrub: true },
});
tl.fromTo(".box", { x:-80, opacity:0 }, { x:0, opacity:1 })
  .to(".box", { rotation:360, scale:1.4 })
  .to(".box", { scale:1 })
  .to(".box", { y:-60, opacity:0 });
// onUpdate: reads self.progress — same frame as scroll`}
        />
      </SectionWrap>

      {/* 6. Heavy Parallax */}
      <SectionWrap
        title="6. Heavy Parallax (8 layers)"
        desc="เลื่อนเร็วๆ แล้วดูที่ FM side — 8 useScroll instances แต่ละตัว lag 1 frame → layers desync กัน"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={300}>
              {(ref) => <ScrollParallaxFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// 8 components × 3 useTransform each = 24 derived MotionValues
// all sampling scrollYProgress from the frame before scroll event
function Layer({ speed, rotate }) {
  const { scrollYProgress } = useScroll({ target: ref });
  const y  = useTransform(scrollYProgress, [0,1], [speed*80, -speed*80]);
  const r  = useTransform(scrollYProgress, [0,1], [0, rotate]);
  const op = useTransform(scrollYProgress, [0,0.15,0.85,1], [0.3,1,1,0.3]);
  return <motion.div style={{ y, rotate:r, opacity:op }} />;
}
// fast scroll → layers visibly desync by 1-2px between each other`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={300}>
              {(ref) => <ScrollParallaxGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// 8 ScrollTrigger instances, but GSAP batches them:
// all run inside a single ScrollTrigger.refresh() call per frame
PARALLAX_LAYERS.forEach((cfg, i) => {
  gsap.fromTo(\`.layer-\${i}\`,
    { y: cfg.speed*80, rotation:0, opacity:0.3 },
    {
      y: -cfg.speed*80, rotation: cfg.rotate, opacity:1,
      ease: "none",
      scrollTrigger: { scrub: true },
    }
  );
});
// All 8 layers update in same rAF tick — no desync`}
        />
      </SectionWrap>

      {/* 7. Card Stacking */}
      <SectionWrap
        title="7. Card Stacking"
        desc="cards stack on top of each other as you scroll — scrub drives scale + y offset"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={360}>
              {(ref) => <CardStackFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// Each card is its own component so hooks are valid
function StackCard({ scrollYProgress, i }) {
  const progress = useTransform(
    scrollYProgress, [i*0.25, (i+1)*0.25], [0, 1]
  );
  const scale = useTransform(progress, [0,1], [1, 0.9]);
  const y     = useTransform(progress, [0,1], [0, -28]);
  return <motion.div style={{ scale, y }} />;
}`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={360}>
              {(ref) => <CardStackGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`STACK_CARDS.forEach((_, i) => {
  gsap.to(\`.card-\${i}\`, {
    scale: 0.9, y: -28, ease: "none",
    scrollTrigger: {
      trigger: container,
      start: \`\${i*25}% start\`,
      end: \`\${(i+1)*25}% start\`,
      scrub: true,
    },
  });
});`}
        />
      </SectionWrap>

      {/* 8. Scroll Smoothing */}
      <SectionWrap
        title="8. Scroll Smoothing"
        desc="simulate GSAP ScrollSmoother — content lags behind native scroll with spring / scrub:N"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={360}>
              {(ref) => <ScrollSmoothingFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`const rawY   = useMotionValue(0);
const smoothY = useSpring(rawY, {
  stiffness: 80, damping: 18, mass: 0.5,
});
useEffect(() => {
  const sync = () => rawY.set(window.scrollY);
  window.addEventListener("scroll", sync);
  return () => window.removeEventListener("scroll", sync);
}, []);
// negate to move content UP
<motion.div style={{ y: useTransform(smoothY, v => -v) }} />`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={360}>
              {(ref) => <ScrollSmoothingGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// scrub: true  = frame-perfect (0 lag)
// scrub: 0.6   = 0.6s catch-up lag
gsap.fromTo(".box", { y: 20 }, {
  y: -20, ease: "none",
  scrollTrigger: {
    trigger: ref.current,
    scrub: 0.6,
  },
});`}
        />
      </SectionWrap>

      {/* 8.1 ScrollSmoother */}
      <SectionWrap
        title="8.1 ScrollSmoother"
        desc="whole page content lags behind scroll — dot grid + floating items show the smoothing effect clearly"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={360}>
              {(ref) => <ScrollSmootherFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`const rawY    = useMotionValue(0);
const smoothY = useSpring(rawY, {
  stiffness: 70, damping: 15, mass: 1.2,
});
useEffect(() => {
  el.addEventListener("scroll", () => {
    rawY.set(-(el.scrollTop * 0.28));
  });
}, []);
<motion.div style={{ y: smoothY }}> {/* whole page */}
  {content}
</motion.div>`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={360}>
              {(ref) => <ScrollSmootherGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`gsap.fromTo(wrapper, { y: 0 }, {
  y: -84,
  ease: "none",
  scrollTrigger: {
    trigger: inner,
    scroller,
    start: "top top",
    end: "+=300",
    scrub: 1.5, // catches up over 1.5s
  },
});`}
        />
      </SectionWrap>

      {/* 9. SVG Path Draw */}
      <SectionWrap
        title="9. SVG Path Draw"
        desc="path ถูก draw ตาม scroll — Framer ใช้ motion pathLength, GSAP ใช้ strokeDashoffset"
      >
        <DemoCard
          color={FM_COLOR}
          badge="FRAMER MOTION"
          demo={
            <ScrollBox height={340}>
              {(ref) => <PathDrawFramer scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// Framer Motion: animate pathLength with useTransform
const { scrollYProgress } = useScroll({ container: scrollerRef });
const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

<motion.path
  d={SVG_PATH}
  stroke={FM_COLOR}
  strokeWidth={3}
  fill="none"
  style={{ pathLength }}
/>
// ⚠️ pathLength is a MotionValue — 1 frame behind scroll`}
        />
        <DemoCard
          color={GSAP_COLOR}
          badge="GSAP"
          demo={
            <ScrollBox height={340}>
              {(ref) => <PathDrawGSAP scrollerRef={ref} />}
            </ScrollBox>
          }
          code={`// GSAP: strokeDasharray/strokeDashoffset trick
const length = path.getTotalLength();
gsap.set(path, {
  strokeDasharray: length,
  strokeDashoffset: length,
});
gsap.to(path, {
  strokeDashoffset: 0,
  ease: "none",
  scrollTrigger: {
    trigger: innerRef.current,
    scroller: scrollerRef.current,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
  },
});
// same-frame draw · batched with all ScrollTriggers`}
        />
      </SectionWrap>

      {/* Scale Warning */}
      <ScaleWarning />

      {/* Summary */}
      <section
        style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px 100px" }}
      >
        <h2
          style={{
            fontFamily: "Inter,sans-serif",
            fontSize: "clamp(22px,3vw,36px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
            marginBottom: 32,
          }}
        >
          Summary
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 16,
          }}
        >
          {[
            {
              pattern: "Basic Move",
              fm: "✅ animate prop",
              gsap: "✅ gsap.to()",
              winner: "FM (simpler)",
            },
            {
              pattern: "Hover",
              fm: "✅ whileHover prop",
              gsap: "⚠️ addEventListener",
              winner: "FM",
            },
            {
              pattern: "Entrance",
              fm: "✅ initial/animate",
              gsap: "✅ gsap.from()",
              winner: "เท่ากัน",
            },
            {
              pattern: "Heavy Stagger (20)",
              fm: "❌ 20 React timers · drift visible",
              gsap: "✅ 1 call · stagger grid · zero drift",
              winner: "GSAP",
            },
            {
              pattern: "Scrubbed Sequence",
              fm: "❌ 6 chains · each 1 frame late",
              gsap: "✅ 1 timeline · same-frame scrub",
              winner: "GSAP",
            },
            {
              pattern: "Heavy Parallax (8L)",
              fm: "❌ 8 useScroll · layers desync",
              gsap: "✅ batched · no desync",
              winner: "GSAP",
            },
            {
              pattern: "Card Stacking",
              fm: "✅ useTransform",
              gsap: "✅ scrub",
              winner: "เท่ากัน",
            },
            {
              pattern: "Scroll Smoothing",
              fm: "✅ useSpring",
              gsap: "✅ scrub: N",
              winner: "GSAP (less JS)",
            },
            {
              pattern: "SVG Path Draw",
              fm: "⚠️ motion pathLength · 1 frame late",
              gsap: "✅ strokeDashoffset · same-frame",
              winner: "GSAP",
            },
          ].map((row) => (
            <div
              key={row.pattern}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
                padding: 20,
              }}
            >
              <p
                style={{
                  fontFamily: "Inter,sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 12,
                }}
              >
                {row.pattern}
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: FM_COLOR,
                  marginBottom: 4,
                }}
              >
                FM: {row.fm}
              </p>
              <p
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: GSAP_COLOR,
                  marginBottom: 10,
                }}
              >
                GSAP: {row.gsap}
              </p>
              <span
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 6,
                  padding: "2px 10px",
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                winner: {row.winner}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
