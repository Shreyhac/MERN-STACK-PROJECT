import type { Route } from "./+types/cursor";
import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Zap, Cpu, LogIn, Copy, CheckCircle, ArrowRight, Monitor, Globe, Chrome, Eye, Code, MousePointer2, Cable, Plug } from "lucide-react";
import { Header } from "~/components/home/Header";
import { SimpleFooter } from "~/components/ui/SimpleFooter";
import { Container, FadeIn, Tag, GradientText, Glow } from "~/components/home/UtilityComponents";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "~/components/home/UIComponents";
import { CursorLogo, GoogleLogo } from "~/components/home/Logos";
import { YouTubeModal } from "~/components/home/YouTubeModal";
import { Step } from "~/components/home/Step";
import { TechReq } from "~/components/home/TechReq";
import { 
  trackPageView, 
  trackSetupViewed, 
  trackMcpConfigCopied,
  trackButtonClick,
  trackLinkClick
} from "~/lib/analytics";
import { useAuth } from "~/lib/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE" },
    { name: "description", content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer from any website to your AI coding assistant." },
    { name: "keywords", content: "cursor, mcp, model context protocol, website components, ai coding, cursor ide, web development, component transfer" },
    { property: "og:title", content: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE" },
    { property: "og:description", content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer." },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "og:url", content: "https://web-to-mcp.com/cursor" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Web to MCP for Cursor - Send Website Components Directly to Cursor IDE" },
    { name: "twitter:description", content: "Integrate website components directly into Cursor IDE using MCP. Step-by-step setup guide for seamless component transfer." },
    { name: "twitter:image", content: "/og.png" },
  ];
}

// Preview card component for hero section
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

export default function CursorPage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phase, setPhase] = useState<string>("idle");
  const [isConnected, setIsConnected] = useState(false);
  const { login } = useAuth();
  
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);

  const isSelecting = phase === "select";
  const isSending = phase === "send";
  const selectedIndex = 7;

  useEffect(() => {
    // Track page view and setup viewed
    trackPageView('Cursor Setup Page', window.location.href);
    trackSetupViewed('cursor');
    
    // Animate phases for hero
    const phases = ["idle", "select", "send"];
    let index = 0;
    const id = setInterval(() => {
      index = (index + 1) % phases.length;
      setPhase(phases[index]);
    }, 2000);
    
    // Animate connection state for overview
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => !prev);
    }, 3000);
    
    return () => {
      clearInterval(id);
      clearInterval(connectionInterval);
    };
  }, []);

  const handleGoogleLogin = () => {
    login();
  };

  const handleDownloadExtension = () => {
    window.open("https://chrome.google.com/webstore", "_blank");
  };

  const copyToClipboard = async (text: string, step: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
      
      // Track MCP config copy
      if (step === 1) {
        trackMcpConfigCopied('cursor');
      }
      trackButtonClick('copy_button', `cursor_setup_step_${step}`);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const mcpConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>"
    }
  }
}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      {/* Background Effects */}
      <Glow />

      <Header />

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-zinc-900/60">
          <Container className="relative pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <div>
                <FadeIn>
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
                Cursor Integration Ready
              </Tag>
                </FadeIn>
                <FadeIn delay={0.06}>
                  <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
                  Send any website component to <GradientText>Cursor</GradientText> in one click
                </h1>
                </FadeIn>
                <FadeIn delay={0.12}>
                  <p className="mt-5 text-zinc-400 text-lg leading-7">
                    No more screenshots, descriptions, or guesswork—just seamless visual handoffs that your AI coding assistant understands perfectly.
                    Bridge the gap between{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      design
                    </span>
                    {" "}and{" "}
                    <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                      code
                    </span>
                    .
                  </p>
                </FadeIn>
                <FadeIn delay={0.18}>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button 
                  className="h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                      onClick={handleGoogleLogin}
                >
                      <LogIn className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  className="h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                      onClick={() => setIsModalOpen(true)}
                >
                      <Zap className="mr-2 h-5 w-5" />
                      Watch Demo
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
                          </svg> Direct to Cursor
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
                                <CursorLogo className="text-zinc-800" /> Cursor IDE
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

        {/* Setup Guide Section */}
        <section className="relative border-b border-zinc-900/60">
          <Container className="py-16 md:py-24">
            <FadeIn>
              <div className="mx-auto mb-12 max-w-3xl text-center">
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                </svg>
                Setup Guide
              </Tag>
                <h2 className="mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  From{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    extension
                  </span>
                  {" "}to{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    integration
                  </span>
                  {" "}in{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    minutes
                  </span>
                </h2>
                <p className="mt-4 text-zinc-400 text-lg">
                  Follow these step-by-step instructions to connect Web to MCP with Cursor IDE
                </p>
            </div>
            </FadeIn>

            <div className="space-y-12">
              {/* Step 1: Install Chrome Extension */}
              <FadeIn>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xl font-bold text-emerald-400">1</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-100">Install Chrome Extension</h3>
                      <p className="text-zinc-400">Install the Web to MCP browser extension</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">1.1</span>
                        Install Extension
                      </div>
                      <p className="text-sm text-zinc-400">Click the "Install Extension" button to get manual installation instructions</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">1.2</span>
                        Click "Install Extension"
                      </div>
                      <p className="text-sm text-zinc-400">Install the extension to your browser</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">1.3</span>
                        Sign in to your account
                      </div>
                      <p className="text-sm text-zinc-400">Authenticate with your Google account to get your unique MCP URL</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                      onClick={handleDownloadExtension}
                    >
                      <Chrome className="h-5 w-5 mr-2" />
                      Add to Chrome
                    </Button>
                  </div>
                </div>
              </FadeIn>

              {/* Step 2: Configure MCP in Cursor */}
              <FadeIn delay={0.1}>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xl font-bold text-emerald-400">2</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-100">Configure MCP in Cursor</h3>
                      <p className="text-zinc-400">Set up the MCP configuration file in Cursor IDE</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.1</span>
                        Open Cursor Settings
                      </div>
                      <p className="text-sm text-zinc-400">Press Ctrl+Shift+J (or Cmd+Shift+J on Mac) to open settings</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.2</span>
                        Navigate to MCP Settings
                      </div>
                      <p className="text-sm text-zinc-400">Go to Features → Model Context Protocol</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.3</span>
                        Create MCP Configuration
                      </div>
                      <p className="text-sm text-zinc-400">Choose between project-specific or global configuration</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-zinc-100">Project Configuration</h4>
                    <p className="text-sm text-zinc-400">Create <code className="px-2 py-1 bg-zinc-800 rounded text-emerald-400">.cursor/mcp.json</code> in your project root:</p>
                    
                      <div className="relative">
                      <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto">
                        <code className="text-zinc-300">{mcpConfig}</code>
                        </pre>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(mcpConfig, 1)}
                          className="absolute top-2 right-2 border-zinc-600 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          {copiedStep === 1 ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
              </FadeIn>

              {/* Step 3: Replace MCP URL */}
              <FadeIn delay={0.2}>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xl font-bold text-emerald-400">3</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-100">Replace MCP URL</h3>
                      <p className="text-zinc-400">Update the configuration with your actual MCP URL</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">3.1</span>
                        Get Your MCP URL
                      </div>
                      <p className="text-sm text-zinc-400">Sign in to your account and copy your unique MCP URL from the dashboard</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">3.2</span>
                        Add to Cursor
                      </div>
                      <p className="text-sm text-zinc-400">Add your MCP URL to the Cursor configuration</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">3.3</span>
                        Cursor detects new tools
                      </div>
                      <p className="text-sm text-zinc-400">Cursor will automatically detect the new MCP tool and you can start using it</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                      onClick={handleGoogleLogin}
                    >
                      <LogIn className="h-5 w-5 mr-2" />
                      Get MCP URL
                    </Button>
                  </div>
                </div>
              </FadeIn>

              {/* Step 4: Start Capturing Components */}
              <FadeIn delay={0.3}>
                <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                      <span className="text-xl font-bold text-emerald-400">4</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-zinc-100">Start Capturing Components</h3>
                      <p className="text-zinc-400">Navigate to any website and start sending components to Cursor</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">4.1</span>
                        Navigate to Website
                      </div>
                      <p className="text-sm text-zinc-400">Go to any website you want to extract components from</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">4.2</span>
                        Click Extension Icon
                      </div>
                      <p className="text-sm text-zinc-400">Click the Web to MCP extension icon in your browser</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">4.3</span>
                        Select Component
                      </div>
                      <p className="text-sm text-zinc-400">Click on any element you want to capture and copy its reference id</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">4.4</span>
                        Refer to the element in Cursor
                      </div>
                      <p className="text-sm text-zinc-400">You can refer to the element inside Cursor chat using the reference id</p>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">[SUCCESS]</span>
                    </div>
                    <p className="text-sm text-emerald-300 mt-1">Your MCP server is now connected! Components will be sent directly to Cursor IDE.</p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Overview/Why Web to MCP Section */}
        <section className="relative border-b border-zinc-900/60">
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
                  Why Web To MCP for Cursor?
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
                    transition={{ duration: 0.8, ease: "easeInOut" }}
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
                          "How do I explain this to Cursor?"
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
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
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
                          <p className="text-xs text-zinc-400">Perfect code output in Cursor</p>
                      </div>
                    </div>

                      {/* Mock code output */}
                      <div className="relative rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 mb-4 font-mono text-xs">
                        <div className="text-emerald-400">// Generated in Cursor</div>
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
                          ✓ Pixel-perfect match in Cursor
                        </motion.span>
                    </div>
                  </div>
                  </motion.div>
            </div>

                {/* Bottom tagline */}
                <FadeIn delay={0.4}>
                  <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40">
                      <span className="text-zinc-400">Works with any website, perfectly integrated with Cursor IDE</span>
                      <ArrowRight className="h-4 w-4 text-emerald-400" />
                      <span className="font-semibold text-emerald-400">30 seconds to perfect handoff</span>
          </div>
                  </div>
                </FadeIn>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* How It Works Section */}
        <section id="how" className="relative border-b border-zinc-900/60">
          <Container className="py-16 md:py-24">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
                How it works
              </Tag>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                From{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  inspiration
                </span>
                {" "}to{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  implementation
                </span>
                {" "}in{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  30 seconds
                </span>
                .
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <Step index={1} title="Authenticate with Google" iconType="google-auth">Sign in and you're set.</Step>
              <Step index={2} title="Install the Chrome extension" iconType="chrome-extension">Add it from the Web Store.</Step>
              <Step index={3} title="Navigate to any website" iconType="website-nav">Open the page with the component you want.</Step>
              <Step index={4} title="Click the extension icon" iconType="extension-click">Activate component selection mode.</Step>
              <Step index={5} title="Select the component" iconType="component-select">We capture it exactly as rendered.</Step>
              <Step index={6} title="Send to Cursor IDE" iconType="send-to-ai">Delivered via MCP to Cursor for perfect integration.</Step>
            </div>
          </Container>
        </section>

        {/* Cursor Benefits Section */}
        <section className="relative border-b border-zinc-900/60">
          <Container className="py-16 md:py-24">
            <FadeIn>
              <div className="mx-auto mb-16 max-w-3xl text-center">
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                  <path d="M9 12l2 2 4-4"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
                </svg>
                  Cursor Benefits
              </Tag>
                <h2 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                  Supercharge your{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    Cursor
                  </span>
                  {" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                    workflow
                  </span>
                </h2>
                <p className="mt-3 text-zinc-400 text-lg leading-relaxed">
                  Stop describing components. Send pixel-perfect references that Cursor understands instantly.
                </p>
            </div>
            </FadeIn>

            {/* Benefits Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <FadeIn delay={0.1}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Monitor className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Perfect Visual Context
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Send actual website components to Cursor instead of describing them. Your AI assistant gets pixel-perfect context every time.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Native MCP Integration
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Built specifically for Cursor's Model Context Protocol. Seamless handoffs that work perfectly with your coding workflow.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Any Website, Any Framework
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Capture components from any website - design inspiration, competitor analysis, or reference implementations for Cursor.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Eliminate Back-and-Forth
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    No more "make it look like this" conversations. Send precise references and get exact implementations in Cursor.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.5}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Lightning Fast Development
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    From component selection to Cursor implementation in under 30 seconds. Speed up your development cycle dramatically.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>

              <FadeIn delay={0.6}>
                <motion.div
                  className="group relative rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <h4 className="text-lg font-semibold text-zinc-100 mb-2">
                    Smart Component Analysis
                  </h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Automatically captures CSS, structure, and context. Cursor receives comprehensive component data for accurate recreation.
                  </p>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              </FadeIn>
            </div>
          </Container>
        </section>

        {/* Technical Requirements Section */}
        <TechReq />

        {/* Pricing Section */}
        <section id="pricing" className="relative border-b border-zinc-900/60">
          <Container className="py-16 md:py-24">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Pricing
              </Tag>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Start saving{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  hours
                    </span>
                {" "}every day.
              </h2>
              <p className="mt-3 text-zinc-400">Simple pricing that grows with you.</p>
          </div>

            <div className="mx-auto max-w-md">
              {/* Pricing Toggle */}
              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-sm font-medium text-zinc-500">
                  Monthly
                    </span>
                <button
                  className="relative w-16 h-8 rounded-full transition-colors duration-200 cursor-pointer bg-emerald-500"
                >
                  <div
                    className="absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 translate-x-8"
                  />
                </button>
                <span className="text-sm font-medium text-zinc-100">
                  Annual
                </span>
                <span className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs px-2 py-1 rounded border">
                  50% OFF
                </span>
              </div>

              {/* Single Pricing Card */}
              <Card className="relative border-zinc-800 bg-zinc-900/40 ring-1 ring-emerald-500/30">
                <CardHeader className="text-center">
                  <CardTitle className="text-zinc-100">Pro</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-zinc-50">
                        $2.5
                    </span>
                      <span className="text-zinc-400 text-lg">
                        per month
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      billed yearly ($30)
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-zinc-300 text-sm">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      Unlimited component captures
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      Direct MCP integration
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      Cursor IDE support
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                      Priority support
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                      50% savings
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                    onClick={handleGoogleLogin}
                  >
                    Get Started for free
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Container>
        </section>

        {/* FAQ Section */}
        <section className="relative border-b border-zinc-900/60">
          <Container className="py-16 md:py-24">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Tag>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <path d="M12 17h.01"/>
                </svg>
                FAQ
              </Tag>
              <h2 className="mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Cursor-specific{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  questions
                </span>
                {" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  answered
                </span>
                .
              </h2>
          </div>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How does Web to MCP integrate with Cursor IDE?</AccordionTrigger>
                <AccordionContent>
                  Web to MCP connects directly to Cursor through the Model Context Protocol (MCP). Once configured, captured components are automatically available in your Cursor chat context, allowing the AI to understand and recreate them perfectly.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Do I need to install anything in Cursor itself?</AccordionTrigger>
                <AccordionContent>
                  No additional Cursor extensions needed. You only need to add a simple MCP configuration file to enable the connection. Cursor natively supports MCP, so it will automatically detect and use the Web to MCP tools.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">What data does Cursor receive from captured components?</AccordionTrigger>
                <AccordionContent>
                  Cursor receives the component's DOM structure, computed CSS styles, screenshot, and contextual information. This comprehensive data allows Cursor's AI to understand both the visual appearance and technical implementation details.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Can I use this with Cursor's Composer feature?</AccordionTrigger>
                <AccordionContent>
                  Absolutely! Web to MCP works seamlessly with Cursor Composer. You can capture components and immediately reference them in Composer to build entire features or pages using the captured designs as references.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How accurate are the component recreations in Cursor?</AccordionTrigger>
                <AccordionContent>
                  With pixel-perfect references, Cursor can achieve remarkable accuracy. The quality depends on the complexity of the component and your prompting, but users typically see 90%+ visual fidelity on first generation, with easy refinements for perfect matches.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Does this work with both Cursor's free and Pro plans?</AccordionTrigger>
                <AccordionContent>
                  Yes, Web to MCP works with all Cursor plans. The MCP functionality is built into Cursor itself. However, Pro plans will give you more AI usage for generating components from the captured references.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Can I capture and use multiple components in one Cursor session?</AccordionTrigger>
                <AccordionContent>
                  Yes! You can capture multiple components and reference them all within the same Cursor chat. Each component gets a unique reference ID, making it easy to build complex UIs by combining multiple captured elements.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="relative">
          <Container className="py-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
              <Zap className="h-4 w-4 text-emerald-400"/> Stop explaining components to Cursor. Send them directly.
            </div>
            <h3 className="mt-4 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Transform your{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                Cursor
              </span>
              {" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                workflow
              </span>
              {" "}in{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                one click
              </span>
              .
            </h3>
            <p className="mt-3 text-zinc-400">Add the extension and start coding with perfect visual context in Cursor IDE.</p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Button 
                className="h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                  onClick={handleGoogleLogin} 
                >
                <LogIn className="mr-2 h-5 w-5" />
                Get Started for Free
                </Button>
                <Button 
                  variant="outline" 
                className="h-11 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                  onClick={handleDownloadExtension} 
                >
                <Chrome className="mr-2 h-5 w-5" />
                  Add to Chrome
                </Button>
              </div>
          </Container>
        </section>

        <SimpleFooter />
      </div>
    </div>
  );
} 