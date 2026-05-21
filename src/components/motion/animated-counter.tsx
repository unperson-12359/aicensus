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
  const shouldAnimate = inView && !shouldReduce;
  const [animatedValue, setAnimatedValue] = useState(target);

  const motionValue = useMotionValue(target);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (!shouldAnimate) return;

    const start = Math.max(0, Math.floor(target * 0.85));
    motionValue.set(start);
    const unsubscribe = springValue.on("change", (latest) => {
      setAnimatedValue(Math.round(latest));
    });
    motionValue.set(target);

    return unsubscribe;
  }, [shouldAnimate, target, motionValue, springValue]);

  const display = shouldAnimate ? animatedValue : target;

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
