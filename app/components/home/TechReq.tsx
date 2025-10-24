import React from "react";
import { Chrome, Plug, CheckCircle } from "lucide-react";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { GoogleLogo } from "./Logos";

interface ReqCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
  step: number;
}

const ReqCard: React.FC<ReqCardProps> = ({ icon, title, description, color, step }) => {
  const colorConfig = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'bg-blue-500/5',
      accent: 'bg-blue-500'
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20', 
      text: 'text-emerald-400',
      glow: 'bg-emerald-500/5',
      accent: 'bg-emerald-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400', 
      glow: 'bg-purple-500/5',
      accent: 'bg-purple-500'
    }
  };

  const config = colorConfig[color];

  return (
    <div className="group relative">
      {/* Background glow effect */}
      <div className={`absolute inset-0 ${config.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <div className={`relative rounded-2xl border ${config.border} bg-zinc-900/60 p-6 hover:bg-zinc-900/80 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1 backdrop-blur-sm`}>
        {/* Step number */}
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <span className="text-xs font-bold text-zinc-400">{step}</span>
        </div>
        
        {/* Icon section */}
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${config.bg} ${config.border} ${config.text} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-white transition-colors">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Success indicator */}
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
          <CheckCircle className="h-3 w-3" />
          <span>Required</span>
        </div>

        {/* Subtle gradient overlay on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.glow} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
      </div>
    </div>
  );
};

export const TechReq: React.FC = () => (
  <section className="relative border-b border-zinc-900/60">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/30 to-transparent" />
    
    <Container className="py-16 md:py-24 relative">
      <FadeIn>
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Tag>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Technical Requirements
          </Tag>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-zinc-100">
            Everything you need to{" "}
            <span className="text-emerald-400">
              get started
            </span>
          </h2>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Simple setup. No complex installations. Start sending visual context in minutes.
          </p>
        </div>
      </FadeIn>

      {/* Requirements Grid */}
      <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
        <FadeIn delay={0.1}>
          <ReqCard 
            step={1}
            icon={<Chrome className="h-7 w-7"/>} 
            title="Chrome Browser"
            description="Install our lightweight Chrome extension from the Web Store. One-click installation with automatic updates."
            color="blue"
          />
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <ReqCard 
            step={2}
            icon={<GoogleLogo className="w-7 h-7" />} 
            title="Google Account"
            description="Sign in securely with your Google account for seamless authentication and personalized MCP URL generation."
            color="green"
          />
        </FadeIn>
        
        <FadeIn delay={0.3}>
          <ReqCard 
            step={3}
            icon={<Plug className="h-7 w-7"/>} 
            title="AI Coding Assistant"
            description="Configure MCP in Cursor IDE or Claude Code for direct component handoffs and enhanced workflow integration."
            color="purple"
          />
        </FadeIn>
      </div>

      {/* Bottom note */}
      <FadeIn delay={0.4}>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-zinc-700/50 bg-zinc-800/40 backdrop-blur-sm">
            <span className="text-zinc-400">Setup time:</span>
            <span className="font-semibold text-emerald-400">Less than 5 minutes</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </FadeIn>
    </Container>
  </section>
);
