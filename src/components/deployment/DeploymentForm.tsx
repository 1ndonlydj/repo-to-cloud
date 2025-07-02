import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Key, Settings, Dock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiService, DeploymentData } from "@/services/api";
import { DeploymentFormData, KeyValuePair } from "./types";
import { RepositoryConfig } from "./RepositoryConfig";
import { KeyValuePairSection } from "./KeyValuePairSection";

export function DeploymentForm() {
  const [formData, setFormData] = useState<DeploymentFormData>({
    repoUrl: "",
    dockerfilePath: "",
    appType: "",
    environment: "",
    secrets: [],
    envVars: [],
    buildArgs: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = (updates: Partial<DeploymentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addKeyValuePair = (type: keyof Pick<DeploymentFormData, "secrets" | "envVars" | "buildArgs">) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], { key: "", value: "" }]
    }));
  };

  const removeKeyValuePair = (type: keyof Pick<DeploymentFormData, "secrets" | "envVars" | "buildArgs">, index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const updateKeyValuePair = (type: keyof Pick<DeploymentFormData, "secrets" | "envVars" | "buildArgs">, index: number, field: "key" | "value", value: string) => {
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
        <RepositoryConfig 
          formData={formData} 
          onUpdate={updateFormData} 
        />

        <KeyValuePairSection
          title="GitHub Secrets"
          description="Configure secrets that will be available in your GitHub Actions workflow"
          icon={<Key className="h-5 w-5 text-green-600" />}
          items={formData.secrets}
          onAdd={() => addKeyValuePair("secrets")}
          onRemove={(index) => removeKeyValuePair("secrets", index)}
          onUpdate={(index, field, value) => updateKeyValuePair("secrets", index, field, value)}
          keyPlaceholder="SECRET_NAME"
          valuePlaceholder="secret_value"
          valueType="password"
          addButtonText="Add Secret"
        />

        <KeyValuePairSection
          title="Environment Variables"
          description="Set environment variables for your application runtime"
          icon={<Settings className="h-5 w-5 text-purple-600" />}
          items={formData.envVars}
          onAdd={() => addKeyValuePair("envVars")}
          onRemove={(index) => removeKeyValuePair("envVars", index)}
          onUpdate={(index, field, value) => updateKeyValuePair("envVars", index, field, value)}
          keyPlaceholder="VARIABLE_NAME"
          valuePlaceholder="variable_value"
          addButtonText="Add Environment Variable"
        />

        <KeyValuePairSection
          title="Docker Build Arguments"
          description="Configure build-time arguments for your Docker image"
          icon={<Dock className="h-5 w-5 text-blue-600" />}
          items={formData.buildArgs}
          onAdd={() => addKeyValuePair("buildArgs")}
          onRemove={(index) => removeKeyValuePair("buildArgs", index)}
          onUpdate={(index, field, value) => updateKeyValuePair("buildArgs", index, field, value)}
          keyPlaceholder="BUILD_ARG_NAME"
          valuePlaceholder="build_arg_value"
          addButtonText="Add Build Argument"
        />

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