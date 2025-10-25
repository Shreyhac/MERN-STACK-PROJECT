import React from 'react';
import { Terminal, Code, Zap, Monitor, Globe, Chrome } from 'lucide-react';

export default function OGImagePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 space-y-8">
      {/* Main OG Image - 1200x630 */}
      <div 
        className="relative w-[1200px] h-[630px] bg-[#0a0a0a] border border-zinc-800 overflow-hidden box-border"
      >
        {/* Gradient pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 40%, rgba(16, 185, 129, 0.03) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(14, 165, 233, 0.03) 50%, transparent 60%)
            `,
            backgroundSize: '60px 60px, 60px 60px'
          }}></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
          {/* Logo/Brand */}
          <div className="mb-8 flex items-center justify-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent tracking-wider font-mono">
              WebToMCP
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-3xl text-zinc-100 font-mono mb-6 tracking-wide">
            Send any website component to Cursor, or Claude Code, in one click
          </h2>
          <p className="text-xl text-zinc-400 font-mono max-w-3xl leading-relaxed mb-12">
            Select any website element and ship it straight to your coding assistant as a pixel‑perfect visual reference. Bridge the gap between design and code—instantly.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-12 mb-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-800 border-2 border-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-mono text-zinc-100 mb-2">No More Complex Prompts</h3>
              <p className="text-sm text-zinc-400 font-mono">Stop writing lengthy explanations</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-800 border-2 border-sky-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-10 h-10 text-sky-400" />
              </div>
              <h3 className="text-lg font-mono text-zinc-100 mb-2">Perfect Design Matching</h3>
              <p className="text-sm text-zinc-400 font-mono">Achieve exact visual matches</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-zinc-800 border-2 border-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-lg font-mono text-zinc-100 mb-2">Lightning Fast Workflow</h3>
              <p className="text-sm text-zinc-400 font-mono">10x faster than traditional methods</p>
            </div>
          </div>

          {/* AI Integrations */}
          <div className="flex gap-12 justify-center items-center">
            <div className="flex items-center gap-3 text-zinc-300 font-mono text-base">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span>Works with Cursor</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-300 font-mono text-base">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <span>Works with Claude Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Small Promo Tile - 440x280 */}
      <div 
        className="relative w-[440px] h-[280px] bg-[#0a0a0a] border border-zinc-800 overflow-hidden box-border"
      >
        {/* Gradient pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 40%, rgba(16, 185, 129, 0.03) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(14, 165, 233, 0.03) 50%, transparent 60%)
            `,
            backgroundSize: '40px 40px, 40px 40px'
          }}></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6">
          {/* Logo/Brand */}
          <div className="mb-4 flex items-center justify-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent tracking-wider font-mono">
              WebToMCP
            </h1>
          </div>

          {/* Tagline */}
          <h2 className="text-lg text-zinc-100 font-mono mb-3 tracking-wide">
            Send any website component to Cursor, or Claude Code, in one click
          </h2>
          <p className="text-sm text-zinc-400 font-mono max-w-xs leading-relaxed mb-6">
            Select any website element and ship it straight to your coding assistant as a pixel‑perfect visual reference.
          </p>

          {/* Single Benefit */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-zinc-800 border border-emerald-500 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-mono text-zinc-100">Lightning Fast Workflow</span>
          </div>

          {/* AI Integrations */}
          <div className="flex gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Cursor</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs">
              <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
              <span>Claude Code</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Image - 1400x560 */}
      <div 
        className="relative w-[1400px] h-[560px] bg-[#0a0a0a] border border-zinc-800 overflow-hidden box-border"
      >
        {/* Gradient pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 40%, rgba(16, 185, 129, 0.03) 50%, transparent 60%),
              linear-gradient(-45deg, transparent 40%, rgba(14, 165, 233, 0.03) 50%, transparent 60%)
            `,
            backgroundSize: '80px 80px, 80px 80px'
          }}></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center p-12">
          {/* Left side - Logo and main content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Logo/Brand */}
            <div className="mb-6 flex items-center justify-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent tracking-wider font-mono">
                WebToMCP
              </h1>
            </div>

            {/* Tagline */}
            <h2 className="text-2xl text-zinc-100 font-mono mb-4 tracking-wide">
              Send any website component to Cursor, or Claude Code, in one click
            </h2>
            <p className="text-lg text-zinc-400 font-mono max-w-md leading-relaxed mb-6">
              Select any website element and ship it straight to your coding assistant as a pixel‑perfect visual reference.
            </p>

            {/* AI Integrations */}
            <div className="flex gap-6 justify-center items-center">
              <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Works with Cursor</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm">
                <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                <span>Works with Claude Code</span>
              </div>
            </div>
          </div>

          {/* Right side - Benefits */}
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 border-2 border-emerald-500 rounded-xl flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-mono text-zinc-100">No More Complex Prompts</h3>
                  <p className="text-xs text-zinc-400 font-mono">Stop writing lengthy explanations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 border-2 border-sky-500 rounded-xl flex items-center justify-center">
                  <Code className="w-6 h-6 text-sky-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-mono text-zinc-100">Perfect Design Matching</h3>
                  <p className="text-xs text-zinc-400 font-mono">Achieve exact visual matches</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-800 border-2 border-emerald-500 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-mono text-zinc-100">Lightning Fast Workflow</h3>
                  <p className="text-xs text-zinc-400 font-mono">10x faster than traditional methods</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Card - 279x368 */}
      <div 
        className="relative w-[279px] h-[368px] bg-zinc-900 border border-zinc-800 overflow-hidden box-border rounded-xl"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, rgba(14, 165, 233, 0.1) 2px, transparent 2px)
            `,
            backgroundSize: '20px 20px, 20px 20px'
          }}></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
          {/* Icon and Title */}
          <div className="mb-4 flex flex-col items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent tracking-wide font-mono">
              WebToMCP
            </h1>
          </div>

          {/* Main Benefit */}
          <h2 className="text-base font-semibold text-zinc-100 mb-3 font-mono">
            Transform Your Workflow
          </h2>

          {/* Benefits List */}
          <div className="space-y-2 mb-4 w-full">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-xs text-zinc-300 font-mono text-left">No complex prompts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
              </div>
              <span className="text-xs text-zinc-300 font-mono text-left">Perfect design matching</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
              </div>
              <span className="text-xs text-zinc-300 font-mono text-left">10x faster workflow</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-sky-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-sky-400 rounded-full"></div>
              </div>
              <span className="text-xs text-zinc-300 font-mono text-left">Works with Cursor & Claude</span>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5">
            <span className="text-xs font-semibold text-emerald-400 font-mono">
              Start Capturing Today
            </span>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-500/10 rounded-full"></div>
        <div className="absolute bottom-6 left-4 w-6 h-6 bg-sky-500/10 rounded-full"></div>
      </div>
    </div>
  );
} 