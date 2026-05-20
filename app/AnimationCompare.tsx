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

const FM_COLOR = "#a78bfa";
const GSAP_COLOR = "#34d399";

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function Badge({ color, label }: { color: string; label: string }) {
  const variantClass = color === FM_COLOR ? s.badgeFm : s.badgeGsap;
  return (
    <span className={`${s.badge} ${variantClass}`}>
      {label}
    </span>
  );
}

function DemoBox({ color, label }: { color: string; label: string }) {
  const boxClass = color === FM_COLOR ? s.demoBoxFm : s.demoBoxGsap;
  const labelClass = color === FM_COLOR ? s.demoBoxLabelFm : s.demoBoxLabelGsap;
  return (
    <div className={`${s.demoBox} ${boxClass}`}>
      <span className={`${s.demoBoxLabel} ${labelClass}`}>{label}</span>
    </div>
  );
}

function CodeBlock({ code, color }: { code: string; color: string }) {
  const variantClass = color === FM_COLOR ? s.codeFm : s.codeGsap;
  return <pre className={`${s.code} ${variantClass}`}>{code}</pre>;
}

function DemoCard({ color, badge, demo, code }: { color: string; badge: string; demo: React.ReactNode; code: string }) {
  const cardClass = color === FM_COLOR ? s.demoCardFm : s.demoCardGsap;
  return (
    <div className={`${s.demoCard} ${cardClass}`}>
      <Badge color={color} label={badge} />
      <div className={s.demoArea}>{demo}</div>
      <CodeBlock code={code} color={color} />
    </div>
  );
}

function SectionWrap({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className={s.section}>
      <h2 className={s.sectionTitle}>{title}</h2>
      <p className={s.sectionDesc}>{desc}</p>
      <div className={s.sectionGrid}>{children}</div>
    </section>
  );
}

function ScrollBox({ children, height = 340 }: { children: (ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={s.scrollBox} style={{ height }}>
      {children(ref)}
    </div>
  );
}

// ─── 1. Basic Move ─────────────────────────────────────────────────────────────

function BasicMoveFramer() {
  return (
    <motion.div animate={{ x: 80 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
      <DemoBox color={FM_COLOR} label="BOX" />
    </motion.div>
  );
}

function BasicMoveGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => { gsap.to(ref.current, { x: 80, duration: 0.8, ease: "power3.out" }); }, { scope: ref });
  return <div ref={ref}><DemoBox color={GSAP_COLOR} label="BOX" /></div>;
}

// ─── 2. Hover ──────────────────────────────────────────────────────────────────

function HoverFramer() {
  return (
    <motion.div whileHover={{ scale: 1.15, y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <DemoBox color={FM_COLOR} label="HOVER" />
    </motion.div>
  );
}

function HoverGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const el = ref.current!;
    const enter = () => gsap.to(el, { scale: 1.15, y: -6, duration: 0.3, ease: "back.out(2)" });
    const leave = () => gsap.to(el, { scale: 1, y: 0, duration: 0.3, ease: "power2.out" });
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); };
  }, { scope: ref });
  return <div ref={ref} className={s.cursorPointer}><DemoBox color={GSAP_COLOR} label="HOVER" /></div>;
}

// ─── 3. Entrance ───────────────────────────────────────────────────────────────

function EntranceFramer() {
  const [key, setKey] = useState(0);
  return (
    <div className={s.entranceWrap}>
      <motion.div key={key} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
        <DemoBox color={FM_COLOR} label="IN" />
      </motion.div>
      <button className={`${s.replayBtn} ${s.replayBtnFm}`} onClick={() => setKey((k) => k + 1)}>replay</button>
    </div>
  );
}

function EntranceGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const play = () => gsap.fromTo(boxRef.current, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    play();
    btnRef.current?.addEventListener("click", play);
    return () => btnRef.current?.removeEventListener("click", play);
  }, { scope: containerRef });
  return (
    <div ref={containerRef} className={s.entranceWrap}>
      <div ref={boxRef}><DemoBox color={GSAP_COLOR} label="IN" /></div>
      <button ref={btnRef} className={`${s.replayBtn} ${s.replayBtnGsap}`}>replay</button>
    </div>
  );
}

// ─── 4. Heavy Stagger ──────────────────────────────────────────────────────────

const STAGGER_PALETTE = ["#f472b6","#fb923c","#facc15","#34d399","#60a5fa","#a78bfa","#f87171","#4ade80","#38bdf8","#c084fc"];

function StaggerFramer() {
  const [key, setKey] = useState(0);
  return (
    <div className={s.staggerWrap}>
      <div className={s.staggerGrid}>
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div key={`${key}-${i}`} initial={{ opacity: 0, y: 30, scale: 0.5, rotate: -45 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}>
            <div className={s.staggerDot} style={{ background: STAGGER_PALETTE[i % 10] }} />
          </motion.div>
        ))}
      </div>
      <p className={s.staggerNote}>
        20 React instances · delay[i] × 0.06s<br />
        <span className={s.textRed}>last element waits {(19 * 0.06).toFixed(2)}s — timer drift visible</span>
      </p>
      <button className={`${s.replayBtn} ${s.replayBtnFm}`} onClick={() => setKey((k) => k + 1)}>replay</button>
    </div>
  );
}

