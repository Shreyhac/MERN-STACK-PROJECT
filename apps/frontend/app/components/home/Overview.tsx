import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { ArrowRight, Zap, Eye, Code } from "lucide-react";

export const Overview: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="relative border-b border-zinc-900/60">
      <Container className="py-16 md:py-24">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <Tag>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                <path d="M5 3v4"/>
                <path d="M19 17v4"/>
                <path d="M3 5h4"/>
                <path d="M17 19h4"/>
              </svg>
              Why Web To MCP?
            </Tag>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              The missing link between{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                inspiration
              </span>{" "}
              and{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                implementation
              </span>
            </h2>
          </div>
        </FadeIn>

        {/* Visual Story */}
        <FadeIn delay={0.2}>
          <div className="mt-16 relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/10 to-emerald-500/5 rounded-3xl blur-3xl" />
            
            <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              
              {/* Left: Inspiration */}
              <motion.div 
                className="relative"
                animate={{ 
                  scale: isConnected ? 0.98 : 1,
                  opacity: isConnected ? 0.8 : 1
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              >
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <Eye className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">Inspiration</h3>
                      <p className="text-xs text-zinc-400">Beautiful design you found</p>
                    </div>
                  </div>

                  {/* Mock website preview */}
                  <div className="relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-zinc-600 rounded w-3/4" />
                      <div className="h-3 bg-zinc-700 rounded w-1/2" />
                      <div className="h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded" />
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-zinc-400">
                      "How do I explain this to my AI assistant?"
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Center: Bridge/Connection */}
              <div className="flex flex-col items-center relative">
                {/* Connecting lines */}
                <div className="hidden lg:block absolute left-0 top-1/2 w-full">
                  <motion.div 
                    className="h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full"
                    animate={{ 
                      opacity: isConnected ? [0.3, 1, 0.3] : 0.3,
                      scaleX: isConnected ? [0.8, 1.2, 0.8] : 0.8
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  />
                </div>

                {/* Central logo/icon */}
                <motion.div 
                  className="relative z-10 rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-6 shadow-2xl"
                  animate={{ 
                    scale: isConnected ? [1, 1.1, 1] : 1,
                    boxShadow: isConnected 
                      ? ["0 0 0 0 rgba(16, 185, 129, 0.3)", "0 0 0 20px rgba(16, 185, 129, 0)", "0 0 0 0 rgba(16, 185, 129, 0)"]
                      : "0 0 0 0 rgba(16, 185, 129, 0)"
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-center">
                    <Zap className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="font-bold text-emerald-300 text-lg">Web To MCP</h3>
                    <p className="text-xs text-emerald-400/80">Perfect Bridge</p>
                  </div>
                </motion.div>

                {/* Floating particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                    style={{
                      left: `${30 + Math.cos(i * 0.785) * 40}%`,
                      top: `${50 + Math.sin(i * 0.785) * 40}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              {/* Right: Implementation */}
              <motion.div 
                className="relative"
                animate={{ 
                  scale: isConnected ? 1.02 : 1,
                  opacity: isConnected ? 1 : 0.9
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <Code className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-zinc-100">Implementation</h3>
                      <p className="text-xs text-zinc-400">Perfect code output</p>
                    </div>
                  </div>

                  {/* Mock code output */}
                  <div className="relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4 font-mono text-xs">
                    <div className="text-emerald-400">// Generated instantly</div>
                    <div className="text-blue-400">&lt;Button</div>
                    <div className="text-zinc-300 ml-2">className="bg-gradient-to-r</div>
                    <div className="text-zinc-300 ml-2">from-purple-600 to-blue-600"</div>
                    <div className="text-blue-400">&gt;</div>
                    <div className="text-zinc-300 ml-2">Click me</div>
                    <div className="text-blue-400">&lt;/Button&gt;</div>
                  </div>

                  <div className="text-center">
                    <motion.span 
                      className="text-xs text-emerald-400"
                      animate={{ opacity: isConnected ? [0.6, 1, 0.6] : 0.6 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✓ Pixel-perfect match achieved
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Bottom tagline */}
            <FadeIn delay={0.4}>
              <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40">
                  <span className="text-zinc-400">Works across any website, framework, or design system</span>
                  <ArrowRight className="h-4 w-4 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">30 seconds to perfect handoff</span>
                </div>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
};