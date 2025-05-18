import ChefSidebar from "@/components/chef-console/chef-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ChefConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex">
      <ChefSidebar />
      <div className="flex justify-center w-full">
        {children}
      </div>
    </SidebarProvider>
  );
}
