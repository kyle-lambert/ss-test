import React from "react";
import { useField } from "remix-validated-form";

import { type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface ValidatedInputProps extends Omit<InputProps, "name" | "id"> {
  name: string;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ name, className, ...props }, ref) => {
    const { error, getInputProps } = useField(name);
    return (
      <>
        <input
          ref={ref}
          {...getInputProps({
            id: name,
            className: cn(
              "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            ),
            ...props,
          })}
        />
        {error ? (
          <div className="text-xs font-medium text-destructive">{error}</div>
        ) : null}
      </>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";

export { ValidatedInput };
