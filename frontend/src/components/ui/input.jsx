import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, icon: Icon, variant = "default", ...props }, ref) => {
  return (
    <div className="relative">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Icon className="h-4 w-4" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-xl border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          variant === "default" && "border-input bg-background/50 backdrop-blur-sm hover:bg-background/70 focus-visible:bg-background focus-visible:border-primary",
          variant === "glass" && "border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/50 hover:bg-white/20 focus-visible:bg-white/30 focus-visible:border-white/40",
          Icon && "pl-10",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
Input.displayName = "Input"

export { Input }
