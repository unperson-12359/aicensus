"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SectionDivider() {
  const shouldReduce = useReducedMotion();

  const inner = (
    <>
      <div className="geo-divider-line" />
      <div className="geo-divider-dot" />
      <div className="geo-divider-dot" />
      <div className="geo-divider-dot" />
      <div className="geo-divider-line" />
    </>
  );

  if (shouldReduce) {
    return <div className="geo-divider mx-auto my-10 max-w-xs">{inner}</div>;
  }

  return (
    <motion.div
      className="geo-divider mx-auto my-10 max-w-xs"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {inner}
    </motion.div>
  );
}
