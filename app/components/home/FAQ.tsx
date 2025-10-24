import React from "react";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./UIComponents";

export const FAQ: React.FC = () => (
  <section className="relative border-b border-zinc-900/60">
    <Container className="py-16 md:py-24">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <Tag>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <path d="M12 17h.01"/>
          </svg>
          FAQ
        </Tag>
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold text-zinc-100">
          You've got{" "}
          <span className="text-emerald-400">
            questions
          </span>
          . We've got{" "}
          <span className="text-emerald-400">
            answers
          </span>
          .
        </h2>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">What is MCP (Model Context Protocol)?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p>MCP (Model Context Protocol) is an open standard that enables AI coding assistants to connect to external tools and data sources. It allows applications like Cursor and Claude Code to access real-time information, APIs, and specialized tools during conversations.</p>
              <p>Think of MCP as a bridge that lets your AI assistant "see" and interact with external systems—like databases, APIs, or in our case, web components—providing much richer context for better responses.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How do I use Web to MCP?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>Step 1:</strong> Install our Chrome extension from the Web Store and sign in with Google.</p>
              <p><strong>Step 2:</strong> Configure MCP in your AI coding assistant (Cursor or Claude Code) using our provided configuration.</p>
              <p><strong>Step 3:</strong> Navigate to any website and click our extension icon to activate component selection mode.</p>
              <p><strong>Step 4:</strong> Select any UI component you want to recreate—we capture the DOM structure and visual styling.</p>
              <p><strong>Step 5:</strong> The component data is automatically sent to your AI assistant via MCP for perfect recreation.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">What are the benefits of using Web to MCP?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>10x faster development:</strong> No more describing components or taking screenshots—send pixel-perfect references instantly.</p>
              <p><strong>Perfect accuracy:</strong> Your AI gets the exact HTML structure, CSS styles, and visual context it needs for accurate recreation.</p>
              <p><strong>Seamless workflow:</strong> Direct integration with Cursor and Claude Code means no context switching or manual copy-pasting.</p>
              <p><strong>Universal compatibility:</strong> Works with any website, design system, or UI framework—React, Vue, Angular, or plain HTML.</p>
              <p><strong>Time savings:</strong> Turn 30 minutes of back-and-forth explanations into 30 seconds of precise handoff.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How do I add MCP support in Cursor IDE?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>General MCP Setup:</strong></p>
              <p>Cursor natively supports MCP through configuration files. You can add MCP servers by creating a configuration file that tells Cursor which external tools to connect to.</p>
              <p><strong>For Web to MCP specifically:</strong></p>
              <p>1. Open Cursor settings (Ctrl+Shift+J or Cmd+Shift+J)</p>
              <p>2. Navigate to features → Model Context Protocol</p>
              <p>3. Create a project-specific <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400">.cursor/mcp.json</code> file with our provided configuration</p>
              <p>4. Add your unique Web to MCP server URL (generated after signing in with Google)</p>
              <p>5. Restart Cursor—Web to MCP tools will now be available in your chat context!</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-5">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How do I add MCP support in Claude Code?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>General MCP Setup:</strong></p>
              <p>Claude Code supports MCP through configuration files that connect to external MCP servers, allowing Claude to access specialized tools and data sources.</p>
              <p><strong>For Web to MCP specifically:</strong></p>
              <p>1. Locate your Claude Code configuration directory</p>
              <p>2. Create or edit the MCP configuration file (usually <code className="bg-zinc-800 px-2 py-1 rounded text-emerald-400">config.json</code>)</p>
              <p>3. Add the Web to MCP server configuration with your unique server URL</p>
              <p>4. Include the required server settings and authentication details</p>
              <p>5. Restart Claude Code to enable the Web to MCP integration</p>
              <p><em>Note: Detailed setup instructions with your personalized config are provided after signing up.</em></p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-6">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Is MCP free to use?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p>Yes! MCP (Model Context Protocol) itself is completely free and open-source. It's a standard protocol developed to enhance AI assistant capabilities.</p>
              <p>However, the individual MCP servers and tools (like Web to MCP) may have their own pricing models. The cost depends on the specific service you're connecting to, not the MCP protocol itself.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-7">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Is Web to MCP free to use?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p>Web to MCP offers both free and premium tiers:</p>
              <p><strong>Free Tier:</strong> Perfect for trying out the service with limited component captures per month.</p>
              <p><strong>Premium Tier:</strong> Unlimited captures, priority support, and advanced features for professional developers.</p>
              <p>You can start with our free tier to experience the workflow enhancement, then upgrade when you're ready to supercharge your development process.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-8">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How does Web to MCP improve design-to-code workflow?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>Eliminates Design Guesswork:</strong> Instead of describing "make it look like that button," you send the exact button with all its styling context.</p>
              <p><strong>Reduces Back-and-forth:</strong> No more "make it more rounded," "different shade of blue," or "add more padding"—get it right the first time.</p>
              <p><strong>Maintains Design Consistency:</strong> Extract components from existing design systems to ensure your new code matches established patterns.</p>
              <p><strong>Speeds Up Prototyping:</strong> Quickly grab UI patterns from anywhere on the web to accelerate your design exploration.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-9">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">What makes Web to MCP better than screenshots or design handoffs?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>vs Screenshots:</strong> We capture actual DOM structure and CSS properties, not just pixels. Your AI gets semantic HTML and exact styling values.</p>
              <p><strong>vs Design Tools:</strong> No need to switch between Figma and code—capture live, interactive components directly from production websites.</p>
              <p><strong>vs Manual Description:</strong> Skip the "center-aligned blue button with rounded corners" explanations. Send the real thing with one click.</p>
              <p><strong>Full Context:</strong> Includes responsive behavior, hover states, and surrounding layout context that static designs miss.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-10">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">How does this boost developer productivity?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>Instant Reference:</strong> Turn any UI component into a coding reference in seconds, not minutes.</p>
              <p><strong>Fewer Iterations:</strong> Get accurate results on the first try instead of multiple refinement cycles.</p>
              <p><strong>Learning Acceleration:</strong> Understand how complex components are built by examining real production code.</p>
              <p><strong>Pattern Building:</strong> Build a library of proven UI patterns by capturing components from successful products.</p>
              <p><strong>Faster Onboarding:</strong> New team members can quickly understand existing component patterns and styling approaches.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-11">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Is my data secure when using Web to MCP?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p><strong>Minimal Data Collection:</strong> We only capture the DOM structure and styling of selected components—no personal data, passwords, or sensitive information.</p>
              <p><strong>Secure Authentication:</strong> Sign in securely through Google OAuth—we never see or store your credentials.</p>
              <p><strong>No Full Page Capture:</strong> We only capture the specific element you select, not entire pages or other website content.</p>
              <p><strong>Direct Transmission:</strong> Component data goes directly to your AI assistant via MCP—we don't store captured components on our servers.</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-12">
          <AccordionTrigger className="text-left text-zinc-100 hover:text-zinc-200">Will the AI reproduce the UI component exactly?</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 text-zinc-400">
              <p>While we provide pixel-perfect references, the final output depends on your AI assistant and how you prompt it:</p>
              <p><strong>What we guarantee:</strong> Accurate DOM structure, exact CSS values, proper styling context, and visual screenshots.</p>
              <p><strong>What affects results:</strong> Your AI model choice, prompt clarity, and specific framework requirements (React vs Vue vs Angular).</p>
              <p><strong>Best practices:</strong> Be specific about your tech stack, mention any design system you're using, and iterate with the AI for perfect results.</p>
              <p>Most developers see 90%+ accuracy on first generation, with perfect results after minimal refinement.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Container>
  </section>
);
