"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PathAnimationFramer from "./PathAnimationFramer";
import WaveParallaxFramer from "./WaveParallaxFramer";
import FloatingParticles from "./FloatingParticles";
// import AnimationCompare from "./AnimationCompare";

function WaveReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, overflow: "visible", width: "100%" }}
    >
      <WaveParallaxFramer />
    </motion.div>
  );
}

export default function Home() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 10000], [0, -1000]);

  return (
    <div className="w-full" style={{ overflowX: "hidden" }}>
      {/* Parallax hero — moves slower than the page */}
      <motion.div className="w-full" style={{ y: heroY }}>
        <FloatingParticles height="h-[180vh]" />
      </motion.div>

      {/* WaveReveal overlaps hero from below at full scroll speed */}
      <div
        className="relative w-full -mt-[60vh] z-10"
        style={{ overflow: "visible" }}
      >
        <WaveReveal />
      </div>

      <div style={{ paddingTop: "200px" }}>
        <PathAnimationFramer />
      </div>

      {/* ── Animation Comparison Design System ── */}
      {/* <AnimationCompare /> */}
    </div>
  );
}
