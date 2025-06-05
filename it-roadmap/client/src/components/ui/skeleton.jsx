import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-muted", // Updated classes
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
