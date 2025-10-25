import type { Route } from "./+types/home";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Header,
  Hero,
  Overview,
  Benefits,
  Integrations,
  HowItWorks,
  TechReq,
  FAQ,
  CTA,
  Footer,
  ScrollToTop,
  Glow
} from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Web to MCP - Send Website Components Directly to AI Coding Assistants" },
    { name: "description", content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using Model Context Protocol (MCP). No more screenshots or descriptions needed." },
    { name: "keywords", content: "web to mcp, model context protocol, cursor, claude code, ai coding, website components, design to code, web development, component transfer, mcp server" },
    { property: "og:title", content: "Web to MCP - Send Website Components Directly to AI Coding Assistants" },
    { property: "og:description", content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using MCP." },
    { property: "og:url", content: "https://web-to-mcp.com" },
    { property: "twitter:title", content: "Web to MCP - Send Website Components Directly to AI Coding Assistants" },
    { property: "twitter:description", content: "Bridge the gap between design and code. Send pixel-perfect website components directly to Cursor or Claude Code using MCP." },
    { name: "robots", content: "index, follow" },
    { name: "author", content: "Web to MCP" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:image", content: "/og.png" },
  ];
}

// ---- Main page ----
export default function WebToMcpLanding() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      <Glow />
      
      {/* Additional floating cloud elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating cloud */}
        <motion.div
          className="absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Medium cloud */}
        <motion.div
          className="absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg"
          animate={{
            x: [0, -15, 0],
            y: [0, 8, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Small cloud */}
        <motion.div
          className="absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md"
          animate={{
            x: [0, 12, 0],
            y: [0, -5, 0],
            opacity: [0.06, 0.1, 0.06]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
      </div>
      
      <Header />
      <main>
        <Hero y1={y1} y2={y2} />
        <Overview />
        <Benefits />
        <Integrations />
        <HowItWorks />
        <TechReq />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
