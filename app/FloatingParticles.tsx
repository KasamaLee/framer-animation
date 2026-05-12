"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
}

function randomParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    baseOpacity: Math.random() * 0.45 + 0.1,
    duration: Math.random() * 9 + 6,
    delay: -(Math.random() * 12),
    driftX: (Math.random() - 0.5) * 50,
    driftY: -(Math.random() * 70 + 30),
  }));
}

export default function FloatingParticles({ height = "h-screen" }: { height?: string }) {
  const [particles] = useState<Particle[]>(() => randomParticles(70));
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);

  // Cloud parallax — different depths
  const cloud1Y = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]); // left, slower (back)
  const cloud2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]); // right, faster (front)

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${height} overflow-hidden`}
    >
      {/* Particles */}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size * 2,
            height: p.size * 2,
            background: `radial-gradient(circle, rgba(247, 241, 206, 0.9) 0%, rgba(238, 209, 141, 0.4) 60%, transparent 100%)`,
            opacity: p.baseOpacity,
          }}
          animate={{
            x: [0, p.driftX, 0],
            y: [0, p.driftY, 0],
            opacity: [p.baseOpacity, Math.min(p.baseOpacity * 2, 0.9), p.baseOpacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Cloud 1 — left side, slow parallax (back layer) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ y: cloud1Y, left: "-8%", top: "28%", width: "62%" }}
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/cloud1.png"
          alt="cloud 1"
          width={900}
          height={400}
          className="w-full h-auto"
          style={{ opacity: 0.22, mixBlendMode: "screen" }}
        />
      </motion.div>

      {/* Cloud 2 — right side, faster parallax (front layer) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ y: cloud2Y, right: "-6%", top: "18%", width: "48%" }}
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/images/cloud2.png"
          alt="cloud 2"
          width={700}
          height={500}
          className="w-full h-auto"
          style={{ opacity: 0.18, mixBlendMode: "screen" }}
        />
      </motion.div>

      {/* Hero text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center z-10 select-none"
        style={{ y: textY }}
      >
        <motion.p
          className="mt-5 text-sm tracking-[0.3em] uppercase"
          style={{ color: "rgba(255,255,255,0.35)" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        >
          scroll to explore
        </motion.p>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-20"
        style={{ background: "linear-gradient(to bottom, transparent, transparent)" }}
      />
    </div>
  );
}