function StaggerGSAP() {
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const play = () => gsap.fromTo(".gsap-dot", { opacity: 0, y: 30, scale: 0.5, rotation: -45 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.5, ease: "power3.out", stagger: { amount: 1.2, from: "start", grid: [4, 5] } });
    play();
    btnRef.current?.addEventListener("click", play);
    return () => btnRef.current?.removeEventListener("click", play);
  }, { scope: ref });
  return (
    <div ref={ref} className={s.staggerWrap}>
      <div className={s.staggerGrid}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`gsap-dot ${s.staggerDot}`} style={{ background: STAGGER_PALETTE[i % 10] }} />
        ))}
      </div>
      <p className={s.staggerNote}>
        20 DOM nodes · 1 gsap.fromTo() call<br />
        <span className={s.textGsap}>stagger grid:[4,5] amount:1.2s — zero timer drift</span>
      </p>
      <button ref={btnRef} className={`${s.replayBtn} ${s.replayBtnGsap}`}>replay</button>
    </div>
  );
}

// ─── 5. Scroll-scrubbed Sequence ───────────────────────────────────────────────

const SEQ_COLORS = ["#a78bfa", "#ec4899", "#38bdf8"] as const;
const SEQ_LABELS = ["Slide In", "Expand", "Fade Out"] as const;
const SEQ_SUBS   = ["x -80→0 · opacity 0→1", "scale 1→2 · color shift", "opacity 1→0"] as const;

function PhaseArc({ progress, color }: { progress: number; color: string }) {
  const r = 28, circ = 2 * Math.PI * r;
  return (
    <svg width={72} height={72} className={s.seqArcWrap}>
      <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
      <circle cx={36} cy={36} r={r} fill="none" stroke={color} strokeWidth={3} strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)} strokeLinecap="round" transform="rotate(-90 36 36)" style={{ transition: "none" }} />
      <text x={36} y={40} textAnchor="middle" fontFamily="monospace" fontSize={11} fontWeight={700} fill={color}>{Math.round(progress * 100)}%</text>
    </svg>
  );
}

function SequenceFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef, offset: ["start start", "end end"] });
  const [prog, setProg] = useState(0);
  useEffect(() => scrollYProgress.on("change", setProg), [scrollYProgress]);
  const phase = prog < 0.33 ? 0 : prog < 0.66 ? 1 : 2;
  const color = SEQ_COLORS[phase];
  const x = useTransform(scrollYProgress, [0, 0.33], [-80, 0]);
  const orbScale = useTransform(scrollYProgress, [0.33, 0.5, 0.66], [1, 2.2, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.12, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div className={s.scrollInner}>
      <div className={s.scrollSticky}>
        <motion.div style={{ x, opacity }}>
          <div className={s.seqScene} style={{ border: `1px solid ${color}35` }}>
            <motion.div style={{ scale: orbScale }}>
              <div className={s.seqOrb} style={{ background: color, boxShadow: `0 0 40px 10px ${color}55` }} />
            </motion.div>
            <div>
              <p className={s.seqLabel}>{SEQ_LABELS[phase]}</p>
              <p className={s.seqSub}>{SEQ_SUBS[phase]}</p>
            </div>
            <PhaseArc progress={prog} color={color} />
          </div>
        </motion.div>
        <div className={`${s.seqStatus} ${s.seqStatusFm}`}>
          <p className={`${s.seqStatusText} ${s.textFm}`}>phase {phase + 1}/3 · scroll to advance</p>
          <p className={`${s.seqStatusSub} ${s.textRed}`}>each useTransform is 1 frame behind scroll</p>
        </div>
      </div>
    </div>
  );
}

function SequenceGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const orbRef   = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const arcRef   = useRef<SVGCircleElement>(null);
  const arcTextRef = useRef<SVGTextElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current, orb = orbRef.current;
    if (!scroller || !inner || !orb) return;
    const r = 28, circ = 2 * Math.PI * r;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: inner, scroller, start: "top top", end: "bottom bottom", scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const phase = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
          const color = SEQ_COLORS[phase];
          if (labelRef.current) labelRef.current.textContent = SEQ_LABELS[phase];
          if (subRef.current) subRef.current.textContent = SEQ_SUBS[phase];
          if (statusRef.current) statusRef.current.textContent = `phase ${phase + 1}/3 · ${(p * 100).toFixed(0)}%`;
          if (arcRef.current) { arcRef.current.style.strokeDashoffset = String(circ * (1 - p)); arcRef.current.style.stroke = color; }
          if (arcTextRef.current) { arcTextRef.current.textContent = `${Math.round(p * 100)}%`; arcTextRef.current.style.fill = color; }
          orb.style.background = color;
          orb.style.boxShadow = `0 0 40px 10px ${color}55`;
          inner.querySelector<HTMLDivElement>(".seq-scene")!.style.borderColor = `${color}35`;
        },
      },
    });
    tl.fromTo(".seq-scene", { x: -80, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out" })
      .to(orbRef.current, { scale: 2.2, ease: "none" }, "<end")
      .to(orbRef.current, { scale: 1, ease: "power2.inOut" })
      .to(".seq-scene", { opacity: 0, ease: "power2.in" });

    return () => { tl.scrollTrigger?.kill(); tl.kill(); };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} className={s.scrollInner}>
      <div className={s.scrollSticky}>
        <div className={`seq-scene ${s.seqScene}`} style={{ border: `1px solid ${SEQ_COLORS[0]}35` }}>
          <div ref={orbRef} className={s.seqOrb} style={{ background: SEQ_COLORS[0], boxShadow: `0 0 40px 10px ${SEQ_COLORS[0]}55` }} />
          <div>
            <p ref={labelRef} className={s.seqLabel}>Slide In</p>
            <p ref={subRef} className={s.seqSub}>{SEQ_SUBS[0]}</p>
          </div>
          <svg width={72} height={72} className={s.seqArcWrap}>
            <circle cx={36} cy={36} r={28} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={3} />
            <circle ref={arcRef} cx={36} cy={36} r={28} fill="none" stroke={SEQ_COLORS[0]} strokeWidth={3} strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28} strokeLinecap="round" transform="rotate(-90 36 36)" />
            <text ref={arcTextRef} x={36} y={40} textAnchor="middle" fontFamily="monospace" fontSize={11} fontWeight={700} fill={SEQ_COLORS[0]}>0%</text>
          </svg>
        </div>
        <div className={`${s.seqStatus} ${s.seqStatusGsap}`}>
          <p ref={statusRef} className={`${s.seqStatusText} ${s.textGsap}`}>phase 1/3 · scroll to advance</p>
          <p className={s.seqStatusSub}>1 timeline · all props same rAF tick</p>
        </div>
      </div>
    </div>
  );
}

