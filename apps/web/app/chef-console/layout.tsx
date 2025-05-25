import ChefSidebar from "@/components/chef-console/chef-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ChefConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chefUser = await getChefUser();

  return (
    <SidebarProvider className="flex">
      <ChefSidebar isAdmin={chefUser.isAdmin} />
      <div className="flex-1 flex justify-center">
        <div className="w-full mx-10 space-y-6 py-10 flex justify-center">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

/**
 * Fetch chef user to determine if they are admin on server side
 * Avoid react query so we can make server side fetch instead of client side fetch
 * This is safe since admin is stable and unlikely to change
 */
async function getChefUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id");

  if (!sessionId) {
    redirect("/auth/chef-login");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trpc/chefUser.getChefUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_id=${sessionId.value}`,
    },
  });

  if (!response.ok) {
    redirect("/auth/chef-login");
  }

  const data = await response.json();
  return data.result.data.chefUser;
}