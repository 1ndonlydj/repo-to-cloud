
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DeploymentForm } from "@/components/DeploymentForm";
import { DeploymentHistory } from "@/components/DeploymentHistory";
import { AdminPanel } from "@/components/AdminPanel";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("deploy");
  const [user] = useState({ name: "John Doe", role: "admin", email: "john@company.com" });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} userRole={user.role} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader user={user} />
          
          <main className="flex-1 p-6">
            {activeTab === "deploy" && <DeploymentForm />}
            {activeTab === "history" && <DeploymentHistory userRole={user.role} />}
            {activeTab === "admin" && user.role === "admin" && <AdminPanel />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