// ─── 6. Simple Parallax ────────────────────────────────────────────────────────

const PX_LAYERS = [
  { label: "BG",  speed: 0.2, color: "#a78bfa", size: 180 },
  { label: "MID", speed: 0.5, color: "#34d399", size: 120 },
  { label: "FG",  speed: 1.0, color: "#f472b6", size: 70  },
];

function SimpleParallaxFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef, offset: ["start start", "end end"] });
  const y0 = useTransform(scrollYProgress, [0, 1], [0, -200 * PX_LAYERS[0].speed]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200 * PX_LAYERS[1].speed]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200 * PX_LAYERS[2].speed]);
  const ys = [y0, y1, y2];

  return (
    <div className={s.parallaxInner1200}>
      <div className={s.pxScene}>
        {PX_LAYERS.map((layer, i) => (
          <motion.div key={i} className={s.pxLayer} style={{ y: ys[i], width: layer.size, height: layer.size, background: layer.color, boxShadow: `0 0 40px ${layer.color}88` }}>
            <span className={s.pxLayerLabel}>{layer.label}</span>
            <span className={s.pxLayerSpeed}>×{layer.speed}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SimpleParallaxGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current;
    if (!scroller || !inner) return;
    const tweens = PX_LAYERS.map((layer, i) => {
      const el = inner.querySelector<HTMLElement>(`.px-layer-${i}`);
      if (!el) return null;
      return gsap.to(el, { y: -200 * layer.speed, ease: "none", scrollTrigger: { trigger: inner, scroller, start: "top top", end: "bottom bottom", scrub: true } });
    });
    return () => tweens.forEach((t) => { t?.scrollTrigger?.kill(); t?.kill(); });
  }, [scrollerRef]);

  return (
    <div ref={innerRef} className={s.parallaxInner1200}>
      <div className={s.pxScene}>
        {PX_LAYERS.map((layer, i) => (
          <div key={i} className={`px-layer-${i} ${s.pxLayer}`} style={{ width: layer.size, height: layer.size, background: layer.color, boxShadow: `0 0 40px ${layer.color}88` }}>
            <span className={s.pxLayerLabel}>{layer.label}</span>
            <span className={s.pxLayerSpeed}>×{layer.speed}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. Heavy Parallax (desync demo) ──────────────────────────────────────────
// Framer: 8 DesyncBar components each with its own useSpring = 8 separate rAF subscribers.
// GSAP: single gsap.to() targeting all 8 in one rAF tick.

const HEAVY_COLORS = ["#f87171","#fb923c","#facc15","#4ade80","#34d399","#38bdf8","#818cf8","#e879f9"];
const DESYNC_TRAVEL = 260;

function DesyncBar({ index, scrollerRef }: { index: number; scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, DESYNC_TRAVEL]);
  const x = useSpring(raw, { stiffness: 120, damping: 20, mass: 1 });
  return (
    <motion.div className={s.desyncBar} style={{ x, top: 12 + index * 44, background: HEAVY_COLORS[index] }}>
      <span className={s.desyncBarLabel}>layer {index + 1}</span>
    </motion.div>
  );
}

function ScrollParallaxFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className={s.parallaxInner1200}>
      <div className={s.desyncScene}>
        <div className={s.desyncRefLine} style={{ left: 16 + DESYNC_TRAVEL }} />
        <div className={s.desyncRefLabel} style={{ left: 16 + DESYNC_TRAVEL + 4 }}>target</div>
        {Array.from({ length: 8 }).map((_, i) => <DesyncBar key={i} index={i} scrollerRef={scrollerRef} />)}
        <div className={`${s.desyncNote} ${s.textRed}`}>8 separate useSpring components → each re-renders at different time → stagger visible</div>
      </div>
    </div>
  );
}

function ScrollParallaxGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current;
    if (!scroller || !inner) return;
    const tween = gsap.to(".gpx-bar", { x: DESYNC_TRAVEL, ease: "power2.out", scrollTrigger: { trigger: inner, scroller, start: "top top", end: "bottom bottom", scrub: 0.5 } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} className={s.parallaxInner1200}>
      <div className={s.desyncScene}>
        <div className={s.desyncRefLine} style={{ left: 16 + DESYNC_TRAVEL }} />
        <div className={s.desyncRefLabel} style={{ left: 16 + DESYNC_TRAVEL + 4 }}>target</div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`gpx-bar ${s.desyncBar}`} style={{ top: 12 + i * 44, background: HEAVY_COLORS[i] }}>
            <span className={s.desyncBarLabel}>layer {i + 1}</span>
          </div>
        ))}
        <div className={`${s.desyncNote} ${s.textGsap}`}>1 gsap.to(&quot;.gpx-bar&quot;) call → all 8 bars move in exactly the same rAF tick</div>
      </div>
    </div>
  );
}

// ─── 7. Card Stacking ─────────────────────────────────────────────────────────
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

const CARD_H        = 100;
const CARD_SPACING  = 10;   // gap between stacked cards (peek amount)
const STACK_SEGMENT = 280;  // scroll px allocated per card transition
const STACK_INNER_H = STACK_CARDS.length * STACK_SEGMENT + 60;

