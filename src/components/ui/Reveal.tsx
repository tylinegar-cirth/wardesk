"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  scale?: boolean;
}

export default function Reveal({ children, delay = 0, className = "", scale = false }: RevealProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: scale ? 52 : 40,
        scale: scale ? 0.94 : 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: scale ? 1.3 : 1.1,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
