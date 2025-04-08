"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SectionCards } from "@/components/section-cards";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col items-center justify-center py-16">
          {/* Hero section */}
          <div className="text-center mb-10">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-zinc-800 text-transparent bg-clip-text drop-shadow-md">
              LeetDoc
            </h1>
            <p className="text-muted-foreground text-base md:text-lg mt-4 max-w-lg mx-auto">
              Your personal LeetCode companion. Track progress, get insights,
              and level up.
            </p>
          </div>

          {/* Cards */}
          <div className="w-full max-w-screen-xl px-4">
            <SectionCards />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
