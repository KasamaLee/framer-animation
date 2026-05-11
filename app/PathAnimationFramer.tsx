"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PATH =
  "M646.792 70.0006C468.654 75.3352 108.612 130.358 93.5518 307.77C78.4919 485.183 379.41 589.741 531.752 619.843C668.406 638.514 927.073 727.297 868.507 933.059C795.299 1190.26 596.593 1397.17 287.029 1422.32C-22.5346 1447.46 56.948 1089.67 171.989 1089.67C287.029 1089.67 554.76 1130.82 600.776 1907";

interface PathAnimationFramerProps {
  height?: string;
  doorLeft?: string;
  doorTop?: string;
  doorWidth?: number;
  doorZIndex?: number;
}

export default function PathAnimationFramer({
  height = "400vh",
  doorLeft = "2%",
  doorTop = "-8%",
  doorWidth = 1000,
  doorZIndex = -5,
}: PathAnimationFramerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative" style={{ height: height, paddingBottom: "100px" }}>
      {/* Text above the path */}
      {/* <motion.div
        className="absolute top-[5%] left-0 right-0 flex flex-col items-center pointer-events-none select-none"
        style={{ opacity: textOpacity, y: textY, zIndex: 10 }}
      >
        <h2
          className="text-5xl font-bold tracking-tight text-center"
          style={{
            color: "rgba(255,255,255,0.88)",
            textShadow: "0 0 40px rgba(255,220,100,0.25), 0 2px 16px rgba(0,0,0,0.9)",
          }}
        >
          The Journey
        </h2>
        <p
          className="mt-3 text-sm tracking-[0.28em] uppercase"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          follow the path
        </p>
      </motion.div> */}

      {/* Path animation */}
      <div className="sticky top-0 flex items-center justify-center overflow-visible" style={{ zIndex: 5 }}>
        {/* Door image — behind SVG path */}
        <div
          style={{
            position: "absolute",
            left: doorLeft,
            top: doorTop,
            width: doorWidth,
            aspectRatio: "auto",
            zIndex: doorZIndex,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/images/door.png"
            alt="Door"
            width={doorWidth}
            height={doorWidth * 1.5}
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </div>

        <svg
          width="947"
          height="1977"
          viewBox="0 0 947 1977"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          style={{ overflow: "visible" }}
        >
          <defs>
            <filter id="framer-depth-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="40"
                stdDeviation="20"
                floodColor="rgba(251, 232, 137, 0.4)"
              />
            </filter>
          </defs>

          <motion.path
            d={PATH}
            stroke="#c4c4c4"
            strokeWidth="100"
            strokeLinecap="round"
            fill="none"
            pathLength={pathLength}
            filter="url(#framer-depth-shadow)"
          />
        </svg>
      </div>
    </div>
  );
}
