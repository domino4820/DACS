import React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-none font-medium transition-colors",
          "focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[hsl(var(--primary))]",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90 border border-black/20":
              variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-black/20":
              variant === "destructive",
            "border-2 border-[hsl(var(--border))] bg-transparent hover:bg-accent hover:text-accent-foreground":
              variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-black/20":
              variant === "secondary",
            "underline-offset-4 hover:underline text-primary":
              variant === "link",
            "h-10 px-4 py-2": size === "default", // Default size keeps its rounded-none via base
            "h-9 rounded-none px-3": size === "sm",
            "h-11 rounded-none px-8": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
