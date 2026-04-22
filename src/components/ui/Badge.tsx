import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./Button";

const badgeVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono uppercase tracking-widest text-[10px] border",
  {
    variants: {
      variant: {
        verified: "bg-emerald-glow/10 text-emerald-glow border-emerald-glow/20",
        private: "bg-lime/10 text-lime border-lime/20",
        default: "bg-glass-white text-text-secondary border-glass-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

function Badge({ className, variant, showDot = false, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {showDot && (
        <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse-fast", {
          "bg-emerald-glow": variant === "verified",
          "bg-lime": variant === "private",
          "bg-text-secondary": variant === "default",
        })}></div>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
