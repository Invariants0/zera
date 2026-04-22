import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./Button";

const badgeVariants = cva(
  "inline-flex items-center rounded-pill px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        verified: "bg-accent-green/10 text-accent-green border border-accent-green/20",
        private: "bg-secondary-500/10 text-secondary-500 border border-secondary-500/20",
        compliant: "bg-primary-500/10 text-primary-500 border border-primary-500/20",
        default: "bg-surface_alt text-text_secondary border border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
