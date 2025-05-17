"use client";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { MenuItem } from ".";

export default function NavItem(item: MenuItem) {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();

  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const path = "dafsd";

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton
        asChild
        isActive={path === item.path}
        tooltip={item.title}
        className="text-gray-700 hover:text-chef-600 hover:bg-gray-50"
      >
        <Link
          href={item.path}
          className="flex items-center gap-2 w-full"
          onClick={handleMenuItemClick}
        >
          <item.icon
          className={path === item.path ? "text-chef-600" : "text-gray-500"}
          />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
