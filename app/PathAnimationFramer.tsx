"use client";

import { useRef } from "react";
import { motion, Transition, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const PATH =
  "M646.792 70.0006C468.654 75.3352 108.612 130.358 93.5518 307.77C78.4919 485.183 379.41 589.741 531.752 619.843C668.406 638.514 927.073 727.297 868.507 933.059C795.299 1190.26 596.593 1397.17 287.029 1422.32C-22.5346 1447.46 56.948 1089.67 171.989 1089.67C287.029 1089.67 554.76 1130.82 600.776 1907";

function TextBox({ title, body }: { title: string; body: string }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)",
        padding: "24px 28px",
        borderRadius: "4px",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontWeight: 700,
          fontSize: "24px",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "20px",
          lineHeight: 1.6,
          color: "rgba(255,255,255,0.6)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

interface PathAnimationFramerProps {
  height?: string;
  doorRight?: string;
  doorTop?: string;
  doorWidth?: number;
  doorZIndex?: number;
}

export default function PathAnimationFramer({
  height = "400vh",
  doorRight = "7%",
  doorTop = "-5%",
  doorWidth = 800,
  doorZIndex = -5,
}: PathAnimationFramerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pathOpacity = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const BOAT_ANIMATE = { y: [0, -14, 0], rotate: [-1.5, 1.5, -1.5] };
  const BOAT_TRANSITION: Transition = {
    duration: 3.5,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        height: height,
        paddingTop: "100px",
        paddingBottom: "100px",
        background:
          "linear-gradient(to bottom, #231429ff, #3b3450, #6b5f7a, #c4b8c8)",
      }}
    >
      {/* Path animation */}
      <div
        className="sticky top-0 flex items-center justify-center overflow-visible"
        style={{ zIndex: 5 }}
      >
        <motion.div
          className="absolute"
          style={{ top: "12%", left: "12%", width: 400 }}
          animate={BOAT_ANIMATE}
          transition={BOAT_TRANSITION}
        >
          <Image
            src="/images/messy.png"
            alt="messy"
            width={700}
            height={259}
            style={{ objectFit: "contain", position: "relative" }}
          />
        </motion.div>

        {/* Door image — behind SVG path */}
        <div
          style={{
            position: "absolute",
            right: doorRight,
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

        {/* Boat image — between layer 1 and front layer 2, hull gets overlapped */}
        <motion.div
          className="absolute"
          style={{ bottom: "33%", left: "48%", width: 500 }}
          animate={BOAT_ANIMATE}
          transition={BOAT_TRANSITION}
        >
          <Image
            src="/images/Whimsical boat with glowing lantern.png"
            alt="boat"
            width={700}
            height={259}
            style={{ objectFit: "contain", position: "relative" }}
          />
        </motion.div>

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
            <filter
              id="framer-depth-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
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
            stroke="#ffeb84ff"
            strokeWidth="100"
            strokeLinecap="round"
            fill="none"
            pathLength={pathLength}
            style={{ opacity: pathOpacity }}
            filter="url(#framer-depth-shadow)"
          />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "8%",
          zIndex: 10,
          maxWidth: 440,
        }}
      >
        <TextBox
          title="Take the Test"
          body="ตอบคำถามเกี่ยวกับความสนใจและพฤติกรรมของคุณใช้เวลาเพียง X–XX นาที"
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "6%",
          zIndex: 10,
          maxWidth: 440,
        }}
      >
        <TextBox
          title="Get Your RIASEC"
          body="คุณจะได้ผลลัพธ์เป็นรหัส 3 ตัว เช่น I-A-S ที่สะท้อนบุคลิกภาพด้านอาชีพของคุณ"
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "6%",
          zIndex: 10,
          maxWidth: 440,
        }}
      >
        <TextBox
          title="Explore Career Paths"
          body="ดูรายการอาชีพที่สอดคล้องกับ profile ของคุณพร้อมคำอธิบายลักษณะงานจริง"
        />
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "6%",
          left: "8%",
          zIndex: 10,
          maxWidth: 440,
        }}
      >
        <TextBox
          title="Plan Your Learning Journey"
          body="ดูทักษะที่ควรพัฒนา เส้นทางการเรียนที่แนะนำ และวางแผนสู่เป้าหมาย"
        />
      </div>
    </div>
  );
}