interface StackCardFMProps {
  card: typeof STACK_CARDS[number];
  i: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}

function StackCardFM({ card, i, total, scrollYProgress }: StackCardFMProps) {
  const maxCards = total - 1 - i;
  const rawScale = useTransform(scrollYProgress, [(i + 1) / total, 1], [1, Math.max(0.7, 1 - maxCards * 0.06)]);
  const rawY     = useTransform(scrollYProgress, [(i + 1) / total, 1], [0, -(maxCards * CARD_SPACING)]);
  const scale    = useSpring(rawScale, { stiffness: 260, damping: 28, mass: 0.5 });
  const y        = useSpring(rawY,     { stiffness: 260, damping: 28, mass: 0.5 });

  return (
    <motion.div style={{ position: "sticky", top: i * CARD_SPACING, zIndex: i + 1, scale, y, transformOrigin: "top center" }}>
      <div className={s.stackCard} style={{ background: card.bg, borderColor: `${card.color}60`, height: CARD_H }}>
        <div className={s.stackCardDot} style={{ background: card.color }} />
        <div className={s.stackCardFlex}>
          <p className={s.stackCardLabel}>{card.label}</p>
          <p className={s.stackCardSub}>{card.sub}</p>
        </div>
        <span className={s.stackCardNum} style={{ color: card.color }}>{i + 1}/{total}</span>
      </div>
    </motion.div>
  );
}

function CardStackFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef, offset: ["start start", "end end"] });
  return (
    <div className={s.stackInner} style={{ height: STACK_INNER_H }}>
      {STACK_CARDS.map((card, i) => (
        <StackCardFM key={i} card={card} i={i} total={STACK_CARDS.length} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

function CardStackGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current;
    if (!scroller || !inner) return;
    const total = STACK_CARDS.length;
    const triggers: ScrollTrigger[] = [];

    STACK_CARDS.forEach((_, i) => {
      const el = inner.querySelector<HTMLElement>(`.gsc-${i}`);
      if (!el) return;
      const maxCards = total - 1 - i;
      if (maxCards === 0) return;

      const st = ScrollTrigger.create({
        trigger: inner,
        scroller,
        start: `${((i + 1) / total) * 100}% top`,
        end: "100% top",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(el, {
            scale: 1 - self.progress * maxCards * 0.06,
            y: -(self.progress * maxCards * CARD_SPACING),
            transformOrigin: "top center",
          });
        },
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, [scrollerRef]);

  return (
    <div ref={innerRef} className={s.stackInner} style={{ height: STACK_INNER_H }}>
      {STACK_CARDS.map((card, i) => (
        <div key={i} className={`gsc-${i}`} style={{ position: "sticky", top: i * CARD_SPACING, zIndex: i + 1 }}>
          <div className={s.stackCard} style={{ background: card.bg, borderColor: `${card.color}60`, height: CARD_H }}>
            <div className={s.stackCardDot} style={{ background: card.color }} />
            <div className={s.stackCardFlex}>
              <p className={s.stackCardLabel}>{card.label}</p>
              <p className={s.stackCardSub}>{card.sub}</p>
            </div>
            <span className={s.stackCardNum} style={{ color: card.color }}>{i + 1}/{STACK_CARDS.length}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 8. Scroll Smoothing ───────────────────────────────────────────────────────

const SMOOTH_MAX = 340;
const SMOOTH_INNER_H = 700;
const TRACK_H = 200;
const BALL_R = 18;

function SmoothTrack({ targetPct, ballPct, color, note }: { targetPct: number; ballPct: number; color: string; note: string }) {
  const top = BALL_R, bot = TRACK_H - BALL_R;
  const hairY = top + targetPct * (bot - top);
  const ballY = top + ballPct * (bot - top);
  const lag = Math.round((ballPct - targetPct) * (bot - top));
  const lagClass = lag > 0 ? s.smoothTrackLagRed : s.smoothTrackLagOrange;
  const lagTextClass = lag > 2 ? s.textRed : lag < -2 ? s.textOrange : s.textGsap;

  return (
    <div className={s.smoothTrackWrap}>
      <div className={s.smoothTrackBox}>
        <div className={s.smoothTrackGroove} />
        <div className={s.smoothTrackHairline} style={{ top: hairY - 1 }} />
        <div className={s.smoothTrackTgt} style={{ top: hairY - 8 }}>TGT</div>
        {Math.abs(lag) > 2 && (
          <div className={`${s.smoothTrackLag} ${lagClass}`} style={{ top: Math.min(hairY, ballY), height: Math.abs(lag) }} />
        )}
        <div className={s.smoothTrackBall} style={{ top: ballY, background: color, boxShadow: `0 0 14px ${color}88` }} />
      </div>
      <p className={s.smoothTrackNote}>{note}</p>
      <p className={`${s.smoothLagText} ${lagTextClass}`}>
        {Math.abs(lag) <= 2 ? "frame-perfect" : lag > 0 ? `lags +${lag}px` : `overshoots ${lag}px`}
      </p>
    </div>
  );
}

function ScrollSmoothingFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const rawY = useMotionValue(0);
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 14, mass: 0.8 });
  const [rawPct, setRawPct] = useState(0);
  const [smoothPct, setSmoothPct] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => { rawY.set(el.scrollTop); setRawPct(Math.min(el.scrollTop / SMOOTH_MAX, 1)); };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [rawY, scrollerRef]);

  useEffect(() => smoothY.on("change", (v) => setSmoothPct(Math.min(v / SMOOTH_MAX, 1))), [smoothY]);

  return (
    <div style={{ height: SMOOTH_INNER_H }}>
      <div className={s.smoothWrap}>
        <div className={`${s.smoothInfo} ${s.smoothInfoFm}`}>
          <p className={`${s.smoothInfoTitle} ${s.textFm}`}>useSpring · stiffness:60 damping:14 mass:0.8</p>
          <p className={s.smoothInfoSub}>spring overshoots · lags on fast scroll · can&apos;t stop exactly on target</p>
        </div>
        <div className={s.smoothTracksRow}>
          <SmoothTrack targetPct={rawPct} ballPct={rawPct} color="rgba(255,255,255,0.4)" note={"scroll\nposition\n(target)"} />
          <SmoothTrack targetPct={rawPct} ballPct={smoothPct} color={FM_COLOR} note={"spring\nball\n(FM)"} />
        </div>
        <p className={s.smoothHint}>↑ scroll inside this box</p>
      </div>
    </div>
  );
}

function ScrollSmoothingGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const ballRef  = useRef<HTMLDivElement>(null);
  const [rawPct, setRawPct] = useState(0);
  const [ballPct, setBallPct] = useState(0);

  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current, ball = ballRef.current;
    if (!scroller || !inner || !ball) return;
    const top = BALL_R, bot = TRACK_H - BALL_R;
    const onScroll = () => setRawPct(Math.min(scroller.scrollTop / SMOOTH_MAX, 1));
    scroller.addEventListener("scroll", onScroll, { passive: true });
    const tween = gsap.fromTo(ball, { y: top }, { y: bot, ease: "none", scrollTrigger: { trigger: inner, scroller, start: "top top", end: `+=${SMOOTH_MAX}`, scrub: 0.6, onUpdate: (self) => setBallPct(self.progress) } });
    return () => { scroller.removeEventListener("scroll", onScroll); tween.scrollTrigger?.kill(); tween.kill(); };
  }, [scrollerRef]);

  const top = BALL_R, bot = TRACK_H - BALL_R;
  const hairY = top + rawPct * (bot - top);
  const ballY = top + ballPct * (bot - top);
  const lag = Math.round((ballPct - rawPct) * (bot - top));
  const lagTextClass = Math.abs(lag) <= 2 ? s.textGsap : s.textOrange;

  return (
    <div ref={innerRef} style={{ height: SMOOTH_INNER_H }}>
      <div className={s.smoothWrap}>
        <div className={`${s.smoothInfo} ${s.smoothInfoGsap}`}>
          <p className={`${s.smoothInfoTitle} ${s.textGsap}`}>scrub: 0.6 · linear ease · no overshoot</p>
          <p className={s.smoothInfoSub}>ball catches up over 0.6s · stops exactly · scrub:true = frame-perfect 0 lag</p>
        </div>
        <div className={s.smoothTracksRow}>
          {/* raw scroll reference */}
          <div className={s.smoothTrackWrap}>
            <div className={s.smoothTrackBox}>
              <div className={s.smoothTrackGroove} />
              <div className={s.smoothTrackHairline} style={{ top: hairY - 1 }} />
              <div className={s.smoothTrackTgt} style={{ top: hairY - 8 }}>TGT</div>
            </div>
            <p className={s.smoothTrackNote}>{"scroll\nposition\n(target)"}</p>
          </div>
          {/* GSAP ball — moved directly by GSAP, no React state for position */}
          <div className={s.smoothTrackWrap}>
            <div className={s.smoothTrackBox}>
              <div className={s.smoothTrackGroove} />
              <div className={s.smoothTrackHairline} style={{ top: hairY - 1 }} />
              {Math.abs(lag) > 2 && (
                <div className={`${s.smoothTrackLag} ${s.smoothTrackLagOrange}`} style={{ top: Math.min(hairY, ballY), height: Math.abs(lag) }} />
              )}
              <div ref={ballRef} className={s.smoothTrackBall} style={{ top: 0, background: GSAP_COLOR, boxShadow: `0 0 14px ${GSAP_COLOR}88` }} />
            </div>
            <p className={s.smoothTrackNote}>{"scrub\nball\n(GSAP)"}</p>
            <p className={`${s.smoothLagText} ${lagTextClass}`}>
              {Math.abs(lag) <= 2 ? "frame-perfect" : `lags ${Math.abs(lag)}px`}
            </p>
          </div>
        </div>
        <p className={s.smoothHint}>↑ scroll inside this box</p>
      </div>
    </div>
  );
}

// ─── 9. SVG Path Draw ─────────────────────────────────────────────────────────

const SVG_PATH = "M646.792 70.0006C468.654 75.3352 108.612 130.358 93.5518 307.77C78.4919 485.183 379.41 589.741 531.752 619.843C668.406 638.514 927.073 727.297 868.507 933.059C795.299 1190.26 596.593 1397.17 287.029 1422.32C-22.5346 1447.46 56.948 1089.67 171.989 1089.67C287.029 1089.67 554.76 1130.82 600.776 1907";

function PathDrawFramer({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef, offset: ["start start", "end end"] });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 0.05], [0.2, 1]);
  return (
    <div className={s.pathScrollInner}>
      <div className={s.pathStickyScene}>
        <svg viewBox="0 0 947 1977" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <defs><filter id="fm-glow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={`${FM_COLOR}cc`} /></filter></defs>
          <path d={SVG_PATH} fill="none" stroke={`${FM_COLOR}18`} strokeWidth={80} strokeLinecap="round" />
          <motion.path d={SVG_PATH} fill="none" stroke={FM_COLOR} strokeWidth={80} strokeLinecap="round" style={{ pathLength, opacity: pathOpacity }} filter="url(#fm-glow)" />
        </svg>
        <p className={`${s.pathOverlayLabel} ${s.pathOverlayLabelFm}`}>motion pathLength · scroll to draw · 1 frame late</p>
      </div>
    </div>
  );
}

