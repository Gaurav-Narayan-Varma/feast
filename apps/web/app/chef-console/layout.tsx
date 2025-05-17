import ChefSidebar from "@/components/chef-console/chef-sidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";

export default function ChefConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex">
        <ChefSidebar />
        {children}
    </SidebarProvider>
  );
}
