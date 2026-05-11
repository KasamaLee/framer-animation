"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PATH =
  "M646.792 70.0006C468.654 75.3352 108.612 130.358 93.5518 307.77C78.4919 485.183 379.41 589.741 531.752 619.843C668.406 638.514 927.073 727.297 868.507 933.059C795.299 1190.26 596.593 1397.17 287.029 1422.32C-22.5346 1447.46 56.948 1089.67 171.989 1089.67C287.029 1089.67 554.76 1130.82 600.776 1907";

export default function PathAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 flex items-center justify-center">
        <svg
          width="947"
          height="1977"
          viewBox="0 0 947 1977"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <defs>
            <filter id="depth-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="40"
                stdDeviation="20"
                floodColor="rgba(0,0,0,0.35)"
              />
            </filter>
          </defs>

          <path
            ref={pathRef}
            d={PATH}
            stroke="#5f5f5f"
            strokeWidth="140"
            strokeLinecap="round"
            filter="url(#depth-shadow)"
          />
        </svg>
      </div>
    </div>
  );
}
