import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ---- Small utility components ----
interface ContainerProps {
  className?: string;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ className = "", children }) => (
  <div className={`mx-auto w-full max-w-6xl px-4 md:px-6 ${className}`}>{children}</div>
);

interface GlowProps {
  className?: string;
}

export const Glow: React.FC<GlowProps> = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}
  >
    {/* Dark Cloud Background */}
    <div className="absolute inset-0">
      {/* Base cloud layer */}
      <motion.div
        className="absolute left-1/2 top-[-10%] h-[80rem] w-[80rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(24,24,27,0.8),rgba(0,0,0,0)_70%)] blur-3xl"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.8, 0.9, 0.8]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary cloud layer */}
      <motion.div
        className="absolute left-[20%] top-[30%] h-[50rem] w-[50rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(39,39,42,0.6),rgba(0,0,0,0)_60%)] blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.7, 0.6]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      {/* Third cloud layer */}
      <motion.div
        className="absolute right-[15%] top-[15%] h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(63,63,70,0.5),rgba(0,0,0,0)_65%)] blur-3xl"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.5, 0.6, 0.5]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4
        }}
      />
      
      {/* Subtle emerald glow for brand consistency */}
      <motion.div
        className="absolute left-1/2 top-[60%] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08),rgba(0,0,0,0)_80%)] blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>

    {/* Lightning Effects */}
    <div className="absolute inset-0">
      {/* Main lightning bolt */}
      <motion.div
        className="absolute left-[25%] top-[20%] h-[60rem] w-[2px] bg-gradient-to-b from-transparent via-emerald-400/20 to-transparent"
        animate={{
          opacity: [0, 0.8, 0],
          scaleY: [0, 1, 0],
          filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity,
          repeatDelay: 8,
          ease: "easeInOut"
        }}
      />
      
      {/* Secondary lightning */}
      <motion.div
        className="absolute right-[30%] top-[35%] h-[40rem] w-[1px] bg-gradient-to-b from-transparent via-sky-400/15 to-transparent"
        animate={{
          opacity: [0, 0.6, 0],
          scaleY: [0, 1, 0],
          filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 12,
          ease: "easeInOut",
          delay: 3
        }}
      />
      
      {/* Third lightning */}
      <motion.div
        className="absolute left-[60%] top-[25%] h-[35rem] w-[1px] bg-gradient-to-b from-transparent via-emerald-300/10 to-transparent"
        animate={{
          opacity: [0, 0.5, 0],
          scaleY: [0, 1, 0],
          filter: ["blur(0px)", "blur(1.5px)", "blur(0px)"]
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatDelay: 15,
          ease: "easeInOut",
          delay: 6
        }}
      />
    </div>

    {/* Floating particles for atmosphere */}
    <FloatingParticles />
  </div>
);

// Floating particles component to prevent hydration mismatches
const FloatingParticles: React.FC = () => {
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random positions only on client side
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 4 + Math.random() * 2,
      delay: Math.random() * 3
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) {
    return null; // Don't render anything during SSR
  }

  return (
    <div className="absolute inset-0">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-emerald-400/20"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
};

interface FadeInProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({ delay = 0, children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true, amount: 0.3 }}
    className={className}
  >
    {children}
  </motion.div>
);

interface TagProps {
  children: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 border border-zinc-700/70">{children}</span>
);

interface CheckProps {
  children: React.ReactNode;
}

export const Check: React.FC<CheckProps> = ({ children }) => (
  <div className="flex items-start gap-3">
    <svg className="mt-0.5 h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <p className="text-zinc-300 leading-6">{children}</p>
  </div>
);

// Gradient text utility (Cursor-style green→blue)
interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

export const GradientText: React.FC<GradientTextProps> = ({ children, className = "" }) => (
  <span className={`bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent ${className}`}>{children}</span>
);
