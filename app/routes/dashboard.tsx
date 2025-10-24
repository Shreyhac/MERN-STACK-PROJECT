import type { Route } from "./+types/dashboard";
import { Terminal, Code, Copy, Check, ChevronLeft, ChevronRight, ExternalLink, ChevronDown, LogOut, CreditCard, Crown, Download } from "lucide-react";
import { useAuth } from "~/lib/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "~/hooks/use-toast";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container, FadeIn, Tag, GradientText, Glow } from "~/components/home/UtilityComponents";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/home/UIComponents";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { 
  trackPageView, 
  trackDashboardAccessed, 
  trackLogout, 
  trackCaptureCopied, 
  trackMcpConfigCopied,
  trackButtonClick,
  trackLinkClick,
  trackApiError
} from "~/lib/analytics";

interface Capture {
  slug: string;
  website_url: string;
  token_count: number;
  created_at: string;
}

interface CapturesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Capture[];
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Web to MCP" },
    { name: "description", content: "Manage your captures and MCP configuration" },
    { property: "og:title", content: "Dashboard - Web to MCP" },
    { property: "og:description", content: "Manage your captures and MCP configuration" },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "og:url", content: "https://web-to-mcp.com/dashboard" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Dashboard - Web to MCP" },
    { name: "twitter:description", content: "Manage your captures and MCP configuration" },
    { name: "twitter:image", content: "/og.png" },
  ];
}



