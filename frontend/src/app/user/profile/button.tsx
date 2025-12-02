import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-semibold py-2 px-4",
        "rounded-lg w-full transition-colors shadow-md",
        "focus:outline-none focus:ring-2 focus:ring-fuchsia-500",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button };

