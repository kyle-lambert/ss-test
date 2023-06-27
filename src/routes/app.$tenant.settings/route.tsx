import { Outlet } from "@remix-run/react";
import { SidebarNav } from "./sidebar-nav";
import { Separator } from "@/components/ui/separator";
import { TabNav } from "./tab-nav";

const sidebarNavItems = [
  {
    title: "Account",
    to: "./account",
  },
  {
    title: "Plans",
    to: "./plans",
  },
  {
    title: "Socials",
    to: "./socials",
  },
];

export default function () {
  return (
    <div>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8">
        <TabNav />
        <Outlet />
      </div>
    </div>
  );
}
