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
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-[800px] mx-10 space-y-6 pt-10">{children}</div>
      </div>
    </SidebarProvider>
  );
}