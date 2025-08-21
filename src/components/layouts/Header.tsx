import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

export function SiteHeader() {
  return (
    <header className="flex h-[var(--header-height)] shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[var(--header-height)]">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

        {/* ✅ Sidebar trigger visible on mobile only */}
        <SidebarTrigger className="-ml-1 block lg:hidden" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        {/* ✅ Search input aligned to the right */}
        <div className="ml-auto w-full max-w-sm">
          <Input type="search" placeholder="ابحث هنا..." className="w-full" />
        </div>
      </div>
    </header>
  );
}
