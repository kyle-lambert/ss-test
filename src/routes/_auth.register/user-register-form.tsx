import * as React from "react";
import { useNavigation } from "@remix-run/react";
import { ValidatedForm, type Validator } from "remix-validated-form";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { ValidatedInput } from "@/components/validated-input";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils/cn";

interface UserRegisterFormProps<TDataType>
  extends React.HTMLAttributes<HTMLDivElement> {
  validator: Validator<TDataType>;
}

export function UserRegisterForm<TDataType>({
  className,
  validator,
  ...props
}: UserRegisterFormProps<TDataType>) {
  const navigation = useNavigation();
  const isActionSubmitting = navigation.state === "submitting";

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <ValidatedForm validator={validator} method="POST">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="fullName">
              Full Name
            </Label>
            <ValidatedInput
              name="fullName"
              placeholder="Full Name"
              autoCapitalize="none"
              autoComplete="fullName"
              autoCorrect="off"
              disabled={isActionSubmitting}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <ValidatedInput
              name="email"
              placeholder="Email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isActionSubmitting}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <ValidatedInput
              name="password"
              placeholder="Password"
              autoCapitalize="none"
              autoComplete="password"
              autoCorrect="off"
              disabled={isActionSubmitting}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="confirmPassword">
              Confirm Password
            </Label>
            <ValidatedInput
              name="confirmPassword"
              placeholder="Confirm Password"
              autoCapitalize="none"
              autoComplete="confirmPassword"
              autoCorrect="off"
              disabled={isActionSubmitting}
            />
          </div>
          <Button disabled={isActionSubmitting}>
            {isActionSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create
          </Button>
        </div>
      </ValidatedForm>
    </div>
  );
}
