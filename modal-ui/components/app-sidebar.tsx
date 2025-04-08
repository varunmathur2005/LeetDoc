"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconChevronLeft,
  IconChevronRight,
  IconSettings,
  IconFileText,
  IconLayoutDashboard,
  IconHelpCircle,
  IconSearch,
} from "@tabler/icons-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", icon: IconLayoutDashboard, label: "Dashboard" },
    { href: "/submissions", icon: IconFileText, label: "Submissions" },
    { href: "#", icon: IconSettings, label: "Settings" },
    { href: "#", icon: IconHelpCircle, label: "Help" },
    { href: "#", icon: IconSearch, label: "Search" },
  ];

  return (
    <Sidebar
      {...props}
      className={`h-screen bg-white border-r text-sm text-gray-800 transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-64"
      }`}
    >
      <TooltipProvider>
        <div className="flex flex-col h-full">
          {/* Header */}
          <SidebarHeader className="flex items-center justify-between border-b px-4 py-4">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              📘 {!collapsed && <span>LeetDoc</span>}
            </div>
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              className="text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded p-1 transition"
            >
              {collapsed ? (
                <IconChevronRight size={18} />
              ) : (
                <IconChevronLeft size={18} />
              )}
            </button>
          </SidebarHeader>

          {/* Content */}
          <SidebarContent className="flex-1 flex flex-col justify-between">
            <div>
              <SidebarMenu className="py-4 space-y-2">
                {navItems.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href;

                  return (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={href}
                          className={`flex items-center gap-2 rounded px-3 py-2 ${
                            isActive
                              ? "bg-gray-100 font-semibold text-black"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2">
                                <Icon size={18} />
                                {!collapsed && <span>{label}</span>}
                              </div>
                            </TooltipTrigger>
                            {collapsed && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>

            {/* Footer */}
            <SidebarFooter className="border-t py-4 px-4">
              {!collapsed && (
                <div className="text-xs text-muted-foreground">
                  © 2025 LeetDoc
                </div>
              )}
            </SidebarFooter>
          </SidebarContent>
        </div>
      </TooltipProvider>
    </Sidebar>
  );
}
