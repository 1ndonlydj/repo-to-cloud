
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DeploymentForm } from "@/components/DeploymentForm";
import { DeploymentHistory } from "@/components/DeploymentHistory";
import { AdminPanel } from "@/components/AdminPanel";
import { apiService, User } from "@/services/api";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("deploy");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = apiService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  if (!apiService.isAuthenticated() || !user) {
    return <Navigate to="/" replace />;
  }

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
