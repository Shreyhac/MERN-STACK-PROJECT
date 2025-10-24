import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { Container, GradientText } from "../home/UtilityComponents";
import { Button } from "./button";
import { useAuth } from "~/lib/auth";

export const SimpleHeader: React.FC = () => {
  const { login } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure component is mounted on client to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

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

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/60 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 overflow-visible">
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

        {/* Desktop Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
            onClick={() => login()}
          >
            Log in
          </Button>
          <Button 
            className="bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
            onClick={() => window.open("https://chrome.google.com/webstore", "_blank")}
          >
            Add to Chrome <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        {isClient && (
          <button
            className="mobile-menu-toggle sm:hidden p-2 text-zinc-300 hover:text-zinc-50 transition-colors"
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

        {/* Mobile Action Button - Visible on very small screens */}
        <div className="flex sm:hidden items-center gap-2 mr-2">
          <Button 
            variant="outline"
            className="h-9 px-3 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-sm"
            onClick={() => login()}
          >
            Log in
          </Button>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isClient && isMobileMenuOpen && (
        <motion.div 
          className="mobile-menu sm:hidden fixed inset-0 top-16 bg-zinc-950/95 backdrop-blur-sm z-30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Container className="py-6 h-full flex flex-col justify-center">
            {/* Mobile Buttons */}
            <div className="flex flex-col space-y-4 max-w-sm mx-auto w-full">
              <Button
                variant="outline"
                className="w-full h-14 border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-lg font-medium"
                onClick={() => {
                  login();
                  setIsMobileMenuOpen(false);
                }}
              >
                Log in
              </Button>
              <Button 
                className="w-full h-14 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold text-lg"
                onClick={() => {
                  window.open("/extension-download", "_blank");
                  setIsMobileMenuOpen(false);
                }}
              >
                Install Extension <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </Container>
        </motion.div>
      )}
    </header>
  );
};
