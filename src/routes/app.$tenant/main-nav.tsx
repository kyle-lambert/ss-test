import { cn } from "@/lib/utils/cn";
import { NavLink } from "@remix-run/react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {/* <NavLink
        to="./overview"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </NavLink> */}
      <NavLink
        to="./team"
        className={({ isActive }) => {
          return cn(
            "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          );
        }}
      >
        Team
      </NavLink>
      <NavLink
        to="./settings"
        className={({ isActive }) => {
          return cn(
            "text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
          );
        }}
      >
        Settings
      </NavLink>
    </nav>
  );
}
