import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4",
        "rounded-lg w-full transition-colors shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-red-600",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };