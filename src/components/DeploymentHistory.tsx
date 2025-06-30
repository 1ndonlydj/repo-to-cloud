
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitBranch, Clock, CheckCircle, XCircle, AlertCircle, Eye } from "lucide-react";

interface DeploymentHistoryProps {
  userRole: string;
}

export function DeploymentHistory({ userRole }: DeploymentHistoryProps) {
  // Mock data - replace with real API calls
  const deployments = [
    {
      id: 1,
      repo: "company/api-service",
      environment: "production",
      appType: "Node.js",
      status: "success",
      triggeredBy: "John Doe",
      createdAt: "2024-01-15T10:30:00Z",
      duration: "3m 45s"
    },
    {
      id: 2,
      repo: "company/web-frontend",
      environment: "staging",
      appType: "FastAPI",
      status: "running",
      triggeredBy: "Jane Smith",
      createdAt: "2024-01-15T09:15:00Z",
      duration: "2m 12s"
    },
    {
      id: 3,
      repo: "company/legacy-app",
      environment: "development",
      appType: "PHP 7.4",
      status: "failed",
      triggeredBy: "Mike Johnson",
      createdAt: "2024-01-14T16:20:00Z",
      duration: "1m 30s"
    },
    {
      id: 4,
      repo: "company/analytics",
      environment: "production",
      appType: "Node.js",
      status: "success",
      triggeredBy: "Sarah Wilson",
      createdAt: "2024-01-14T14:45:00Z",
      duration: "4m 18s"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      running: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

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
                    <h3 className="font-semibold text-gray-900">{deployment.repo}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span>Environment: {deployment.environment}</span>
                      <span>Type: {deployment.appType}</span>
                      <span>Duration: {deployment.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      by {deployment.triggeredBy}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(deployment.createdAt).toLocaleString()}
                    </div>
                  </div>
                  
                  {getStatusBadge(deployment.status)}
                  
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
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
