"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  BarChart2,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  Store,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";
import ChefOnboardingAlert from "./chef-onboarding-alert";
import NavItem from "./nav-item";

export type MenuItem = {
  title: string;
  path: string;
  icon: React.FC<{ className?: string }>;
};

export default function ChefSidebar() {
  const basePath = "/chef-console";
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: `${basePath}`,
      icon: BarChart2,
    },
    {
      title: "My Menu",
      path: `${basePath}/menu`,
      icon: FileText,
    },
    {
      title: "My Recipes",
      path: `${basePath}/recipes`,
      icon: BookOpen,
    },
    {
      title: "My Availability",
      path: `${basePath}/availability`,
      icon: Calendar,
    },
    {
      title: "My Profile",
      path: `${basePath}/profile`,
      icon: User,
    },
    {
      title: "Q&A",
      path: `${basePath}/qa`,
      icon: HelpCircle,
    },
    {
      title: "Customer Order Page",
      path: `/chefs/asflsadfkkasdf`,
      icon: Store,
    },
    {
      title: "Settings",
      path: `${basePath}/settings`,
      icon: Settings,
    },
  ];

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/auth/chef-login");
    },
  });

  return (
    <Sidebar className="border-r border-gray-200 bg-white text-gray-800 h-screen flex flex-col">
      <SidebarHeader>
        <div className="flex items-center justify-between w-full pl-4 pt-4">
          <img src="/feast-logo-red.png" alt="Feast Logo" className="h-8" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white flex flex-col flex-grow justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems.map(NavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="px-4 mt-2">
          <ChefOnboardingAlert />
        </div>

        <div className="px-4 py-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
            onClick={() => {
              logout.mutate();
            }}
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
