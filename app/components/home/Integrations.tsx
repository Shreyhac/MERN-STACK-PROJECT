import React, { useState } from "react";
import { motion } from "framer-motion";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { Chrome, Copy, CheckCircle } from "lucide-react";

const CursorSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const mcpConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>"
    }
  }
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mcpConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
  <div className="space-y-12">
    {/* Step 1: Install Chrome Extension */}
    <FadeIn>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <span className="text-xl font-bold text-emerald-400">1</span>
    </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">Install Chrome extension</h3>
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
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer"
            onClick={() => window.open("/extension-download", "_blank")}
          >
            <Chrome className="h-5 w-5" />
            Install Extension
          </button>
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
              <code className="text-zinc-300">
{mcpConfig}
              </code>
            </pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
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
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer"
            onClick={() => window.open("https://web-to-mcp.com", "_blank")}
          >
            Get MCP URL
          </button>
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
            <h3 className="text-xl font-semibold text-zinc-100">Start capturing components</h3>
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
  );
};

const ClaudeSetupGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const claudeConfig = `{
  "mcpServers": {
    "web-to-mcp": {
      "url": "https://web-to-mcp.com/mcp/<YOUR_UNIQUE_ID>",
      "name": "Web to MCP",
      "description": "Send website components to Claude Code"
    }
  }
}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(claudeConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
  <div className="space-y-12">
    {/* Step 1: Install Chrome Extension */}
    <FadeIn>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-xl font-bold text-yellow-400">1</span>

          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">Install Chrome extension</h3>
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
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer"
            onClick={() => window.open("/extension-download", "_blank")}
          >
            <Chrome className="h-5 w-5" />
            Install Extension
          </button>
        </div>
      </div>
    </FadeIn>

    {/* Step 2: Configure MCP in Claude Code */}
    <FadeIn delay={0.1}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
                <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-xl font-bold text-yellow-400">2</span>

              </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">Configure MCP in Claude Code</h3>
            <p className="text-zinc-400">Set up the MCP configuration file in Claude Code</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.1</span>
              Open Claude Settings
            </div>
            <p className="text-sm text-zinc-400">Access Claude Code settings and navigate to MCP configuration</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.2</span>
              Navigate to MCP Settings
            </div>
            <p className="text-sm text-zinc-400">Go to Extensions → Model Context Protocol</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">2.3</span>
              Create MCP Configuration
            </div>
            <p className="text-sm text-zinc-400">Add Web to MCP as a new MCP server</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-zinc-100">Claude Code Configuration</h4>
          <p className="text-sm text-zinc-400">Add the following MCP server configuration:</p>
          
          <div className="relative">
            <pre className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-sm overflow-x-auto">
              <code className="text-zinc-300">
{claudeConfig}
              </code>
            </pre>
            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer">
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </FadeIn>

    {/* Step 3: Replace MCP URL */}
    <FadeIn delay={0.2}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-xl font-bold text-yellow-400">3</span>

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
              Add to Claude Code
            </div>
            <p className="text-zinc-400">Add your MCP URL to the Claude Code configuration</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-700 text-xs">3.3</span>
              Claude detects new tools
            </div>
            <p className="text-sm text-zinc-400">Claude Code will automatically detect the new MCP tool and you can start using it</p>
          </div>
        </div>

        <div className="mt-6">
          <button 
            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer"
            onClick={() => window.open("https://web-to-mcp.com", "_blank")}
          >
            Get MCP URL
          </button>
        </div>
      </div>
    </FadeIn>

    {/* Step 4: Start Capturing Components */}
    <FadeIn delay={0.3}>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-xl font-bold text-yellow-400">4</span>

          </div>
          <div>
            <h3 className="text-xl font-semibold text-zinc-100">Start capturing components</h3>
            <p className="text-zinc-400">Navigate to any website and start sending components to Claude Code</p>
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
              Refer to the element in Claude
            </div>
            <p className="text-sm text-zinc-400">You can refer to the element inside Claude Code chat using the reference id</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <CheckCircle className="h-5 w-5" />
            <span className="font-semibold">[SUCCESS]</span>
          </div>
          <p className="text-sm text-yellow-300 mt-1">Your MCP server is now connected! Components will be sent directly to Claude Code.</p>
        </div>
      </div>
    </FadeIn>
    </div>
  );
};

export const Integrations: React.FC = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string>('cursor');

  return (
    <section id="integrations" className="relative border-b border-zinc-900/60">
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
              Follow these step-by-step instructions to connect Web to MCP with your AI coding assistant
            </p>
          </div>
        </FadeIn>

        {/* Integration Selector */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center justify-center gap-1 rounded-2xl bg-gradient-to-r from-zinc-900/80 to-zinc-800/80 border border-zinc-700/50 p-1.5 backdrop-blur-sm shadow-xl">
              <button
                onClick={() => setSelectedIntegration('cursor')}
                className={`relative px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedIntegration === 'cursor' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 transform scale-105' 
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50'
                }`}
              >
                {selectedIntegration === 'cursor' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl blur opacity-50 -z-10"></div>
                )}
                Cursor IDE
              </button>
              <button
                onClick={() => setSelectedIntegration('claude')}
                className={`relative px-8 py-4 text-sm font-semibold rounded-xl transition-all duration-300 cursor-pointer ${
                  selectedIntegration === 'claude' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 transform scale-105' 
                    : 'text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700/50'
                }`}
              >
                {selectedIntegration === 'claude' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl blur opacity-50 -z-10"></div>
                )}
                Claude Code
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Setup Content */}
          <motion.div
            key={selectedIntegration}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {selectedIntegration === 'cursor' ? (
            <CursorSetupGuide />
            ) : (
            <ClaudeSetupGuide />
            )}
          </motion.div>

        {/* Bottom CTA */}
        <FadeIn delay={0.4}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
              <div className="text-left">
                <div className="font-semibold text-emerald-300">Ready to get UI components into your IDE?</div>
                <div className="text-sm text-emerald-400/80">Join thousands of developers saving hours every day</div>
              </div>
              <button 
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold rounded-lg transition-colors cursor-pointer"
                onClick={() => window.open("/extension-download", "_blank")}
              >
                Get started now
              </button>
            </div>
        </div>
        </FadeIn>
      </Container>
    </section>
  );
};