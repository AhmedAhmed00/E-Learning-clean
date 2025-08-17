import React from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "../ui/sidebar";
import { AppSidebar } from "../shared/sidebar/app-sidebar";
import { SiteHeader } from "./Header";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 54)",
          "--header-height": "calc(var(--spacing) * 18)",
        } as React.CSSProperties
      }
      className="flex min-h-screen"
    >
   
      <AppSidebar variant="sidebar" />

    
      <SidebarInset className=" flex-1 flex flex-col">
   
        <SiteHeader />

    
        <main className="flex-1  px-20   bg-slate-50 ">
         <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
