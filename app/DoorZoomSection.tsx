"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

export default function DoorZoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Card slides up from below as you scroll into it
  const y = useTransform(scrollYProgress, [0, 0.35], ["60vh", "0vh"]);

  // Fade door image in on enter, out on exit
  const doorOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    [0, 1, 1, 0]
  );

  // Black overlay fades in at the end to bridge to PathAnimation
  const overlayOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);

  // Scroll hint fades out early
  const hintOpacity = useTransform(scrollYProgress, [0.15, 0.3], [1, 0]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 30,
        overflow: "hidden",
      }}
    >
      <motion.div
        style={{
          y,
          position: "absolute",
          inset: 0,
          background: "background",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Door image — no zoom, centered */}
        <motion.div
          style={{
            opacity: doorOpacity,
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src="/images/door.png"
            alt="Door"
            fill
            priority
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{
            opacity: hintOpacity,
            position: "absolute",
            bottom: "10%",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            scroll to enter
          </p>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            style={{ marginTop: 10, color: "rgba(255,255,255,0.25)" }}
          >
            ↓
          </motion.div>
        </motion.div>

        {/* Transition overlay to PathAnimation */}
        <motion.div
          style={{
            opacity: overlayOpacity,
            position: "absolute",
            inset: 0,
            background: "black",
            zIndex: 20,
            pointerEvents: "none",
          }}
        />
      </motion.div>
    </div>
  );
}
