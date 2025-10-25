import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Square, Terminal, Monitor } from 'lucide-react';

interface CaptureButtonProps {
  type: 'component' | 'fullpage';
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({
  type,
  onClick,
  disabled = false,
  loading = false,
}) => {
  const isComponent = type === 'component';
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full h-14 text-sm font-medium transition-all duration-300 rounded-md ${
        isComponent
          ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold border-0 shadow-lg hover:shadow-emerald-500/25'
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 hover:border-zinc-600'
      } ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          {isComponent ? (
            <>
              <span>Capture Element</span>
            </>
          ) : (
            <>
              <Monitor className="w-4 h-4" />
              <span>Capture Viewport</span>
            </>
          )}
        </div>
      )}
    </Button>
  );
}; 