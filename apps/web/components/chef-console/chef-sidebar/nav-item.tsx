"use client";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import cx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from ".";

export default function NavItem(item: MenuItem) {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const isActive = pathname === item.path;

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
        className="text-gray-700 hover:text-chef-600 hover:bg-gray-100"
      >
        <Link
          key={item.path}
          href={item.path}
          className={cx(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-ds-chef-700",
            isActive &&
              "bg-ds-chef-100 !hover:bg-ds-chef-100 !text-gray-700 font-medium"
          )}
          onClick={handleMenuItemClick}
        >
          <item.icon className="h-4 w-4" />
          <span className="text-sm">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
