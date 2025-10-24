import React from "react";
import { Container, GradientText } from "./UtilityComponents";

export const Footer: React.FC = () => (
  <footer className="border-t border-zinc-900/60">
    <Container className="py-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <img 
            src="/favicon.ico" 
            alt="WebToMCP Logo" 
            className="w-6 h-6 transition-transform hover:scale-105" 
          />
          <span className="font-bold"><GradientText>WebToMCP</GradientText></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-zinc-300 transition-colors duration-200 cursor-pointer">Privacy</a>
          <a href="/terms" className="hover:text-zinc-300 transition-colors duration-200 cursor-pointer">Terms</a>
          <a href="/refund" className="hover:text-zinc-300 transition-colors duration-200 cursor-pointer">Refund</a>
          <a href="mailto:team@web-to-mcp.com" className="hover:text-zinc-300 transition-colors duration-200 cursor-pointer">Support</a>
        </div>
        <div>© {new Date().getFullYear()} WebToMCP</div>
      </div>
    </Container>
  </footer>
);
