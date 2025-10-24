import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Container, GradientText } from "./UtilityComponents";
import { Button } from "./UIComponents";
import { useAuth } from "~/lib/auth";

export const Header: React.FC = () => {
  const { login } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [userSelectedSection, setUserSelectedSection] = useState<string | null>(null);

  // Ensure component is mounted on client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Set initial path and section based on current URL
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      setCurrentPath(path);
      
      // Set initial active section without user selection override
      if (path === '/cursor') {
        setActiveSection('cursor');
      } else if (path === '/claude-code') {
        setActiveSection('claude-code');
      } else if (path === '/') {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['how', 'pricing'].includes(hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection(''); // No default highlighting
        }
      }
    }

    // Listen for page changes (back/forward navigation)
    const handlePopState = () => {
      // Clear user selection on browser navigation
      setUserSelectedSection(null);
      setTimeout(() => {
        setCurrentPath(window.location.pathname);
      }, 100);
    };

    // Listen for page visibility changes (helps with tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(() => {
          setCurrentPath(window.location.pathname);
        }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Update active section when currentPath changes (but respect user selection)
  useEffect(() => {
    const updateActiveSection = () => {
      // If user has explicitly selected a section, don't override it during navigation
      if (userSelectedSection && isNavigating) {
        return;
      }

      if (currentPath === '/cursor') {
        setActiveSection('cursor');
        setUserSelectedSection(null); // Clear user selection once we're on the right page
        setIsNavigating(false);
      } else if (currentPath === '/claude-code') {
        setActiveSection('claude-code');
        setUserSelectedSection(null); // Clear user selection once we're on the right page
        setIsNavigating(false);
      } else if (currentPath === '/') {
        const hash = window.location.hash.replace('#', '');
        if (hash && ['how', 'pricing'].includes(hash)) {
          setActiveSection(hash);
        } else {
          setActiveSection(''); // No default highlighting
        }
        setUserSelectedSection(null); // Clear user selection
        setIsNavigating(false);
      }
    };

    updateActiveSection();
  }, [currentPath, userSelectedSection, isNavigating]);

  // Safety timeout to clear user selection if navigation takes too long
  useEffect(() => {
    if (userSelectedSection && isNavigating) {
      const timeout = setTimeout(() => {
        setUserSelectedSection(null);
        setIsNavigating(false);
      }, 3000); // 3 seconds max
      
      return () => clearTimeout(timeout);
    }
  }, [userSelectedSection, isNavigating]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      setIsNavigating(true);
      setActiveSection(sectionId);
      
      const headerHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      
      setIsMobileMenuOpen(false); // Close mobile menu after navigation
      
      // Re-enable scroll detection after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 1000);
    }
  };

  // Update active section based on scroll position (only on home page)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      // Only handle scroll-based navigation on the home page when not navigating 
      // and when user hasn't explicitly selected a section
      if (currentPath !== '/' || isNavigating || userSelectedSection) return;
      
      // Throttle scroll updates to prevent jittery behavior
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Double-check conditions
        if (currentPath !== '/' || isNavigating || userSelectedSection) return;
        
        const sections = ['how', 'pricing'];
        const headerHeight = 64;
        
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = document.getElementById(sections[i]);
          if (section && window.scrollY >= section.offsetTop - headerHeight - 100) {
            // Only update if we're still on the home page and no user selection
            if (currentPath === '/' && !userSelectedSection) {
              setActiveSection(sections[i]);
            }
            break;
          }
        }
      }, 100);
    };

    // Only add scroll listener if we're on the home page
    if (currentPath === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isNavigating, currentPath, userSelectedSection]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target || !(target instanceof Element)) {
        setIsMobileMenuOpen(false);
        return;
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-toggle')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigationItems = [
    { id: 'cursor', label: 'Cursor', href: '/cursor' },
    { id: 'claude-code', label: 'Claude Code', href: '/claude-code' },
    { id: 'how', label: 'How it works', href: null }
  ];

  const handleNavigation = (item: { id: string; label: string; href: string | null }) => {
    // Lock in user's selection immediately - this prevents any automatic overrides
    setUserSelectedSection(item.id);
    setActiveSection(item.id);
    setIsNavigating(true);
    setIsMobileMenuOpen(false);
    
    if (item.href) {
      // Update path state for immediate feedback
      setCurrentPath(item.href);
      // Navigate to the page
      window.location.href = item.href!;
    } else {
      // For scroll navigation on home page
      setUserSelectedSection(null); // Clear immediately for scroll navigation
      scrollToSection(item.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 relative overflow-visible">
      {/* Subtle cloud effect in header */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-1/4 top-1/2 h-16 w-32 rounded-full bg-zinc-800/5 blur-lg"
          animate={{
            x: [0, 10, 0],
            opacity: [0.05, 0.08, 0.05]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <Container className="flex h-16 items-center justify-between relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <a href="/" className="relative flex items-center gap-1.5 sm:gap-2 group">
            <img 
              src="/favicon.ico" 
              alt="WebToMCP Logo" 
              className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform group-hover:scale-105" 
            />
            <span className="font-bold text-base sm:text-lg md:text-xl leading-none whitespace-nowrap"><GradientText>WebToMCP</GradientText></span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-zinc-300">
          {navigationItems.map((item) => (
            <a 
              key={item.id}
              href={item.href || `#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation(item);
              }}
              className={`transition-all duration-300 ease-out cursor-pointer relative ${
                activeSection === item.id && activeSection !== ''
                  ? 'text-emerald-400 font-medium' 
                  : 'hover:text-zinc-50'
              }`}
            >
              {item.label}
              {activeSection === item.id && activeSection !== '' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                  layoutId="activeSection"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </a>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            className="h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
            onClick={() => login()}
          >
            Log in
          </Button>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
            onClick={() => window.open("/extension-download", "_blank")}
          >
            Install Extension <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Tablet Buttons (visible on sm-md, hidden on xs and lg+) */}
        <div className="hidden sm:flex md:hidden items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            className="h-9 px-3 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-sm"
            onClick={() => login()}
          >
            Log in
          </Button>
          <Button 
            className="h-9 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-sm"
            onClick={() => window.open("/extension-download", "_blank")}
          >
            Install <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Mobile Buttons + Menu Toggle */}
        <div className="flex items-center gap-2 sm:hidden">
          <Button
            variant="outline"
            className="h-8 px-2.5 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-xs"
            onClick={() => login()}
          >
            Log in
          </Button>
          
          {isClient && (
            <button
              className="mobile-menu-toggle p-1.5 text-zinc-300 hover:text-zinc-50 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {/* Large screen menu toggle */}
        {isClient && (
          <button
            className="mobile-menu-toggle hidden lg:hidden md:block p-2 text-zinc-300 hover:text-zinc-50 transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}
      </Container>

      {/* Mobile Menu */}
      {isClient && isMobileMenuOpen && (
        <motion.div 
          className="mobile-menu lg:hidden fixed w-full h-[calc(100vh-64px)] top-16 bg-zinc-950 backdrop-blur-sm z-30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Container className="py-4 sm:py-6 h-full flex flex-col max-w-sm mx-auto">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-3 sm:space-y-4 mb-6 sm:mb-8 flex-1">
              {navigationItems.map((item, index) => (
                <motion.a 
                  key={item.id}
                  href={item.href || `#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item);
                  }}
                  className={`text-left text-lg sm:text-xl py-3 sm:py-4 border-b border-zinc-800/50 transition-all duration-300 ease-out cursor-pointer relative ${
                    activeSection === item.id && activeSection !== ''
                      ? 'text-emerald-400 font-medium border-emerald-400/30' 
                      : 'text-zinc-300 hover:text-zinc-50 hover:border-zinc-600'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.label}
                  {activeSection === item.id && activeSection !== '' && (
                    <motion.div 
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                      layoutId="activeSectionMobile"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>

            {/* Mobile Buttons */}
            <div className="flex flex-col space-y-3 sm:space-y-4 pb-safe">
              <Button
                variant="outline"
                className="w-full h-12 sm:h-14 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-base sm:text-lg font-medium"
                onClick={() => {
                  login();
                  setIsMobileMenuOpen(false);
                }}
              >
                Log in
              </Button>
              <Button 
                className="w-full h-12 sm:h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-base sm:text-lg"
                onClick={() => {
                  window.open("https://chrome.google.com/webstore", "_blank");
                  setIsMobileMenuOpen(false);
                }}
              >
                Add to Chrome <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </Container>
        </motion.div>
      )}
    </header>
  );
};
