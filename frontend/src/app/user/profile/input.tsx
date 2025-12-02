import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full px-4 py-2 rounded-lg border border-fuchsia-400 bg-white text-gray-800",
        "focus:outline-none focus:ring-2 focus:ring-fuchsia-400 shadow-sm",
        "placeholder:text-gray-400 transition-colors duration-150",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
