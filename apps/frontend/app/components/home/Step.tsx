import React from "react";
import {
  GoogleAuthIcon,
  ChromeExtensionIcon,
  WebsiteNavigationIcon,
  ExtensionClickIcon,
  ComponentSelectionIcon,
  SendToAIIcon
} from "./StepIcons";

interface StepProps {
  index: number;
  title: string;
  children: React.ReactNode;
  iconType?: 'google-auth' | 'chrome-extension' | 'website-nav' | 'extension-click' | 'component-select' | 'send-to-ai';
}

export const Step: React.FC<StepProps> = ({ index, title, children, iconType }) => {
  const getIcon = () => {
    switch (iconType) {
      case 'google-auth': return <GoogleAuthIcon />;
      case 'chrome-extension': return <ChromeExtensionIcon />;
      case 'website-nav': return <WebsiteNavigationIcon />;
      case 'extension-click': return <ExtensionClickIcon />;
      case 'component-select': return <ComponentSelectionIcon />;
      case 'send-to-ai': return <SendToAIIcon />;
      default: return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-200 font-medium">
          {index}
        </div>
      );
    }
  };

  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/70 transition">
      <div className="mb-4 flex items-center gap-3">
        {getIcon()}
        <h4 className="text-zinc-100 font-medium">{title}</h4>
      </div>
      <p className="text-zinc-400 text-sm leading-6">{children}</p>
    </div>
  );
};
