"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Each path is 2× wide (viewBox 2880) so we can loop translateX 0 → -50%
const LAYERS = [
  {
    color: "#3549C5",
    d: "M0,120 C360,40 360,40 720,120 C1080,200 1080,200 1440,120 C1800,40 1800,40 2160,120 C2520,200 2520,200 2880,120 L2880,500 L0,500 Z",
    duration: 8,
    scrollSpeed: -30,
  },
  {
    color: "#7B8FE0",
    d: "M0,240 C360,180 360,180 720,240 C1080,300 1080,300 1440,240 C1800,180 1800,180 2160,240 C2520,300 2520,300 2880,240 L2880,500 L0,500 Z",
    duration: 11,
    scrollSpeed: -65,
  },
  {
    color: "#A8C0F0",
    d: "M0,340 C360,300 360,300 720,340 C1080,380 1080,380 1440,340 C1800,300 1800,300 2160,340 C2520,380 2520,380 2880,340 L2880,500 L0,500 Z",
    duration: 15,
    scrollSpeed: -110,
  },
];

export default function WaveParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([null, null, null]);

  useGSAP(
    () => {
      // Continuous wave motion — each layer slides at a different speed
      LAYERS.forEach(({ duration }, i) => {
        gsap.fromTo(
          pathRefs.current[i],
          { x: 0 },
          {
            x: "-50%",
            duration,
            ease: "none",
            repeat: -1,
          }
        );
      });

      // Vertical parallax on scroll
      LAYERS.forEach(({ scrollSpeed }, i) => {
        gsap.to(pathRefs.current[i], {
          y: scrollSpeed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden h-[60vh]">
      <svg
        viewBox="0 0 1440 500"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {LAYERS.map(({ color, d }, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={d}
            fill={color}
          />
        ))}
      </svg>
    </div>
  );
}
