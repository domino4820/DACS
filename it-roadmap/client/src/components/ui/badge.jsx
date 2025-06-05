import React from "react";
import { cn } from "../../lib/utils";

const Badge = React.forwardRef(
  ({ className, variant = "default", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors", // Changed rounded-full to rounded-sm
          {
            "bg-primary text-primary-foreground hover:bg-primary/80":
              variant === "default",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80":
              variant === "secondary",
            "bg-destructive text-destructive-foreground hover:bg-destructive/80":
              variant === "destructive",
            "text-muted-foreground border-[hsl(var(--border))] bg-transparent hover:bg-muted/80": // Updated outline variant
              variant === "outline",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
