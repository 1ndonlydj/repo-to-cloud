export interface KeyValuePair {
  key: string;
  value: string;
}

export interface DeploymentFormData {
  repoUrl: string;
  dockerfilePath: string;
  appType: string;
  environment: string;
  secrets: KeyValuePair[];
  envVars: KeyValuePair[];
  buildArgs: KeyValuePair[];
}