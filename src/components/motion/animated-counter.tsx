"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  target,
  suffix = "",
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const shouldReduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [display, setDisplay] = useState(target);

  const motionValue = useMotionValue(target);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  // Always show the real count when not animating (mobile below fold, reduced motion).
  useEffect(() => {
    if (shouldReduce || !inView) {
      setDisplay(target);
    }
  }, [target, inView, shouldReduce]);

  useEffect(() => {
    if (shouldReduce || !inView) return;

    const start = Math.max(0, Math.floor(target * 0.85));
    motionValue.set(start);
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    motionValue.set(target);

    return unsubscribe;
  }, [inView, shouldReduce, target, motionValue, springValue]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
