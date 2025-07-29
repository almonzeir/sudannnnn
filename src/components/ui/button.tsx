import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-glow hover:scale-105 transition-all duration-300",
        medical: "bg-gradient-medical text-foreground hover:shadow-medical hover:scale-105 transition-all duration-300",
        outline: "border-2 border-primary/30 bg-card/50 backdrop-blur-sm text-foreground hover:border-primary hover:bg-primary/10 hover:shadow-glow transition-all duration-300",
        ghost: "text-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg transition-all duration-300",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300",
        hero: "bg-gradient-medical text-foreground border border-primary/20 hover:border-primary/60 hover:shadow-medical hover:scale-105 backdrop-blur-sm transition-all duration-500",
        success: "bg-success text-foreground hover:shadow-lg hover:scale-105 transition-all duration-300",
        warning: "bg-warning text-foreground hover:shadow-lg hover:scale-105 transition-all duration-300",
        info: "bg-info text-foreground hover:shadow-lg hover:scale-105 transition-all duration-300",
        glow: "bg-primary text-primary-foreground shadow-glow hover:shadow-xl hover:scale-105 animate-glow-pulse",
        floating: "bg-card/80 backdrop-blur-md border border-primary/20 text-foreground hover:bg-primary/10 hover:border-primary/60 hover:shadow-medical hover:scale-105 transition-all duration-300",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-14 rounded-xl px-10 text-lg font-bold",
        xl: "h-16 rounded-xl px-12 text-xl font-bold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
