import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Chrome, Zap, MousePointer2, Cable } from "lucide-react";
import { Container, FadeIn, Tag, GradientText } from "./UtilityComponents";
import { Button } from "./UIComponents";
import { CursorLogo, ClaudeLogo, GoogleLogo } from "./Logos";
import { YouTubeModal } from "./YouTubeModal";

interface HeroProps {
  y1: any;
  y2: any;
}

interface PreviewCardProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const PreviewCard: React.FC<PreviewCardProps> = ({ label, icon, children }) => (
  <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 shadow-lg">
    <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
      {icon} <span>{label}</span>
    </div>
    {children}
  </div>
);

export const Hero: React.FC<HeroProps> = ({ y1, y2 }) => {
  const [phase, setPhase] = useState<string>("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSelecting = phase === "select";
  const isSending = phase === "send";
  const selectedIndex = 7;

  useEffect(() => {
    const phases = ["idle", "select", "send"];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-zinc-900/60">
      <Container className="relative pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <FadeIn>
              <Tag>New — Model Context Protocol ready</Tag>
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
                Send any website component to <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">Cursor</span>,
                <br className="hidden md:block"/> or Claude Code, in one click
              </h1>
            </FadeIn>
            <FadeIn delay={0.12}>
              <p className="mt-5 text-zinc-400 text-lg leading-7">
                No more screenshots, descriptions, or guesswork—just seamless visual handoffs that your AI coding assistant understands perfectly.
                Bridge the gap between design and code.
              </p>
            </FadeIn>
            <FadeIn delay={0.18}>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  className="h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                  onClick={() => window.open("https://chrome.google.com/webstore", "_blank")}
                >
                  Add to Chrome <Chrome className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  onClick={() => setIsModalOpen(true)}
                >
                  Watch 70s demo <Zap className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Parallax preview */}
          <div className="relative">
            {/* Main preview panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-2xl">
                <div className="relative rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" /> Live capture
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.34-3.34a9 9 0 11-12.68 0 9 9 0 0112.68 0z" />
                      </svg> Secure MCP channel
                    </div>
                  </div>
                  {/* Mock website area */}
                  <div className="relative">
                    {/* Simulated pointer */}
                    <motion.div
                      className="absolute z-10 h-3.5 w-3.5 rounded-full bg-zinc-100 shadow-[0_0_0_2px_rgba(0,0,0,0.2)]"
                      animate={{
                        top: isSelecting || isSending ? "32%" : "76%",
                        left: isSelecting || isSending ? "18%" : "10%",
                      }}
                      transition={{ duration: 0.9, ease: "easeInOut" }}
                    />
                    {/* Click ripple when selecting */}
                    {isSelecting && (
                      <motion.span
                        className="absolute z-0 h-8 w-8 rounded-full border-2 border-zinc-200"
                        style={{ top: "calc(32% - 8px)", left: "calc(18% - 8px)" }}
                        initial={{ opacity: 0.5, scale: 0.7 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        transition={{ duration: 0.8 }}
                      />
                    )}

                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-16 rounded-md bg-zinc-800/60 ${
                            i % 5 === 0 ? "col-span-2 h-24" : ""
                          } ${
                            (isSelecting || isSending) && i === selectedIndex
                              ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                              : i % 7 === 0
                              ? "bg-emerald-500/10 ring-1 ring-emerald-500/30"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Overlays inside panel, bottom corners */}
                  <div className="pointer-events-none">
                    <motion.div
                      className="absolute left-4 bottom-4 hidden md:block z-20"
                      animate={{ opacity: isSelecting ? 1 : 0, scale: isSelecting ? 1 : 0.98 }}
                      transition={{ duration: 0.35 }}
                    >
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                        <PreviewCard label="Component Selected" icon={<MousePointer2 className="h-4 w-4" />}>
                          <div className="h-16 w-40 rounded-md bg-gradient-to-br from-zinc-800 to-zinc-900" />
                        </PreviewCard>
                      </motion.div>
                    </motion.div>

                    <motion.div
                      className="absolute right-4 bottom-4 hidden md:block z-20"
                      animate={{ opacity: isSending ? 1 : 0, scale: isSending ? 1 : 0.98 }}
                      transition={{ duration: 0.35 }}
                    >
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                        <PreviewCard label="Send via WebToMCP" icon={<Cable className="h-4 w-4" />}>
                          <div className="flex items-center gap-2 text-xs text-zinc-400">
                            <CursorLogo className="text-zinc-800" /> Cursor
                            <span className="text-zinc-600">/</span>
                            <ClaudeLogo className="text-zinc-800" /> Claude Code
                          </div>
                        </PreviewCard>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
      
      {/* YouTube Modal */}
      <YouTubeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoId="1LHahVGjp1M"
      />
    </section>
  );
};
