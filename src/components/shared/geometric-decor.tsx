"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ShapeType = "circle" | "ring" | "cross" | "half-circle" | "line" | "dot" | "triangle";
type ShapeColor = "primary" | "accent" | "neon";

export interface GeometricShape {
  type: ShapeType;
  color: ShapeColor;
  size: number;
  opacity: number;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  parallaxSpeed?: number;
  rotate?: number;
  blur?: number;
}

interface GeometricDecorProps {
  shapes: GeometricShape[];
  className?: string;
}

const colorMap: Record<ShapeColor, string> = {
  primary: "oklch(0.65 0.2 250)",
  accent: "oklch(0.55 0.2 290)",
  neon: "oklch(0.75 0.18 175)",
};

function ShapeElement({
  shape,
  scrollYProgress,
  reduceMotion,
}: {
  shape: GeometricShape;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduceMotion: boolean;
}) {
  const speed = shape.parallaxSpeed ?? 0;
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  const color = colorMap[shape.color];
  const baseStyle: React.CSSProperties = {
    ...shape.position,
    opacity: shape.opacity,
    transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined,
    filter: shape.blur ? `blur(${shape.blur}px)` : undefined,
  };

  const shapeStyle = getShapeStyle(shape.type, shape.size, color);
  const combinedStyle = { ...baseStyle, ...shapeStyle };

  if (reduceMotion || speed === 0) {
    return <div className="geo-shape" style={combinedStyle} />;
  }

  return <motion.div className="geo-shape" style={{ ...combinedStyle, y }} />;
}

function getShapeStyle(
  type: ShapeType,
  size: number,
  color: string
): React.CSSProperties {
  switch (type) {
    case "circle":
      return {
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
      };
    case "ring":
      return {
        width: size,
        height: size,
        borderRadius: "50%",
        border: `2px solid ${color}`,
        background: "transparent",
      };
    case "dot":
      return {
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
      };
    case "cross": {
      const arm = Math.max(2, size * 0.15);
      return {
        width: size,
        height: size,
        background: `
          linear-gradient(${color}, ${color}) center/100% ${arm}px no-repeat,
          linear-gradient(${color}, ${color}) center/${arm}px 100% no-repeat
        `,
      };
    }
    case "half-circle":
      return {
        width: size,
        height: size / 2,
        borderRadius: `${size}px ${size}px 0 0`,
        background: color,
      };
    case "line":
      return {
        width: size,
        height: 2,
        background: color,
      };
    case "triangle": {
      const half = size / 2;
      return {
        width: 0,
        height: 0,
        borderLeft: `${half}px solid transparent`,
        borderRight: `${half}px solid transparent`,
        borderBottom: `${size}px solid ${color}`,
        background: "transparent",
      };
    }
    default:
      return { width: size, height: size, borderRadius: "50%", background: color };
  }
}

export function GeometricDecor({ shapes, className }: GeometricDecorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 overflow-hidden -z-10 pointer-events-none", className)}
    >
      {shapes.map((shape, i) => (
        <ShapeElement
          key={i}
          shape={shape}
          scrollYProgress={scrollYProgress}
          reduceMotion={shouldReduceMotion ?? false}
        />
      ))}
    </div>
  );
}

// ===== Preset shape configurations =====

export const heroShapes: GeometricShape[] = [
  {
    type: "circle",
    color: "primary",
    size: 200,
    opacity: 0.06,
    position: { top: "8%", right: "5%" },
    parallaxSpeed: 0.2,
    blur: 1,
  },
  {
    type: "ring",
    color: "accent",
    size: 150,
    opacity: 0.08,
    position: { bottom: "15%", left: "6%" },
    parallaxSpeed: 0.15,
  },
  {
    type: "cross",
    color: "neon",
    size: 36,
    opacity: 0.12,
    position: { top: "35%", right: "12%" },
    parallaxSpeed: 0.3,
  },
];

export const sectionShapes: GeometricShape[] = [
  {
    type: "ring",
    color: "primary",
    size: 80,
    opacity: 0.05,
    position: { top: "15%", left: "2%" },
    parallaxSpeed: 0.1,
  },
  {
    type: "dot",
    color: "accent",
    size: 6,
    opacity: 0.18,
    position: { bottom: "25%", right: "5%" },
    parallaxSpeed: 0.25,
  },
];

export const ctaShapes: GeometricShape[] = [
  {
    type: "half-circle",
    color: "primary",
    size: 120,
    opacity: 0.05,
    position: { bottom: "-30px", left: "8%" },
    parallaxSpeed: 0.1,
    rotate: 180,
  },
  {
    type: "cross",
    color: "accent",
    size: 28,
    opacity: 0.1,
    position: { top: "18%", right: "8%" },
    parallaxSpeed: 0.2,
  },
];

export const pageHeaderShapes: GeometricShape[] = [
  {
    type: "ring",
    color: "primary",
    size: 100,
    opacity: 0.05,
    position: { top: "0", right: "4%" },
    parallaxSpeed: 0.1,
  },
  {
    type: "dot",
    color: "accent",
    size: 6,
    opacity: 0.15,
    position: { top: "55%", left: "2%" },
    parallaxSpeed: 0.2,
  },
];

export const aboutHeroShapes: GeometricShape[] = [
  {
    type: "circle",
    color: "primary",
    size: 180,
    opacity: 0.06,
    position: { top: "5%", right: "8%" },
    parallaxSpeed: 0.2,
    blur: 1,
  },
  {
    type: "ring",
    color: "accent",
    size: 120,
    opacity: 0.08,
    position: { bottom: "10%", left: "5%" },
    parallaxSpeed: 0.15,
  },
  {
    type: "triangle",
    color: "neon",
    size: 30,
    opacity: 0.1,
    position: { top: "40%", left: "15%" },
    parallaxSpeed: 0.25,
    rotate: 15,
  },
];
