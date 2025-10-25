import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface LoginButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function LoginButton({ onClick, disabled = false }: LoginButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold border-0 shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 hover:scale-105 rounded-md"
    >
      <LogIn className="w-4 h-4 mr-2" />
      <span className="text-sm">Log In</span>
    </Button>
  );
} 