function PathDrawGSAP({ scrollerRef }: { scrollerRef: React.RefObject<HTMLDivElement | null> }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const pathRef  = useRef<SVGPathElement>(null);
  useEffect(() => {
    const scroller = scrollerRef.current, inner = innerRef.current, path = pathRef.current;
    if (!scroller || !inner || !path) return;
    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    const tween = gsap.to(path, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: inner, scroller, start: "top top", end: "bottom bottom", scrub: 1 } });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, [scrollerRef]);

  return (
    <div ref={innerRef} className={s.pathScrollInner}>
      <div className={s.pathStickyScene}>
        <svg viewBox="0 0 947 1977" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
          <defs><filter id="gsap-glow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="12" floodColor={`${GSAP_COLOR}cc`} /></filter></defs>
          <path d={SVG_PATH} fill="none" stroke={`${GSAP_COLOR}18`} strokeWidth={80} strokeLinecap="round" />
          <path ref={pathRef} d={SVG_PATH} fill="none" stroke={GSAP_COLOR} strokeWidth={80} strokeLinecap="round" filter="url(#gsap-glow)" />
        </svg>
        <p className={`${s.pathOverlayLabel} ${s.pathOverlayLabelGsap}`}>strokeDashoffset · scrub:1 · same-frame draw</p>
      </div>
    </div>
  );
}

// ─── Scale Warning ─────────────────────────────────────────────────────────────

