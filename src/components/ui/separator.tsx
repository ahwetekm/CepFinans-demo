import * as React from "react"

export const Separator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`shrink-0 bg-border ${className}`}
    {...props}
  />
))
Separator.displayName = "Separator"

export const SeparatorVertical = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`shrink-0 bg-border h-px w-full ${className}`}
    {...props}
  />
))
SeparatorVertical.displayName = "SeparatorVertical"