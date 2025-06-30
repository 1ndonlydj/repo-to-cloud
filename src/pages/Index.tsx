
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { GitBranch, Shield, Zap, Cloud, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  // Simulate authentication state - replace with real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  const handleGitHubLogin = () => {
    // Simulate GitHub OAuth - replace with real implementation
    setIsAuthenticated(true);
    setUser({ name: "John Doe", role: "admin" });
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          {/* Navigation */}
          <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <GitBranch className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">DeployHub</span>
            </div>
            <Button
              onClick={handleGitHubLogin}
              className="bg-white text-slate-900 hover:bg-gray-100"
            >
              Sign in with GitHub
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="text-center py-20 px-6 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Deploy with
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Confidence
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Streamline your deployment workflow with automated CI/CD pipelines, 
              Kubernetes integration, and enterprise-grade security controls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleGitHubLogin}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gray-400 text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to deploy faster
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From code to production in minutes, not hours. Built for modern development teams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <GitBranch className="h-6 w-6 text-blue-400" />
              </div>
              <CardTitle className="text-white">Automated CI/CD</CardTitle>
              <CardDescription className="text-gray-400">
                Generate GitHub Actions workflows automatically with your repository and deployment preferences.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Cloud className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Kubernetes Ready</CardTitle>
              <CardDescription className="text-gray-400">
                Deploy to Kubernetes with pre-configured manifests and best practices built-in.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Enterprise Security</CardTitle>
              <CardDescription className="text-gray-400">
                Domain restrictions, role-based access, and secure secret management.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-orange-400" />
              </div>
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-gray-400">
                Optimized build processes and intelligent caching for rapid deployments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-pink-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-pink-400" />
              </div>
              <CardTitle className="text-white">Team Management</CardTitle>
              <CardDescription className="text-gray-400">
                Comprehensive admin panel for user management and access control.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <div className="bg-cyan-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Settings className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">Flexible Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Support for multiple application types, environments, and deployment strategies.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <GitBranch className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">DeployHub</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 DeployHub. Built for modern development teams.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
