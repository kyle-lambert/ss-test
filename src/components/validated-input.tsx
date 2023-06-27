import React from "react";
import { useField } from "remix-validated-form";

import { Input, type InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

interface ValidatedInputProps extends Omit<InputProps, "name" | "id"> {
  name: string;
}

const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ name, className, ...props }, ref) => {
    const { error, getInputProps } = useField(name, {
      validationBehavior: {
        initial: "onChange",
        whenTouched: "onChange",
        whenSubmitted: "onChange",
      },
    });
    return (
      <>
        <Input
          ref={ref}
          {...getInputProps({
            id: name,
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
