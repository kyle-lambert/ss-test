import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Tenant } from "@prisma/client";
import { cn } from "@/lib/utils/cn";
import { getInitial } from "@/lib/utils/helpers";

interface TenantSwitcherProps {
  tenants: Tenant[];
}

export default function TenantSwitcher({ tenants }: TenantSwitcherProps) {
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const params = useParams<Record<"tenant", string>>();
  const navigate = useNavigate();

  const currentTenant =
    React.useMemo(() => {
      return tenants.find((tenant) => tenant.id === params.tenant);
    }, [tenants, params.tenant]) || tenants[0];

  const [selectedTenant, setSelectedTenant] = React.useState(currentTenant);

  React.useEffect(() => {
    setSelectedTenant(currentTenant);
  }, [currentTenant]);

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
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Subscription plan</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">
                    <span className="font-medium">Free</span> -{" "}
                    <span className="text-muted-foreground">
                      Trial for two weeks
                    </span>
                  </SelectItem>
                  <SelectItem value="pro">
                    <span className="font-medium">Pro</span> -{" "}
                    <span className="text-muted-foreground">
                      $9/month per user
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewTeamDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
