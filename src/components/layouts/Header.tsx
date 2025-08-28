"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SiteHeader() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6">
        <div className="flex items-center gap-2">
          {/* ✅ Sidebar trigger visible on mobile only */}
          <SidebarTrigger className="-ml-1 block lg:hidden" />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
        </div>
        
        
        <div className="flex mx-2 gap-2"> 
           
                     <div className="flex items-center gap-6">
          {/* ✅ Profile Dialog */}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>الملف الشخصي</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className=" rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">أحمد محمد</p>
                    <p className="text-sm text-gray-500">ahmed@email.com</p>
                  </div>
                </div>

                
              </div>
            </DialogContent>
          </Dialog>
        </div>
          <Button
                  variant="outline"
                  className="flex items-center gap-2 "
                  onClick={handleLogout}
                >
                  <LogOut className="" />
                </Button>
        </div>


   
      </div>
    </header>
  );
}
