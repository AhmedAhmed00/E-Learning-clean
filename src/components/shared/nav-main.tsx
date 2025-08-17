
// import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {  type IconNode } from 'lucide-react'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: IconNode
  }[]
}) {
  return (
    <SidebarGroup>
       
      <SidebarGroupContent className="flex flex-col">
        
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className='text-[16px]'  tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
