import type { Route } from "./+types/refund";
import { motion } from "framer-motion";
import { SimpleHeader } from "~/components/ui/SimpleHeader";
import { SimpleFooter } from "~/components/ui/SimpleFooter";
import { Glow } from "~/components/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Refund Policy - Web to MCP" },
    { name: "description", content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies." },
    { name: "keywords", content: "refund policy, cancellation policy, web to mcp, refunds, money back" },
    { property: "og:title", content: "Refund Policy - Web to MCP" },
    { property: "og:description", content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies." },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Web to MCP" },
    { property: "og:url", content: "https://web-to-mcp.com/refund" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Refund Policy - Web to MCP" },
    { name: "twitter:description", content: "Refund Policy for Web to MCP. Learn about our refund and cancellation policies." },
    { name: "twitter:image", content: "/og.png" },
  ];
}

export default function Refund() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      <Glow />
      
      {/* Additional floating cloud elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large floating cloud */}
        <motion.div
          className="absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-zinc-800/10 blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Medium cloud */}
        <motion.div
          className="absolute right-[20%] top-[25%] h-24 w-36 rounded-full bg-zinc-700/8 blur-lg"
          animate={{
            x: [0, -15, 0],
            y: [0, 8, 0],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
        
        {/* Small cloud */}
        <motion.div
          className="absolute left-[60%] top-[40%] h-16 w-24 rounded-full bg-zinc-600/6 blur-md"
          animate={{
            x: [0, 12, 0],
            y: [0, -5, 0],
            opacity: [0.06, 0.1, 0.06]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 8
          }}
        />
      </div>
      
      <SimpleHeader />

      {/* Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-700/30 rounded-lg p-6 sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100 mb-4">
                Refund Policy
              </h2>
              <p className="text-zinc-400">Last updated on 20/08/25</p>
            </div>

            <div className="prose prose-invert max-w-none space-y-6">
              <div className="space-y-4">
                <p className="text-zinc-300 leading-relaxed">
                  Strictly no refunds will be offered unless required by the law or at company's sole discretion, if any. In case a refund is offered, it will be processed within 15 days. Please raise all refund requests to email <span className="text-zinc-100">team@web-to-mcp.com</span>.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  Plan Cancellation
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  You may cancel your Plan any time but please note that such cancellation will only be effective at the end of the then-current Plan period. Unless required by law, you will not receive a refund of any portion of the subscription fee paid for the then-current subscription period at the time of cancellation.
                </p>
                
                <p className="text-zinc-300 leading-relaxed">
                  Cancellation can be initiated from your account dashboard. In case you need our assistance with cancellation, please raise a request to <span className="text-zinc-100">team@web-to-mcp.com</span>.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  Refund Process
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-100 font-bold text-sm">1.</span>
                    <div>
                      <p className="text-sm text-zinc-300 font-semibold">Submit Refund Request</p>
                      <p className="text-xs text-zinc-400 mt-1">Email your refund request to team@web-to-mcp.com with your account details and reason for refund</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-100 font-bold text-sm">2.</span>
                    <div>
                      <p className="text-sm text-zinc-300 font-semibold">Review Process</p>
                      <p className="text-xs text-zinc-400 mt-1">Our team will review your request and determine eligibility based on our refund policy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-zinc-100 font-bold text-sm">3.</span>
                    <div>
                      <p className="text-sm text-zinc-300 font-semibold">Processing Time</p>
                      <p className="text-xs text-zinc-400 mt-1">If approved, refunds will be processed within 15 days to your original payment method</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-semibold text-zinc-100">
                  Contact Information
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  For any questions regarding refunds or cancellations, please contact us at <span className="text-zinc-100">team@web-to-mcp.com</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimpleFooter />
    </div>
  );
} 