import { cn } from "@/lib/utils/cn";
import { NavLink } from "@remix-run/react";

export function TabNav() {
  return (
    <div className="w-full">
      <ul className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
        <NavLink end to="./account">
          {({ isActive }) => {
            return (
              <li
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  isActive ? "bg-background text-foreground shadow-sm" : ""
                )}
              >
                Account
              </li>
            );
          }}
        </NavLink>
        <NavLink end to="./plans">
          {({ isActive }) => {
            return (
              <li
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  isActive ? "bg-background text-foreground shadow-sm" : ""
                )}
              >
                Plans
              </li>
            );
          }}
        </NavLink>
        <NavLink end to="./socials">
          {({ isActive }) => {
            return (
              <li
                className={cn(
                  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                  isActive ? "bg-background text-foreground shadow-sm" : ""
                )}
              >
                Socials
              </li>
            );
          }}
        </NavLink>
      </ul>
    </div>
  );
}
