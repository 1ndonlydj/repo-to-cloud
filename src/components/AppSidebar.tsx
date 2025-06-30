
import { GitBranch, Rocket, History, Shield, Users, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: string;
}

export function AppSidebar({ activeTab, onTabChange, userRole }: AppSidebarProps) {
  const menuItems = [
    { id: "deploy", label: "New Deployment", icon: Rocket, roles: ["user", "admin"] },
    { id: "history", label: "Deployment History", icon: History, roles: ["user", "admin"] },
  ];

  const adminItems = [
    { id: "admin", label: "Admin Panel", icon: Shield, roles: ["admin"] },
  ];

  const isItemVisible = (roles: string[]) => roles.includes(userRole);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">DeployHub</span>
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Deployment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems
                .filter(item => isItemVisible(item.roles))
                .map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    className={activeTab === item.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : ""}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems
                  .filter(item => isItemVisible(item.roles))
                  .map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(item.id)}
                      className={activeTab === item.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
