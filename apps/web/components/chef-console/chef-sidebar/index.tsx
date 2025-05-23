"use client";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  BarChart2,
  BookOpen,
  FileText,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import ChefOnboardingAlert from "./chef-onboarding-alert";
import NavItem from "./nav-item";

export type MenuItem = {
  title: string;
  path: string;
  icon: React.FC<{ className?: string }>;
};

export default function ChefSidebar({ isAdmin }: { isAdmin: boolean }) {
  const basePath = "/chef-console";
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      path: `${basePath}/dashboard`,
      icon: BarChart2,
    },
    {
      title: "My Menus",
      path: `${basePath}/menus`,
      icon: FileText,
    },
    {
      title: "My Recipes",
      path: `${basePath}/recipes`,
      icon: BookOpen,
    },
    {
      title: "My Profile",
      path: `${basePath}/profile`,
      icon: User,
    },

    {
      title: "Settings",
      path: `${basePath}/settings`,
      icon: Settings,
    },
    {
      title: "Q&A",
      path: `${basePath}/qa`,
      icon: HelpCircle,
    },
    ...(isAdmin
      ? [
          {
            title: "Admin Panel",
            path: `${basePath}/admin-panel`,
            icon: Shield,
          },
        ]
      : []),
  ];

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.push("/auth/chef-login");
    },
  });

  return (
    <Sidebar className="border-r border-gray-200 bg-white text-gray-800 h-screen flex flex-col">
      <SidebarHeader className="bg-sidebar">
        <div className="flex items-center justify-between w-full pl-4 pt-4">
          <img src="/feast-logo-red.png" alt="Feast Logo" className="h-8" />
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar flex flex-col flex-grow justify-between mt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>{menuItems.map(NavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div>
          <ChefOnboardingAlert />
          <div className="px-4 py-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                logout.mutate();
              }}
              label="Logout"
              leftIcon={<LogOut size={18} />}
            />
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
