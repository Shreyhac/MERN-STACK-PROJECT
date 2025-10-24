import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Container, FadeIn, Tag } from "./UtilityComponents";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge } from "./UIComponents";
import { Button } from "./UIComponents";
import { useAuth } from "~/lib/auth";

export const Pricing: React.FC = () => {
  const { login } = useAuth();
  const [isAnnual, setIsAnnual] = useState<boolean>(true);

  return (
    <section id="pricing" className="relative border-b border-zinc-900/60">
      <Container className="py-16 md:py-24">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Tag>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-emerald-400 mr-2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            Pricing
          </Tag>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-zinc-100">
            Start saving{" "}
            <span className="text-emerald-400">
              hours
            </span>
            {" "}every day.
          </h2>
          <p className="mt-3 text-zinc-400">Simple pricing that grows with you.</p>
        </div>

        <div className="mx-auto max-w-md">
          {/* Pricing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-zinc-100' : 'text-zinc-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-200 cursor-pointer ${
                isAnnual ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-zinc-100' : 'text-zinc-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                50% OFF
              </Badge>
            )}
          </div>

          {/* Single Pricing Card */}
          <Card className="relative border-zinc-800 bg-zinc-900/40 ring-1 ring-emerald-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-zinc-100">Pro</CardTitle>
              <div className="mt-4">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-zinc-50">
                    {isAnnual ? '$2.5' : '$5'}
                  </span>
                  <span className="text-zinc-400 text-lg">
                    per month
                  </span>
                </div>
                {isAnnual && (
                  <p className="text-sm text-zinc-500 mt-1">
                    billed yearly ($30)
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-zinc-300 text-sm">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  Unlimited component captures
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  Direct MCP integration
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  All AI assistants support
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  Priority support
                </li>
                {isAnnual && (
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                    50% savings
                  </li>
                )}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900"
                onClick={() => login()}
              >
                Get Started for free
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Container>
    </section>
  );
};
