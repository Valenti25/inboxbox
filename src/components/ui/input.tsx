import * as React from "react";

import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

type InputProps = React.ComponentProps<"input"> & {
  clearAble?: boolean;
};
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, clearAble, value, onChange, ...props }, ref) => {
    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent the button click from focusing the input if it's not desired
      e.preventDefault();

      if (onChange) {
        // Create a synthetic event that mimics a real change event
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: "",
            name: props.name || "",
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          value={value}
          onChange={onChange}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-muted dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            clearAble ? "pr-10" : "", // Add padding for the clear button
            className,
          )}
          {...props}
        />
        {clearAble && value && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer flex items-center justify-center bg-zinc-400 transition-colors hover:bg-zinc-600 dark:hover:bg-zinc-200 text-white rounded-full p-0.5"
              aria-label="Clear input"
            >
              <XIcon size={12} />
            </button>
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
