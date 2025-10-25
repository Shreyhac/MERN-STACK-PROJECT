import React from "react";
import { motion } from "framer-motion";

// Animated Step Icons with consistent design language
export const GoogleAuthIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M15 12H9M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M9 12L11 14L15 10"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.svg>
    </div>
  </div>
);

export const ChromeExtensionIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M7 10L12 12L17 10"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <circle
          cx="12"
          cy="12"
          r="2"
          fill="rgb(16 185 129)"
        />
      </motion.svg>
    </div>
  </div>
);

export const WebsiteNavigationIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 3H5C3.89543 3 3 3.89543 3 5V8"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M3 12C3 12 5 10 8 10C11 10 13 12 16 12C19 12 21 10 21 10"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.circle
          cx="12"
          cy="12"
          r="3"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          fill="none"
          animate={{ r: [2, 4, 2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  </div>
);

export const ExtensionClickIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M13 13L17 17"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="17"
          cy="17"
          r="2"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          fill="none"
          animate={{ 
            scale: [0, 1.2, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.svg>
    </div>
  </div>
);

export const ComponentSelectionIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M9 11L12 14L22 4"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3.89543 5 3 4.10457 3 3H11"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        <motion.rect
          x="7"
          y="9"
          width="10"
          height="6"
          rx="1"
          stroke="rgb(16 185 129)"
          strokeWidth="1.5"
          fill="none"
          animate={{ 
            scale: [0.8, 1.1, 0.8],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </motion.svg>
    </div>
  </div>
);

export const SendToAIIcon: React.FC = () => (
  <div className="relative w-10 h-10">
    <motion.div
      className="absolute inset-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm"
      animate={{ 
        scale: [1, 1.05, 1],
        borderColor: ["rgb(63 63 70 / 0.5)", "rgb(16 185 129 / 0.3)", "rgb(63 63 70 / 0.5)"]
      }}
      transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ x: [0, 3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M22 2L11 13"
          stroke="rgb(161 161 170)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.path
          d="M22 2L15 22L11 13L2 9L22 2Z"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.circle
          cx="16"
          cy="8"
          r="2"
          fill="rgb(16 185 129)"
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.path
          d="M18 10L20 12"
          stroke="rgb(16 185 129)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ 
            pathLength: [0, 1],
            opacity: [0, 1]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </motion.svg>
    </div>
  </div>
);
