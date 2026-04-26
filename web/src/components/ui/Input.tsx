import * as React from "react";
import { cn } from "./Button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[44px] w-full rounded-lg border border-white/10 bg-obsidian_light px-3 py-2 text-sm text-primary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
