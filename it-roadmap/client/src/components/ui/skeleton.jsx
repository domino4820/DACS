import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-cyberpunk-darker to-cyberpunk-dark border border-purple-800/20",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
