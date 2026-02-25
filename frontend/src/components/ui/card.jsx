import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-lg transition-all duration-300",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// Enhanced Glass Card
const GlassCard = React.forwardRef(({ className, hover = true, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border text-card-foreground shadow-xl overflow-hidden",
      "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl",
      "border-white/20",
      hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-white/40",
      gradient && "bg-gradient-to-br from-primary/10 via-transparent to-transparent",
      className
    )}
    {...props}
  />
))
GlassCard.displayName = "GlassCard"

// Gradient Border Card
const GradientCard = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl bg-card text-card-foreground shadow-lg gradient-border p-[1px]",
      className
    )}
  >
    <div className="rounded-xl bg-card p-6" {...props} />
  </div>
))
GradientCard.displayName = "GradientCard"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, GlassCard, GradientCard }
