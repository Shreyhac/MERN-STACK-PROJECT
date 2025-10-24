import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "./UtilityComponents";
import { Button } from "./UIComponents";

export const CTA: React.FC = () => (
  <section className="relative">
    <Container className="py-16 md:py-24 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400">
        <Sparkles className="h-4 w-4 text-emerald-400"/> Stop explaining UI. Send it.
      </div>
      <h3 className="mt-4 text-3xl md:text-4xl font-semibold text-zinc-100">
        Bridge{" "}
        <span className="text-emerald-400">
          design
        </span>
        {" "}and{" "}
        <span className="text-emerald-400">
          code
        </span>
        {" "}in{" "}
        <span className="text-emerald-400">
          one click
        </span>
        .
      </h3>
      <p className="mt-3 text-zinc-400">Add the extension and start coding with perfect visual context.</p>
      <div className="mt-6 flex justify-center">
        <Button 
          className="h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold"
          onClick={() => window.open("/extension-download", "_blank")}
        >
          Install Web to MCP <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </Container>
  </section>
);
