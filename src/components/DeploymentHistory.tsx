
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, CheckCircle, XCircle, AlertCircle, Eye, Trash2 } from "lucide-react";
import { apiService, Deployment } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface DeploymentHistoryProps {
  userRole: string;
}

export function DeploymentHistory({ userRole }: DeploymentHistoryProps) {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeployments();
  }, [userRole]);

  const fetchDeployments = async () => {
    try {
      const data = userRole === "admin" 
        ? await apiService.getAllDeployments()
        : await apiService.getDeployments();
      setDeployments(data);
    } catch (error) {
      console.error("Failed to fetch deployments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch deployments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (deploymentId: number) => {
    try {
      await apiService.deleteDeployment(deploymentId);
      setDeployments(prev => prev.filter(d => d.id !== deploymentId));
      toast({
        title: "Success",
        description: "Deployment deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete deployment:", error);
      toast({
        title: "Error",
        description: "Failed to delete deployment.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "building":
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      building: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center py-12">
          <Clock className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading deployments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Deployment History</h2>
          <p className="text-gray-600">
            {userRole === "admin" ? "View all deployment activities" : "View your deployment history"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {deployments.map((deployment) => (
          <Card key={deployment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(deployment.status)}
                    <GitBranch className="h-4 w-4 text-gray-500" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">{deployment.repo_url}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Environment: {deployment.environment}</span>
                      <span>Type: {deployment.app_type}</span>
                      {userRole === "admin" && (
                        <span>User: {deployment.user.name}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">
                      {new Date(deployment.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  {getStatusBadge(deployment.status)}
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(deployment.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {deployments.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deployments yet</h3>
            <p className="text-gray-600">
              Submit your first deployment to see it here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
