import React from 'react';
import { cn } from '../../utils/cn';

export const Button = ({ className, variant = 'primary', size = 'md', children, isLoading, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none ring-offset-background cursor-pointer";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 py-2 px-4",
    lg: "h-11 px-8 rounded-md text-lg",
    icon: "h-10 w-10",
  };

  return (
    <button className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <span className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" /> : null}
      {children}
    </button>
  );
};
