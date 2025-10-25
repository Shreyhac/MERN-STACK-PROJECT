import React from "react";

// Simple Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = "", 
  variant = "default", 
  size = "default", 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-pointer";
  
  const variants = {
    default: "bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-semibold",
    outline: "border border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800",
    ghost: "text-zinc-200 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3",
    lg: "h-11 px-8"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// Simple Card components
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-zinc-800 bg-zinc-900/40 ${className}`}>
    {children}
  </div>
);

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = "" }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = "" }) => (
  <p className={`text-sm text-zinc-400 ${className}`}>
    {children}
  </p>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = "" }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = "" }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
 );

// Simple Badge component
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = "" }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

// Functional Accordion components
interface AccordionProps {
  children: React.ReactNode;
  type?: "single";
  collapsible?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, type = "single", collapsible = false, className = "" }) => {
  const [openItem, setOpenItem] = React.useState<string | null>(null);

  const handleToggle = (value: string) => {
    if (openItem === value) {
      setOpenItem(null);
    } else {
      setOpenItem(value);
    }
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.props && typeof child.props === 'object' && 'value' in child.props) {
          return React.cloneElement(child as React.ReactElement<any>, { 
            isOpen: openItem === (child.props as any).value,
            onToggle: () => handleToggle((child.props as any).value)
          });
        }
        return child;
      })}
    </div>
  );
};

interface AccordionItemProps {
  children: React.ReactNode;
  value?: string;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ children, value, className = "", isOpen = false, onToggle }) => (
  <div className={`border-b border-zinc-800/60 last:border-b-0 ${className}`}>
    {React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { isOpen, onToggle });
      }
      return child;
    })}
  </div>
);

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, className = "", isOpen = false, onToggle, ...props }) => (
  <button
    className={`flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline cursor-pointer ${className}`}
    onClick={onToggle}
    {...props}
  >
    {children}
    <svg
      className={`h-5 w-5 shrink-0 transition-transform duration-200 text-zinc-400 ${isOpen ? 'rotate-90' : ''}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9,6 15,12 9,18"></polyline>
    </svg>
  </button>
);

interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;
  isOpen?: boolean;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children, className = "", isOpen = false }) => (
  <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96' : 'max-h-0'} ${className}`}>
    <div className="pb-6 pt-0 text-zinc-300 leading-relaxed text-sm">
      {children}
    </div>
  </div>
);
