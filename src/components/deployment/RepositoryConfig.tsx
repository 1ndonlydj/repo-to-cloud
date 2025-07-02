import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch } from "lucide-react";
import { DeploymentFormData } from "./types";

interface RepositoryConfigProps {
  formData: DeploymentFormData;
  onUpdate: (updates: Partial<DeploymentFormData>) => void;
}

export function RepositoryConfig({ formData, onUpdate }: RepositoryConfigProps) {
  return (
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
              onChange={(e) => onUpdate({ repoUrl: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dockerfilePath">Dockerfile Path</Label>
            <Input
              id="dockerfilePath"
              placeholder="./Dockerfile (optional)"
              value={formData.dockerfilePath}
              onChange={(e) => onUpdate({ dockerfilePath: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="appType">Application Type *</Label>
            <Select
              value={formData.appType}
              onValueChange={(value) => onUpdate({ appType: value })}
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
              onValueChange={(value) => onUpdate({ environment: value })}
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
  );
}