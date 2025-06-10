import React from "react";
import { cn } from "../../lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-md transition-all duration-200 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-primary text-gray-900",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6 text-gray-900", className)}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight font-heading text-gray-900",
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-gray-600", className)}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("p-6 pt-0 text-gray-800", className)}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0 text-gray-800", className)}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