function DashboardContent() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [isLoadingCaptures, setIsLoadingCaptures] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedButton, setCopiedButton] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -80]);
  const y2 = useTransform(scrollY, [0, 800], [0, -40]);

  // Check if user has an active subscription
  const isPaidUser = !!(
    user?.subscription_status === 'active' ||
    user?.subscription_tier === 'pro' ||
    user?.subscription_tier === 'premium' ||
    // Fallback: check if user has any subscription-related field
    user?.subscription_status ||
    user?.subscription_tier
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !(target instanceof Element)) {
        setShowDropdown(false);
        return;
      }
      if (!target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Fetch captures from API
  const fetchCaptures = async (page: number = 1) => {
    try {
      setIsLoadingCaptures(true);
      const response = await axios.get<CapturesResponse>(`/api/captures/list/?page=${page}`, {
        withCredentials: true,
      });
      
      setCaptures(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
    } catch (error) {
      console.error('Failed to fetch captures:', error);
      trackApiError('/api/captures/list/', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingCaptures(false);
    }
  };

  useEffect(() => {
    // Track dashboard access
    trackDashboardAccessed();
    trackPageView('Dashboard', window.location.href);
    
    fetchCaptures(currentPage);
  }, [currentPage]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      trackLogout();
      trackButtonClick('logout_button', 'dashboard');
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error('Logout failed:', error);
      window.location.href = "/";
    } finally {
      setIsLoggingOut(false);
    }
  };

  const copyToClipboard = async (text: string, buttonType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedButton(buttonType);
      setTimeout(() => setCopiedButton(null), 2000);
      
      // Track copy actions
      if (buttonType.includes('capture')) {
        trackCaptureCopied(buttonType);
      } else if (buttonType.includes('mcp')) {
        const configType = buttonType.includes('cursor') ? 'cursor' : 'claude';
        trackMcpConfigCopied(configType);
      }
      trackButtonClick('copy_button', buttonType);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const getMcpUrl = () => {
    return user?.mcp_url || '';
  };

  const getCursorMcpConfig = () => {
    const mcpUrl = getMcpUrl();
    return `"web-to-mcp": {
  "url": "${mcpUrl}"
}`;
  };

  const getClaudeCodeCommand = () => {
    const mcpUrl = getMcpUrl();
    return `claude mcp add --transport http web-to-mcp ${mcpUrl}`;
  };

  const getPromptText = (captureId: string) => {
    return `Use the web-to-mcp tool with reference ${captureId} to implement the fetched website component.`;
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
        flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border rounded
        transition-all duration-200 hover:scale-105
        border-emerald-500/40 text-emerald-400 hover:border-emerald-500/60 hover:bg-emerald-500/10 cursor-pointer
        ${copiedButton === buttonType ? 'bg-emerald-500/20 border-emerald-500/80' : ''}
      `}
    >
      {copiedButton === buttonType ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
      {label}
    </button>
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      <Glow />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
          <Container className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <a href="/" className="relative flex items-center gap-2 group">
                <img 
                  src="/favicon.ico" 
                  alt="WebToMCP Logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 transition-transform group-hover:scale-105" 
                />
                <span className="font-bold text-lg sm:text-xl leading-none"><GradientText>WebToMCP</GradientText></span>
              </a>
            </div>
            
            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Pro Badge for Paid Users */}
              {isPaidUser && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-full">
                  <Crown className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 text-xs font-semibold">PRO</span>
                </div>
              )}
              
              {/* User Dropdown for Paid Users */}
              {isPaidUser ? (
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-3 p-2 border border-zinc-800 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.profile_picture} />
                      <AvatarFallback className="text-sm bg-zinc-800 text-zinc-300">{user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-zinc-100 font-medium">{user?.full_name}</p>
                      <p className="text-xs text-zinc-400">{user?.email}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Simple logout button for free users */
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </Button>
              )}
            </div>
          </Container>
        </header>

        {/* Main Content */}
        <Container className="py-16 md:py-24">
          <FadeIn>
            <div className="mx-auto mb-16 max-w-3xl text-center">
              <Tag>
                <Terminal className="h-4 w-4 text-emerald-400 mr-2" />
                Dashboard
              </Tag>
              <h1 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
                  {user?.full_name?.split(' ')[0] || 'Developer'}
                </span>
              </h1>
              <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
                Manage your captures, configure MCP connections, and streamline your development workflow.
              </p>
            </div>
          </FadeIn>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Upgrade CTA for Free Users */}
            {!isPaidUser && (
              <FadeIn>
                <Card className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1">
                  <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-yellow-500/20 border border-yellow-500 rounded-xl flex items-center justify-center group-hover:bg-yellow-500/30 group-hover:border-yellow-400 transition-all duration-300">
                        <Crown className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-100">
                          Unlock Premium Features
                        </h3>
                        <p className="text-zinc-400">
                          Get unlimited captures for your development workflow
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => window.location.href = '/upgrade'}
                      className="bg-yellow-500 hover:bg-yellow-400 text-zinc-900 font-semibold"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Now
                    </Button>
                  </div>
                  </CardContent>
                </Card>
              </FadeIn>
            )}

            {/* Extension Link Section */}
            <FadeIn delay={0.1}>
              <Card className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1">
                <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 group-hover:border-emerald-400 transition-all duration-300 shrink-0">
                      <Download className="w-6 h-6 text-emerald-400 shrink-0" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">
                        Web to MCP Browser Extension
                      </h3>
                      <p className="text-zinc-400">
                        Capture any website component and send it directly to your AI coding assistant
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      trackLinkClick('extension_chrome_store', 'https://chrome.google.com/webstore');
                      window.open("https://chrome.google.com/webstore", "_blank");
                    }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Add to Chrome
                  </Button>
                </div>
                </CardContent>
              </Card>
            </FadeIn>

            {/* MCP Configuration Section */}
            <FadeIn delay={0.2}>
              <Card className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-zinc-100">
                    <Code className="w-5 h-5 text-sky-400" />
                    MCP Configuration
                  </CardTitle>
                  <CardDescription className="text-zinc-400">
                    Copy these configurations to connect your AI tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <CopyButton
                      text={getMcpUrl()}
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
                </CardContent>
              </Card>
            </FadeIn>

            {/* Recent Captures */}
            <FadeIn delay={0.3}>
              <Card className="border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 hover:border-zinc-700/70 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-zinc-100">
                  <Terminal className="w-5 h-5 text-fuchsia-400" />
                  Recent Captures
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Captures are retained for 1 week only
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingCaptures ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center space-y-2">
                      <Terminal className="w-8 h-8 text-emerald-400 animate-pulse mx-auto" />
                      <p className="text-sm text-zinc-400">
                        Loading captures...
                      </p>
                    </div>
                  </div>
                ) : captures.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-zinc-400">No captures found</p>
                    <p className="text-sm text-zinc-500 mt-2">
                      Start capturing components using the browser extension
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {captures.map((capture) => (
                       <div 
                         key={capture.slug}
                         className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-800 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors gap-3"
                       >
                         <div className="flex-1 min-w-0">
                           <h4 className="text-zinc-100 font-medium">
                             Capture {capture.slug.slice(0, 8)}...
                           </h4>
                           <p className="text-sm text-zinc-400 break-all">
                             <a 
                               href={capture.website_url} 
                               target="_blank" 
                               rel="noopener noreferrer"
                               className="text-emerald-400 hover:text-emerald-300 underline hover:no-underline transition-colors"
                             >
                               {capture.website_url}
                             </a>
                           </p>
                           <p className="text-xs text-zinc-500">
                             {formatDate(capture.created_at)} • {capture.token_count.toLocaleString()} tokens
                           </p>
                         </div>
                         <div className="flex items-center gap-2 flex-shrink-0">
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => copyToClipboard(capture.slug, `ref-${capture.slug}`)}
                             className="text-xs border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                           >
                             {copiedButton === `ref-${capture.slug}` ? (
                               <>
                                 <Check className="w-3 h-3 mr-1" />
                                 Copied
                               </>
                             ) : (
                               <>
                                 <Copy className="w-3 h-3 mr-1" />
                                 ID
                               </>
                             )}
                           </Button>
                           <Button 
                             variant="outline" 
                             size="sm"
                             onClick={() => copyToClipboard(getPromptText(capture.slug), `prompt-${capture.slug}`)}
                             className="text-xs border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                           >
                             {copiedButton === `prompt-${capture.slug}` ? (
                               <>
                                 <Check className="w-3 h-3 mr-1" />
                                 Copied
                               </>
                             ) : (
                                 <>
                                   <Copy className="w-3 h-3 mr-1" />
                                   Prompt
                               </>
                             )}
                           </Button>
                         </div>
                       </div>
                     ))}
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <span className="text-xs sm:text-sm text-zinc-400 px-2 sm:px-3">
                          Page {currentPage} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              </Card>
            </FadeIn>
          </div>
        </Container>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // If not loading and not authenticated, redirect to home
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state only when actively checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
        <Glow />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <FadeIn>
            <div className="text-center space-y-4">
              <Terminal className="w-12 h-12 text-emerald-400 animate-pulse mx-auto" />
              <p className="text-zinc-400">
                Loading dashboard...
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message (will redirect via useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
        <Glow />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <FadeIn>
            <div className="text-center space-y-4">
              <Terminal className="w-12 h-12 text-emerald-400 animate-pulse mx-auto" />
              <p className="text-zinc-400">
                Redirecting to home...
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
} 