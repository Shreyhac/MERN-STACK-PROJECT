import React from "react";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { Step } from "./Step";

export const HowItWorks: React.FC = () => (
  <section id="how" className="relative border-b border-zinc-900/60">
    <Container className="py-16 md:py-24">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <Tag>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
          How it works
        </Tag>
        <h2 className="mt-3 text-3xl md:text-4xl font-semibold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
          From{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            inspiration
          </span>
          {" "}to{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            implementation
          </span>
          {" "}in{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            30 seconds
          </span>
          .
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Step index={1} title="Authenticate with Google" iconType="google-auth">Sign in and you're set.</Step>
        <Step index={2} title="Install the Chrome extension" iconType="chrome-extension">Add it from the Web Store.</Step>
        <Step index={3} title="Navigate to any website" iconType="website-nav">Open the page with the component you want.</Step>
        <Step index={4} title="Click the extension icon" iconType="extension-click">Activate component selection mode.</Step>
        <Step index={5} title="Select the component" iconType="component-select">We capture it exactly as rendered.</Step>
        <Step index={6} title="Send to your AI assistant" iconType="send-to-ai">Delivered via MCP to Cursor or Claude Code.</Step>
      </div>
    </Container>
  </section>
);
