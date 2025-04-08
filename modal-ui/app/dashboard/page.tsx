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
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-8 md:gap-6 md:py-10 items-center justify-center text-center">
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-zinc-700 text-transparent bg-clip-text">
                LeetDoc
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-md">
                Your personal LeetCode companion. Track progress, get insights,
                and level up.
              </p>
            </div>

            <SectionCards />

            {/* Spaced Repetition Placeholder */}
            <div className="mt-8 text-center">
              <p className="text-lg md:text-xl font-medium text-gray-800">
                🧠 Based on your spaced repetition schedule, you should revisit{" "}
                <span className="font-semibold underline decoration-dotted">
                  "Valid Sudoku"
                </span>{" "}
                today.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Strengthen your long-term memory by solving it again.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
