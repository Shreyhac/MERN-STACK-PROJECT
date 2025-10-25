import { useState, useEffect } from 'react';
import { CaptureButton } from '@/components/CaptureButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { LoginButton } from '@/components/LoginButton';
import { apiClient, User } from '@/lib/api';
import { Terminal, Zap, Copy, Check, Chrome } from 'lucide-react';
import { Sentry } from '@/lib/sentry';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [captureId, setCaptureId] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [copiedButton, setCopiedButton] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    checkUserAuth();
    
    // Listen for capture completion messages from content script
    const handleMessage = (message: any) => {
      if (message.action === 'captureCompleted') {
        setCaptureId(message.captureId);
        setShowSuccess(true);
      }
    };
    
    browser.runtime.onMessage.addListener(handleMessage);
    
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const checkUserAuth = async () => {
    try {
      setIsLoadingUser(true);
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      if (error instanceof Error && error.message === 'Authentication required') {
        setUser(null);
      } else {
        // Silently handle other errors without showing to user
        console.error('Auth check error:', error);
        Sentry.captureException(error);
        setUser(null);
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handleLogin = () => {
    const frontendUrl = apiClient.getFrontendUrl();
    browser.tabs.create({ url: frontendUrl + '/login/' });
    window.close();
  };

  const handleCapture = async (type: 'component' | 'fullpage') => {
    // Check if user can create captures
    if (user && !user.can_create_capture) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Get the active tab
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('No active tab found');
      }

      // Try to send message to content script
      try {
        await browser.tabs.sendMessage(tab.id, {
          action: 'startCapture',
          type: type
        });
        
        // If successful, close popup
        window.close();
      } catch (error) {
        // If content script is not available (remote end does not exist), refresh the page and retry
        console.log('Content script not available, refreshing page...');
        setIsRefreshing(true);
        
        // Refresh the current tab
        await browser.tabs.reload(tab.id);
        
        // Wait a moment for the page to load and content script to be injected
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Try to send the capture message again
        await browser.tabs.sendMessage(tab.id, {
          action: 'startCapture',
          type: type
        });
        
        // If successful, close popup
        window.close();
      }
    } catch (error) {
      console.error('Error starting capture:', error);
      Sentry.captureException(error);
      setIsLoading(false);
    }
  };

  const handleUpgrade = () => {
    const frontendUrl = apiClient.getFrontendUrl();
    browser.tabs.create({ url: `${frontendUrl}/upgrade` });
    window.close();
  };

  const copyToClipboard = async (text: string, buttonType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedButton(buttonType);
      setTimeout(() => setCopiedButton(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      Sentry.captureException(error);
    }
  };

  const getMcpUrl = () => {
    return user?.mcp_url;
  };

  const getCursorMcpConfig = () => {
    const mcpUrl = getMcpUrl();
    return `
    "web-to-mcp": {
      "url": "${mcpUrl}"
    }
`;
  };

  const getClaudeCodeCommand = () => {
    const mcpUrl = getMcpUrl();
    return `claude mcp add --transport http web-to-mcp ${mcpUrl}`;
  };

  const CopyButton = ({ 
    text, 
    buttonType, 
    label
  }: { 
    text: string; 
    buttonType: string; 
    label: string;
  }) => (
    <button
      onClick={() => copyToClipboard(text, buttonType)}
      className={`
        flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium border rounded-md
        transition-all duration-200 hover:scale-105
        border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer
        ${copiedButton === buttonType ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300' : ''}
      `}
    >
      {copiedButton === buttonType ? (
        <Check className="w-3 h-3" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
      {label}
    </button>
  );

  if (isLoadingUser) {
    return (
      <div className="w-96 bg-[#0a0a0a] border border-zinc-800/60 font-sans relative">
        <div className="p-6 space-y-6 relative z-10">
          <div className="flex flex-col items-center gap-3 py-8">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-zinc-400 font-medium">
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 bg-[#0a0a0a] border border-zinc-800/60 font-sans relative overflow-hidden">
      {/* Background glow elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl" />
        <div className="absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg" />
        <div className="absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md" />
      </div>
      
      <div className="p-6 space-y-6 relative z-10">
        {/* Main Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
              Web to MCP
            </h1>
          </div>
          
          
          {/* Description */}
          <p className="text-sm text-zinc-400 leading-relaxed">
            Select any website element and ship it straight to your coding assistant as a pixel‑perfect visual reference.
          </p>
        </div>

        {/* User Authentication Section */}
        {user ? (
          <>
            {/* Upgrade CTA or Capture Buttons */}
            {!user.can_create_capture ? (
              <div className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-sm text-red-400 font-medium">
                    Free tier limit reached
                  </div>
                  
                  <div className="p-4 border border-red-500/30 bg-red-500/5 rounded-lg">
                    <div className="text-center space-y-3">
                      <Zap className="w-8 h-8 text-red-400 mx-auto" />
                      <div className="text-sm text-red-300 font-medium">
                        Upgrade to continue capturing
                      </div>
                      <button
                        onClick={handleUpgrade}
                        className="w-full px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-300 font-medium text-sm rounded-md hover:bg-red-500/30 hover:border-red-500/60 transition-all duration-200 hover:scale-105"
                      >
                        Upgrade Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>


                {/* Capture Button */}
                <div className="power-up">
                  <CaptureButton
                    type="component"
                    onClick={() => handleCapture('component')}
                    disabled={isLoading}
                    loading={isLoading}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <div className="text-center space-y-4">
              <div className="text-sm text-zinc-400 font-medium">
                Authentication required
              </div>
              
              <LoginButton onClick={handleLogin} />
              
              <div className="text-xs text-zinc-500 font-medium">
                You'll be redirected to the website to log in
              </div>
            </div>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-4 border border-zinc-800 bg-zinc-900/40 rounded-lg">
            <LoadingSpinner size="lg" />
            <div className="text-center space-y-1">
              {isRefreshing ? (
                <>
                  <p className="text-sm text-zinc-400 font-medium">
                    Refreshing page...
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-400 font-medium">
                    Initializing capture sequence...
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* MCP Copy Buttons - Only show if user is logged in */}
        {user && (
          <div className="pt-3 border-t border-zinc-800/60">
            <div className="flex gap-2">
              <CopyButton
                text={getMcpUrl() || ''}
                buttonType="mcp-url"
                label="MCP URL"
              />
              <CopyButton
                text={getCursorMcpConfig()}
                buttonType="cursor-config"
                label="Cursor Config"
              />
              <CopyButton
                text={getClaudeCodeCommand()}
                buttonType="claude-command"
                label="Claude Command"
              />
            </div>
          </div>
        )}

        {/* User Status - At the very bottom */}
        {user && (
          <div className="text-xs text-zinc-500 font-medium text-center pt-2 space-y-1">
            <div>
              Logged in as {user.email}
            </div>
            <div className="text-zinc-600">
              Status: {user.subscription_status !== 'active' ? 'Free Tier' : 'Pro plan'}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;
