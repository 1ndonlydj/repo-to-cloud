import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, GitBranch, Dock, Key, Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService, DeploymentData, KeyValuePair } from "@/services/api";

export function DeploymentForm() {
  const [formData, setFormData] = useState({
    repoUrl: "",
    dockerfilePath: "",
    appType: "",
    environment: "",
    secrets: [] as KeyValuePair[],
    envVars: [] as KeyValuePair[],
    buildArgs: [] as KeyValuePair[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addKeyValuePair = (type: "secrets" | "envVars" | "buildArgs") => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { key: "", value: "" }]
    }));
  };

  const removeKeyValuePair = (type: "secrets" | "envVars" | "buildArgs", index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateKeyValuePair = (type: "secrets" | "envVars" | "buildArgs", index: number, field: "key" | "value", value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.repoUrl || !formData.appType || !formData.environment) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const deploymentData: DeploymentData = {
        repo_url: formData.repoUrl,
        dockerfile_path: formData.dockerfilePath || "./Dockerfile",
        app_type: formData.appType as "nodejs" | "fastapi" | "php74" | "php82",
        environment: formData.environment as "dev" | "staging" | "prod",
        secrets: formData.secrets.filter(s => s.key && s.value),
        env_vars: formData.envVars.filter(e => e.key && e.value),
        build_args: formData.buildArgs.filter(b => b.key && b.value),
      };

      await apiService.createDeployment(deploymentData);
      
      toast({
        title: "Deployment Submitted",
        description: "Your deployment job has been queued for processing.",
      });

      // Reset form
      setFormData({
        repoUrl: "",
        dockerfilePath: "",
        appType: "",
        environment: "",
        secrets: [],
        envVars: [],
        buildArgs: [],
      });

    } catch (error) {
      console.error("Deployment submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit deployment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">New Deployment</h2>
        <p className="text-gray-600">Submit a private GitHub repository for automated deployment</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Repository Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              <span>Repository Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your GitHub repository and deployment settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="repoUrl">Private GitHub Repository URL *</Label>
                <Input
                  id="repoUrl"
                  placeholder="https://github.com/yourorg/private-repo"
                  value={formData.repoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, repoUrl: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dockerfilePath">Dockerfile Path</Label>
                <Input
                  id="dockerfilePath"
                  placeholder="./Dockerfile (optional)"
                  value={formData.dockerfilePath}
                  onChange={(e) => setFormData(prev => ({ ...prev, dockerfilePath: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appType">Application Type *</Label>
                <Select
                  value={formData.appType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, appType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select application type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="fastapi">FastAPI</SelectItem>
                    <SelectItem value="php74">PHP 7.4</SelectItem>
                    <SelectItem value="php82">PHP 8.2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="environment">Environment *</Label>
                <Select
                  value={formData.environment}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, environment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select environment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="prod">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GitHub Secrets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-green-600" />
              <span>GitHub Secrets</span>
            </CardTitle>
            <CardDescription>
              Configure secrets that will be available in your GitHub Actions workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.secrets.map((secret, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="SECRET_NAME"
                  value={secret.key}
                  onChange={(e) => updateKeyValuePair("secrets", index, "key", e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="secret_value"
                  value={secret.value}
                  onChange={(e) => updateKeyValuePair("secrets", index, "value", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeKeyValuePair("secrets", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addKeyValuePair("secrets")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Secret
            </Button>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-purple-600" />
              <span>Environment Variables</span>
            </CardTitle>
            <CardDescription>
              Set environment variables for your application runtime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.envVars.map((envVar, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="VARIABLE_NAME"
                  value={envVar.key}
                  onChange={(e) => updateKeyValuePair("envVars", index, "key", e.target.value)}
                />
                <Input
                  placeholder="variable_value"
                  value={envVar.value}
                  onChange={(e) => updateKeyValuePair("envVars", index, "value", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeKeyValuePair("envVars", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addKeyValuePair("envVars")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Environment Variable
            </Button>
          </CardContent>
        </Card>

        {/* Docker Build Arguments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Dock className="h-5 w-5 text-blue-600" />
              <span>Docker Build Arguments</span>
            </CardTitle>
            <CardDescription>
              Configure build-time arguments for your Docker image
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.buildArgs.map((buildArg, index) => (
              <div key={index} className="flex space-x-2">
                <Input
                  placeholder="BUILD_ARG_NAME"
                  value={buildArg.key}
                  onChange={(e) => updateKeyValuePair("buildArgs", index, "key", e.target.value)}
                />
                <Input
                  placeholder="build_arg_value"
                  value={buildArg.value}
                  onChange={(e) => updateKeyValuePair("buildArgs", index, "value", e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeKeyValuePair("buildArgs", index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => addKeyValuePair("buildArgs")}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Build Argument
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Deployment"}
          </Button>
        </div>
      </form>
    </div>
  );
}
