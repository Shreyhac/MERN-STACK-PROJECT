import React from "react";
import { motion } from "framer-motion";
import { SimpleHeader } from "~/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased relative overflow-hidden">
      {/* Floating cloud elements matching home page theme */}
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
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-8xl font-bold text-zinc-100 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-zinc-300 mb-4">
              Page Not Found
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <a
              href="/"
              className="inline-block bg-zinc-800 hover:bg-zinc-700 text-zinc-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200 border border-zinc-700 hover:border-zinc-600"
            >
              Go Home
            </a>
            <div className="text-zinc-500 text-sm">
              Or use the navigation menu above to find what you're looking for.
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 