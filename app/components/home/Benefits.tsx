import React from "react";
import { motion } from "framer-motion";
import { Container, FadeIn, Tag } from "./UtilityComponents";

// All 8 benefit cards data with proper semantic icons and website-aligned colors
const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12S5 4 12 4S23 12 23 12S19 20 12 20S1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Clearer context",
    description: "Extract any web element with its full styling context - no guesswork",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 16L13.09 18.26L16 19L13.09 19.74L12 22L10.91 19.74L8 19L10.91 18.26L12 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Higher fidelity",
    description: "What you see is exactly what your AI coding assistant receives",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Faster delivery",
    description: "From inspiration to implementation in 30 seconds, not 30 minutes",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 15L17 10L22 15L17 20L12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 15L7 10L12 15L7 20L2 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 2L17 7L12 12L7 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Native tooling fit",
    description: "Purpose-built for Cursor and Claude Code workflows via MCP",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 5 3 4.10457 3 3H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Eliminate guesswork",
    description: "Give your coding assistant pixel-perfect references and achieve exact visual matches",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Reliable results",
    description: "Save hours of back-and-forth—the fastest way to provide design context",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 13L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "10× faster",
    description: "Dramatically reduce the time spent explaining components to AI assistants",
    color: "emerald"
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    title: "Framework agnostic",
    description: "Works with any tech stack - React, Vue, Angular, or vanilla HTML/CSS",
    color: "emerald"
  }
];

export const Benefits: React.FC = () => (
  <section className="relative border-b border-zinc-900/60">
    <Container className="py-16 md:py-24">
      <FadeIn>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Tag>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            Key Benefits
          </Tag>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-zinc-100">
            Clarity{" "}
            <span className="text-emerald-400">
              in
            </span>
            , perfect code{" "}
            <span className="text-emerald-400">
              out
            </span>
          </h2>
          <p className="mt-3 text-zinc-400 text-lg leading-relaxed">
            Stop describing UI. Send the real thing with full context and styling.
          </p>
        </div>
      </FadeIn>

      {/* Benefits Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit, index) => (
          <FadeIn key={benefit.title} delay={0.1 * index}>
            <motion.div
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1 flex flex-col h-full"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${benefit.color}-500/10 border border-${benefit.color}-500/20 text-${benefit.color}-400 mb-4 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                {benefit.icon}
              </div>
              <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed flex-grow">
                {benefit.description}
              </p>
              
              {/* Subtle hover glow effect */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-${benefit.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </Container>
  </section>
);
