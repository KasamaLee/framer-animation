"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Transition } from "framer-motion";

// Each path is 2 full wave cycles (2880 wide) for seamless loop
// Animated x: 0% → -50% = one cycle, then loops
const LAYERS = [
  {
    color: "#302135ff",
    path: "M0,120 C360,80 360,80 720,120 C1080,160 1080,160 1440,120 C1800,80 1800,80 2160,120 C2520,160 2520,160 2880,120 L2880,500 L0,500 Z",
    duration: 12,
    yRange: [0, -20] as [number, number],
  },
  {
    color: "#472e52ff",
    path: "M0,240 C360,210 360,210 720,240 C1080,270 1080,270 1440,240 C1800,210 1800,210 2160,240 C2520,270 2520,270 2880,240 L2880,500 L0,500 Z",
    duration: 8,
    yRange: [0, -50] as [number, number],
  },
  {
    color: "#8e5da2ff",
    path: "M0,340 C360,322 360,322 720,340 C1080,358 1080,358 1440,340 C1800,322 1800,322 2160,340 C2520,358 2520,358 2880,340 L2880,500 L0,500 Z",
    duration: 5,
    yRange: [0, -80] as [number, number],
  },
];

const BOAT_ANIMATE = { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] };
const BOAT_TRANSITION: Transition = { duration: 3.5, repeat: Infinity, ease: "easeInOut" };

export default function WaveParallaxFramer({ height = "h-[calc(100vh+160px)]" }: { height?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y0 = useTransform(scrollYProgress, [0, 1], LAYERS[0].yRange);
  const y1 = useTransform(scrollYProgress, [0, 1], LAYERS[1].yRange);
  const y2 = useTransform(scrollYProgress, [0, 1], LAYERS[2].yRange);
  const yTransforms = [y0, y1, y2];

  // Fog parallax
  const fog1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const fog2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  return (
    <div ref={containerRef} className={`relative w-full ${height}`}>
      {/* Back layers (0, 1) */}
      {LAYERS.slice(0, 2).map(({ color, path, duration }, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0 right-0 overflow-hidden"
          style={{ height: "100vh", y: yTransforms[i] }}
        >
          <motion.div
            style={{ width: "200%", height: "100%" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
          >
            <svg
              viewBox="0 0 2880 500"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={path} fill={color} />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Boat image — between layer 1 and front layer 2, hull gets overlapped */}
      <motion.div
        className="absolute"
        style={{ bottom: "35%", left: "50%", width: 700 }}
        animate={BOAT_ANIMATE}
        transition={BOAT_TRANSITION}
      >
        <Image
          src="/images/Whimsical boat with glowing lantern.png"
          alt="boat"
          width={600}
          height={250}
          style={{ objectFit: "contain", position: "relative" }}
        />
      </motion.div>

      {/* Front layer (2) — overlaps boat hull */}
      {LAYERS.slice(2).map(({ color, path, duration }, i) => (
        <motion.div
          key={i + 2}
          className="absolute top-0 left-0 right-0 overflow-hidden"
          style={{ height: "100vh", y: yTransforms[i + 2] }}
        >
          <motion.div
            style={{ width: "200%", height: "100%" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration, ease: "linear" }}
          >
            <svg
              viewBox="0 0 2880 500"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={path} fill={color} />
            </svg>
          </motion.div>
        </motion.div>
      ))}

      {/* Fog layer 1 — back, slow parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: fog1Y }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/foggy1.png"
            alt="fog layer 1"
            fill
            className="object-cover"
            style={{ opacity: 0.18, mixBlendMode: "screen" }}
          />
          {/* Top-to-transparent gradient mask */}
          <div
            className="absolute inset-0"
            style={{
              mixBlendMode: "normal",
            }}
          />
        </div>
      </motion.div>

      {/* Fog layer 2 — front, faster parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: fog2Y }}
      >
        <div className="relative w-full h-full">
          <Image
            src="/images/foggy2.png"
            alt="fog layer 2"
            fill
            className="object-cover"
            style={{ opacity: 0.12, mixBlendMode: "screen" }}
          />
        </div>
      </motion.div>

      {/* Lantern glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: "calc(40%)",
          left: "calc(48%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(249, 231, 142, 0.75) 0%, rgba(255,160,30,0.35) 45%, transparent 70%)",
          mixBlendMode: "screen",
        }}
        animate={{ y: [0, -14, 0], opacity: [0.75, 1, 0.75], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
