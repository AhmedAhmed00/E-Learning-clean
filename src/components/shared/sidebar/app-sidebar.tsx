import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

// ✅ Import lucide-react icons
import {
  LayoutDashboard, // لوحة التحكم
  BookOpen, // الكورسات
  Users, // المدرسين
  ShoppingCart, // الطلبات
  GraduationCap, // الطلاب
  Briefcase, // الموظفين
  Settings, // الإعدادات

  // Secondary
  LifeBuoy, // Get Help
  Search,
  Tv,
  Tv2,
  VideoIcon, // Search
} from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "لوحة التحكم",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "الكورسات",
      url: "/courses",
      icon: BookOpen,
    },
    {
      title: "المدرسين",
      url: "/teachers",
      icon: Users,
    },
    {
      title: "الطلبات",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "الطلاب",
      url: "/students",
      icon: GraduationCap,
    },

    {
      title: "الإعلانات",
      url: "/ads",
      icon: Tv2,
    },
    {
      title: "الموظفين",
      url: "/employees",
      icon: Briefcase,
    },
    {
      title: "الإعدادات",
      url: "/settings",
      icon: Settings,
    },
  ],

  navSecondary: [
    
  
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      dir="rtl"
      className="right-0  left-auto border-l border-sidebar-border  "
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader className="bg-gradient-to-b from-slate-800 to-slate-900 dark:from-gray-800 dark:to-gray-900 shadow-xl transition-colors duration-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Logo />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* ✅ Main Navigation with icons */}
        <NavMain items={data.navMain} />

        {/* ✅ Secondary Navigation with icons */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {/* If you have NavUser: <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  );
}

function Logo() {
  return (
    <div className="flex items-center  flex-shrink-0 px-6 py-6 border-b border-slate-700 dark:border-gray-700">
      <div className="flex items-center gap-3 space-x-reverse">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div>
          <span className="text-xl font-bold text-white">منصة التعلم</span>
          <div className="text-xs text-slate-300 dark:text-gray-400">
            نظام الإدارة
          </div>
        </div>
      </div>
    </div>
  );
}



