import * as React from "react";
import {
  useFetcher,
  useNavigate,
  useNavigation,
  useParams,
} from "@remix-run/react";
import type { Tenant } from "@prisma/client";
import { ValidatedForm } from "remix-validated-form";
import { Check, ChevronsUpDown, Loader2, PlusCircle } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils/cn";
import { getInitial } from "@/lib/utils/helpers";
import { ValidatedInput } from "@/components/validated-input";
import { createTeamValidator } from "@/lib/utils/validation";

interface TenantSwitcherProps {
  tenants: Tenant[];
}

export default function TenantSwitcher({ tenants }: TenantSwitcherProps) {
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const params = useParams<Record<"tenant", string>>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  const fetcher = useFetcher();
  const isFetcherSubmitting = fetcher.state === "submitting";

  const currentTenant =
    React.useMemo(() => {
      return tenants.find((tenant) => tenant.id === params.tenant);
    }, [tenants, params.tenant]) || tenants[0];

  const [selectedTenant, setSelectedTenant] = React.useState(currentTenant);

  React.useEffect(() => {
    setSelectedTenant(currentTenant);
  }, [currentTenant]);

  React.useEffect(() => {
    if (navigation.location?.pathname) {
      setShowNewTeamDialog(false);
    }
  }, [navigation.location?.pathname]);

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label="Select a team"
            className={cn("w-[200px] justify-between")}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarFallback>{getInitial(selectedTenant.name)}</AvatarFallback>
            </Avatar>
            <span className="mr-2 truncate">{selectedTenant.name}</span>
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" forceMount>
          <DropdownMenuGroup>
            {tenants.map((tenant) => {
              return (
                <DropdownMenuItem
                  key={tenant.id}
                  onSelect={() => {
                    setSelectedTenant(tenant);
                    navigate(`/app/${tenant.id}`);
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-5 w-5">
                    <AvatarFallback>{getInitial(tenant.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{tenant.name}</span>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedTenant.id === tenant.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem
              onSelect={() => {
                setShowNewTeamDialog(true);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Team
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage products and customers.
          </DialogDescription>
        </DialogHeader>
        <ValidatedForm
          id="test1"
          validator={createTeamValidator}
          fetcher={fetcher}
          method="post"
          action="/resource/tenant"
          subaction="create"
        >
          <div className="space-y-4 py-2 pb-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <ValidatedInput name="name" placeholder="Osprey Backbacks" />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isFetcherSubmitting}>
              {isFetcherSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Team
            </Button>
          </DialogFooter>
        </ValidatedForm>
      </DialogContent>
    </Dialog>
  );
}
