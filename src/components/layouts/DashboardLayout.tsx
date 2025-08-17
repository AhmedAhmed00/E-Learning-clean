import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "../ui/sidebar";
import { AppSidebar } from "../shared/app-sidebar";
import { SiteHeader } from "./Header";

export default function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 62)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="flex min-h-screen"
    >
   
      <AppSidebar variant="sidebar" />

    
      <SidebarInset className="order-1 flex-1 flex flex-col">
   
        <SiteHeader />

    
        <main className="flex-1 p-4 bg-gray-100">
          <div className="w-full bg-red-500 p-4 rounded-lg text-white">
            تجربة
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
