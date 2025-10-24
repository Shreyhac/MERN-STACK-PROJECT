import { useState } from 'react';
import { Download, Chrome, CheckCircle, Copy, ExternalLink } from 'lucide-react';

export default function ExtensionDownload() {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyToClipboard = async (text: string, step: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStep(step);
      setTimeout(() => setCopiedStep(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const downloadSteps = [
    {
      id: 'step1',
      title: 'Download Extension',
      description: 'Download the extension ZIP file',
      command: 'Click the download button below',
      action: () => {
        // Download the extension ZIP file
        const link = document.createElement('a');
        link.href = '/extension.zip';
        link.download = 'web-to-mcp-extension.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    {
      id: 'step2', 
      title: 'Extract ZIP File',
      description: 'Extract the downloaded ZIP file to a folder',
      command: 'Extract web-to-mcp-extension.zip to a folder',
      action: () => {}
    },
    {
      id: 'step3',
      title: 'Open Chrome Extensions',
      description: 'Navigate to Chrome extensions page',
      command: 'chrome://extensions/',
      action: () => copyToClipboard('chrome://extensions/', 'step3')
    },
    {
      id: 'step4',
      title: 'Enable Developer Mode',
      description: 'Toggle developer mode in the top right',
      command: 'Toggle the "Developer mode" switch',
      action: () => {}
    },
    {
      id: 'step5',
      title: 'Load Unpacked Extension',
      description: 'Click "Load unpacked" and select the extracted folder',
      command: 'Click "Load unpacked" → Select the extracted extension folder',
      action: () => {}
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-cyan-900/20" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23022c55e' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      
      {/* Scan Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-px animate-pulse" />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Chrome className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Web to MCP Extension
            </h1>
          </div>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Install the Chrome extension to capture website components and send them to AI coding assistants
          </p>
          
          {/* Web Store Button */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => window.open('https://chromewebstore.google.com/detail/web-to-mcp-import-any-web/hbnhkfkblpgjlfonnikijlofeiabolmi', '_blank')}
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-lg rounded-lg transition-colors flex items-center gap-3 shadow-lg hover:shadow-emerald-500/25"
            >
              <Chrome className="w-6 h-6" />
              Add to Chrome Web Store
            </button>
            <div className="text-sm text-zinc-400 text-center">
              <p>✨ Recommended: Install directly from Chrome Web Store</p>
              <p className="text-xs mt-1">Or use manual installation below for development</p>
            </div>
          </div>
        </div>

        {/* Manual Installation Steps */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-zinc-200 text-center mb-8">
            Manual Installation (Development)
          </h2>
        </div>

        {/* Installation Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6">
            {downloadSteps.map((step, index) => (
              <div key={step.id} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 hover:border-emerald-500/50 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                    <span className="text-emerald-400 font-mono text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-300 mb-3">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 font-mono text-sm text-zinc-300">
                        {step.command}
                      </div>
                      {step.action && (
                        <button
                          onClick={() => step.action()}
                          className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center gap-2"
                        >
                          {step.id === 'step1' ? (
                            <>
                              <Download className="w-4 h-4" />
                              Download Extension
                            </>
                          ) : step.id === 'step2' ? (
                            null
                          ) : step.id === 'step3' ? (
                            copiedStep === 'step3' ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )
                          ) : null}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>


          {/* Build Instructions */}
          <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Build Instructions
            </h3>
            <div className="space-y-3">
              <div className="bg-zinc-800 border border-zinc-700 rounded px-4 py-3 font-mono text-sm">
                <div className="text-zinc-400 mb-1"># Download the extension ZIP file</div>
                <div className="text-emerald-400">Click "Download Extension" button above</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded px-4 py-3 font-mono text-sm">
                <div className="text-zinc-400 mb-1"># Extract the ZIP file</div>
                <div className="text-emerald-400">Extract web-to-mcp-extension.zip to a folder</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded px-4 py-3 font-mono text-sm">
                <div className="text-zinc-400 mb-1"># Open Chrome Extensions</div>
                <div className="text-emerald-400">Go to chrome://extensions/</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded px-4 py-3 font-mono text-sm">
                <div className="text-zinc-400 mb-1"># Enable Developer Mode</div>
                <div className="text-emerald-400">Toggle "Developer mode" switch</div>
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded px-4 py-3 font-mono text-sm">
                <div className="text-zinc-400 mb-1"># Load Unpacked Extension</div>
                <div className="text-emerald-400">Click "Load unpacked" → Select extracted folder</div>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/30 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
