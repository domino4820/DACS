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
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all duration-200 ease-out hover:-translate-y-px", // Changed rounded-none to rounded-md
          "focus-visible:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[hsl(var(--primary))]",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground hover:bg-primary/90": // Removed border
              variant === "default",
            "bg-destructive text-destructive-foreground hover:bg-destructive/90": // Removed border
              variant === "destructive",
            "border border-primary bg-transparent text-primary hover:bg-primary/10": // Updated outline variant
              variant === "outline",
            "bg-secondary text-secondary-foreground hover:bg-secondary/90": // Removed border
              variant === "secondary",
            "underline-offset-4 hover:underline text-primary":
              variant === "link",
            "h-10 px-4 py-2": size === "default", // Default size now uses rounded-md from base
            "h-9 rounded-md px-3": size === "sm", // Changed rounded-none to rounded-md
            "h-11 rounded-md px-8": size === "lg", // Changed rounded-none to rounded-md
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