function ScaleWarning() {
  return (
    <div className={s.warningWrap}>
      <div className={s.warningBox}>
        <span className={s.warningIcon}>⚠️</span>
        <div>
          <p className={s.warningTitle}>Scaling to a full page causes problems</p>
          <p className={s.warningBody}>
            Every <code className={s.warningCodeYellow}>useScroll</code> /{" "}
            <code className={s.warningCodeYellow}>ScrollTrigger</code> instance adds a scroll
            listener and a per-frame calculation. Card stacking + parallax + spring-based SmoothWrapper all compound.
            On 20+ sections this causes <strong className={s.warningStrong}>jank on mid-range devices</strong>.<br /><br />
            <strong className={s.warningStrong}>Mitigation:</strong> virtualize off-screen sections,
            use <code className={s.warningCodeGsap}>ScrollTrigger.batch()</code>, and avoid
            mixing SmoothWrapper + GSAP on the same page.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Summary ───────────────────────────────────────────────────────────────────

const SUMMARY_ROWS = [
  { pattern: "1. Basic Move",          fm: "✅ animate prop",                        gsap: "✅ gsap.to()",                          winner: "FM (simpler)" },
  { pattern: "2. Hover Effect",        fm: "✅ whileHover prop",                     gsap: "⚠️ addEventListener",                   winner: "FM" },
  { pattern: "3. Entrance",            fm: "✅ initial/animate",                     gsap: "✅ gsap.fromTo()",                       winner: "เท่ากัน" },
  { pattern: "4. Heavy Stagger (20)",  fm: "❌ 20 React timers · drift visible",     gsap: "✅ 1 call · stagger grid · zero drift",  winner: "GSAP" },
  { pattern: "5. Scrubbed Sequence",   fm: "❌ 6 useTransform chains · 1 frame late", gsap: "✅ 1 timeline · same-frame scrub",      winner: "GSAP" },
  { pattern: "6. Simple Parallax",     fm: "✅ useTransform per layer",              gsap: "✅ gsap.to() per layer",                 winner: "เท่ากัน" },
  { pattern: "6. Heavy Parallax (8L)", fm: "❌ 8 useSpring · layers desync",         gsap: "✅ batched · no desync",                 winner: "GSAP" },
  { pattern: "7. Card Stacking",       fm: "✅ sticky + useSpring scale/y",          gsap: "✅ sticky + ScrollTrigger onUpdate",     winner: "เท่ากัน" },
  { pattern: "8. Scroll Smoothing",    fm: "⚠️ useSpring (overshoots)",              gsap: "✅ scrub:N (no overshoot)",              winner: "GSAP (less JS)" },
  { pattern: "9. SVG Path Draw",       fm: "⚠️ motion pathLength · 1 frame late",   gsap: "✅ strokeDashoffset · same-frame",       winner: "GSAP" },
];

// ─── Root ──────────────────────────────────────────────────────────────────────

export default function AnimationCompare() {
  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.headerBadges}>
          <Badge color={FM_COLOR} label="FRAMER MOTION" />
          <span className={s.headerVs}>vs</span>
          <Badge color={GSAP_COLOR} label="GSAP" />
        </div>
        <h1 className={s.h1}>Animation Comparison</h1>
        <p className={s.headerSub}>เปรียบเทียบ code + live demo ทุก pattern — Left = Framer, Right = GSAP</p>
      </div>

      <SectionWrap title="1. Basic Move" desc="เคลื่อนกล่องไปขวา 80px ทันทีตอน mount">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION" demo={<BasicMoveFramer />}
          code={`<motion.div
  animate={{ x: 80 }}
  transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
/>`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP" demo={<BasicMoveGSAP />}
          code={`useGSAP(() => {
  gsap.to(ref.current, {
    x: 80, duration: 0.8, ease: "power3.out"
  });
}, { scope: ref });`} />
      </SectionWrap>

      <SectionWrap title="2. Hover Effect" desc="scale + lift เมื่อ hover — Framer ใช้ whileHover prop, GSAP ใช้ event listener">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION" demo={<HoverFramer />}
          code={`<motion.div
  whileHover={{ scale: 1.15, y: -6 }}
  transition={{ type: "spring", stiffness: 300 }}
/>`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP" demo={<HoverGSAP />}
          code={`useGSAP(() => {
  const enter = () => gsap.to(el, { scale:1.15, y:-6, ease:"back.out(2)" });
  const leave = () => gsap.to(el, { scale:1, y:0, ease:"power2.out" });
  el.addEventListener("mouseenter", enter);
  el.addEventListener("mouseleave", leave);
}, { scope: ref });`} />
      </SectionWrap>

      <SectionWrap title="3. Entrance Animation" desc="fade + slide in ตอน mount — กด replay เพื่อดูซ้ำ">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION" demo={<EntranceFramer />}
          code={`<motion.div
  initial={{ opacity: 0, y: 32 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
/>`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP" demo={<EntranceGSAP />}
          code={`useGSAP(() => {
  gsap.fromTo(ref.current,
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
  );
}, { scope: ref });`} />
      </SectionWrap>

      <SectionWrap title="4. Heavy Stagger (20 elements)" desc="Framer: 20 React instances แต่ละตัว schedule timer แยกกัน — GSAP: 1 call, stagger grid, zero drift">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION" demo={<StaggerFramer />}
          code={`{Array.from({ length: 20 }).map((_, i) => (
  <motion.div
    initial={{ opacity:0, y:30, scale:0.5, rotate:-45 }}
    animate={{ opacity:1, y:0, scale:1, rotate:0 }}
    transition={{ delay: i * 0.06, duration: 0.5 }}
  />
))}`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP" demo={<StaggerGSAP />}
          code={`gsap.fromTo(".dot",
  { opacity:0, y:30, scale:0.5, rotation:-45 },
  {
    opacity:1, y:0, scale:1, rotation:0,
    duration: 0.5, ease: "power3.out",
    stagger: { amount:1.2, from:"start", grid:[4,5] },
  }
)`} />
      </SectionWrap>

      <SectionWrap title="5. Scroll-scrubbed Sequence (3 phases)" desc="scrub a multi-step timeline — เลื่อนใน box เพื่อดู">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION"
          demo={<ScrollBox height={320}>{(ref) => <SequenceFramer scrollerRef={ref} />}</ScrollBox>}
          code={`const x        = useTransform(progress, [0,0.33], [-80,0]);
const orbScale = useTransform(progress, [0.33,0.5,0.66], [1,2.2,1]);
const opacity  = useTransform(progress, [0,0.12,0.7,1], [0,1,1,0]);
// ⚠️ each chain is 1 frame behind scroll`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP"
          demo={<ScrollBox height={320}>{(ref) => <SequenceGSAP scrollerRef={ref} />}</ScrollBox>}
          code={`const tl = gsap.timeline({
  scrollTrigger: { trigger, scrub: true },
});
tl.fromTo(".scene", { x:-80, opacity:0 }, { x:0, opacity:1 })
  .to(".orb", { scale:2.2 })
  .to(".orb", { scale:1 })
  .to(".scene", { opacity:0 });`} />
      </SectionWrap>

      {/* 6. Simple Parallax */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>6. Simple Parallax</h2>
        <p className={s.sectionDesc}>3 squares stacked — scroll inside each box. BG ×0.2, MID ×0.5, FG ×1.0</p>
        <div className={s.sectionGrid}>
          <div className={s.pxColFm}>
            <div className={s.pxColHeader}><Badge color={FM_COLOR} label="FRAMER MOTION" /></div>
            <ScrollBox height={500}>{(ref) => <SimpleParallaxFramer scrollerRef={ref} />}</ScrollBox>
            <div className={s.pxColCode}>
              <CodeBlock color={FM_COLOR} code={`const y0 = useTransform(scrollYProgress, [0,1], [0, -40]);
const y1 = useTransform(scrollYProgress, [0,1], [0, -100]);
const y2 = useTransform(scrollYProgress, [0,1], [0, -200]);
<motion.div style={{ y: y0 }} /> {/* BG */}
<motion.div style={{ y: y1 }} /> {/* MID */}
<motion.div style={{ y: y2 }} /> {/* FG */}`} />
            </div>
          </div>
          <div className={s.pxColGsap}>
            <div className={s.pxColHeader}><Badge color={GSAP_COLOR} label="GSAP" /></div>
            <ScrollBox height={500}>{(ref) => <SimpleParallaxGSAP scrollerRef={ref} />}</ScrollBox>
            <div className={s.pxColCode}>
              <CodeBlock color={GSAP_COLOR} code={`PX_LAYERS.forEach((layer, i) => {
  gsap.to(\`px-layer-\${i}\`, {
    y: -200 * layer.speed, ease: "none",
    scrollTrigger: { trigger, scroller, scrub: true },
  });
});`} />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Heavy Parallax */}
      <section className={s.splitSection}>
        <div className={s.splitInner}>
          <h2 className={s.sectionTitle}>6. Heavy Parallax (8 layers)</h2>
          <p className={s.sectionDesc}>Scroll fast — Framer layers desync because each useSpring is a separate rAF subscriber. GSAP batches all 8 in one tick.</p>
        </div>
        <div className={s.splitGrid}>
          <div className={s.splitCol}>
            <div className={s.splitColHeader}>
              <Badge color={FM_COLOR} label="FRAMER MOTION" />
              <span className={`${s.splitColNote} ${s.textRed}`}>⚠ scroll fast to see desync</span>
            </div>
            <ScrollBox height={500}>{(ref) => <ScrollParallaxFramer scrollerRef={ref} />}</ScrollBox>
            <div className={s.splitColCode}>
              <CodeBlock color={FM_COLOR} code={`// 8 separate components, each with its own useSpring
// → 8 rAF subscribers → visible stagger on fast scroll
function DesyncBar({ index, scrollerRef }) {
  const { scrollYProgress } = useScroll({ container: scrollerRef });
  const raw = useTransform(scrollYProgress, [0,1], [0, 260]);
  const x = useSpring(raw, { stiffness:120, damping:20 });
  return <motion.div style={{ x }} />;
}`} />
            </div>
          </div>
          <div className={s.splitColLast}>
            <div className={s.splitColHeader}>
              <Badge color={GSAP_COLOR} label="GSAP" />
              <span className={`${s.splitColNote} ${s.textGsap}`}>✓ all layers sync — same rAF tick</span>
            </div>
            <ScrollBox height={500}>{(ref) => <ScrollParallaxGSAP scrollerRef={ref} />}</ScrollBox>
            <div className={s.splitColCode}>
              <CodeBlock color={GSAP_COLOR} code={`// Single gsap.to() targets ALL 8 bars at once
gsap.to(".gpx-bar", {
  x: 260, ease: "power2.out",
  scrollTrigger: { trigger, scroller, scrub: 0.5 },
});`} />
            </div>
          </div>
        </div>
      </section>

      <SectionWrap title="7. Card Stacking" desc="cards stacked at top — scroll to reveal next card; previous cards scale down + shift up. GSAP demos pattern.">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION"
          demo={<ScrollBox height={360}>{(ref) => <CardStackFramer scrollerRef={ref} />}</ScrollBox>}
          code={`// Each card: position sticky, springs on scale + y.
// As card i+1 enters, card i scales down and shifts up.
function StackCardFM({ i, total, scrollYProgress }) {
  const maxCards = total - 1 - i;
  const rawScale = useTransform(
    scrollYProgress,
    [(i+1)/total, 1],
    [1, Math.max(0.7, 1 - maxCards * 0.06)]
  );
  const rawY = useTransform(
    scrollYProgress,
    [(i+1)/total, 1],
    [0, -(maxCards * CARD_SPACING)]
  );
  const scale = useSpring(rawScale, { stiffness:260, damping:28 });
  const y     = useSpring(rawY,     { stiffness:260, damping:28 });
  return <motion.div style={{ position:"sticky", top: i*CARD_SPACING, scale, y }} />;
}`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP"
          demo={<ScrollBox height={360}>{(ref) => <CardStackGSAP scrollerRef={ref} />}</ScrollBox>}
          code={`// Per-card ScrollTrigger with onUpdate — no spring overshoot.
STACK_CARDS.forEach((_, i) => {
  const el = inner.querySelector(\`.gsc-\${i}\`);
  const maxCards = total - 1 - i;
  if (maxCards === 0) return;
  ScrollTrigger.create({
    trigger: inner, scroller,
    start: \`\${((i+1)/total)*100}% top\`,
    end: "100% top", scrub: true,
    onUpdate: (self) => {
      gsap.set(el, {
        scale: 1 - self.progress * maxCards * 0.06,
        y: -(self.progress * maxCards * CARD_SPACING),
        transformOrigin: "top center",
      });
    },
  });
});`} />
      </SectionWrap>

      <SectionWrap title="8. Scroll Smoothing" desc="simulate GSAP ScrollSmoother — ball lags behind target with spring / scrub:N">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION"
          demo={<ScrollBox height={360}>{(ref) => <ScrollSmoothingFramer scrollerRef={ref} />}</ScrollBox>}
          code={`const rawY    = useMotionValue(0);
const smoothY = useSpring(rawY, { stiffness:60, damping:14 });
useEffect(() => {
  const sync = () => rawY.set(el.scrollTop);
  el.addEventListener("scroll", sync);
  return () => el.removeEventListener("scroll", sync);
}, []);`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP"
          demo={<ScrollBox height={360}>{(ref) => <ScrollSmoothingGSAP scrollerRef={ref} />}</ScrollBox>}
          code={`// scrub:true = frame-perfect · scrub:0.6 = 0.6s catch-up
gsap.fromTo(ball, { y: top }, {
  y: bottom, ease: "none",
  scrollTrigger: { trigger, scroller, scrub: 0.6 },
});`} />
      </SectionWrap>

      <SectionWrap title="9. SVG Path Draw" desc="path ถูก draw ตาม scroll — Framer ใช้ motion pathLength, GSAP ใช้ strokeDashoffset">
        <DemoCard color={FM_COLOR} badge="FRAMER MOTION"
          demo={<ScrollBox height={340}>{(ref) => <PathDrawFramer scrollerRef={ref} />}</ScrollBox>}
          code={`const pathLength = useTransform(scrollYProgress, [0,1], [0,1]);
<motion.path
  d={SVG_PATH}
  style={{ pathLength }}
/>
// ⚠️ 1 frame behind scroll`} />
        <DemoCard color={GSAP_COLOR} badge="GSAP"
          demo={<ScrollBox height={340}>{(ref) => <PathDrawGSAP scrollerRef={ref} />}</ScrollBox>}
          code={`const length = path.getTotalLength();
gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
gsap.to(path, {
  strokeDashoffset: 0, ease: "none",
  scrollTrigger: { trigger, scroller, scrub: 1 },
});`} />
      </SectionWrap>

      <ScaleWarning />

      <section className={s.summary}>
        <h2 className={s.summaryTitle}>Summary</h2>
        <div className={s.summaryGrid}>
          {SUMMARY_ROWS.map((row) => (
            <div key={row.pattern} className={s.summaryCard}>
              <p className={s.summaryCardTitle}>{row.pattern}</p>
              <p className={s.summaryCardFm}>FM: {row.fm}</p>
              <p className={s.summaryCardGsap}>GSAP: {row.gsap}</p>
              <span className={s.summaryCardWinner}>winner: {row.winner}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
