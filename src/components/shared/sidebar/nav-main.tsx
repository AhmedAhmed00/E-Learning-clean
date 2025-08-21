import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {  type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";


export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <Link to={item.url}>
                  <SidebarMenuButton
                    className={`text-[16px] cursor-pointer transition-all duration-200 ease-in-out transform
                      ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white scale-[1.05]"
                          : "hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:scale-[1.05]"
                      }`}
                    tooltip={item.title}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
