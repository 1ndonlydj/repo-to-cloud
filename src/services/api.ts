
const API_BASE_URL = 'http://localhost:8000/api';

export interface User {
  id: number;
  github_username: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface DeploymentData {
  repo_url: string;
  dockerfile_path?: string;
  app_type: 'nodejs' | 'fastapi' | 'php74' | 'php82';
  environment: 'dev' | 'staging' | 'prod';
  secrets: KeyValuePair[];
  env_vars: KeyValuePair[];
  build_args: KeyValuePair[];
}

export interface Deployment extends DeploymentData {
  id: number;
  user_id: number;
  status: 'pending' | 'building' | 'success' | 'failed';
  build_logs?: string;
  deployment_url?: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Authentication
  async githubAuth(code: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/github`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  // Deployments
  async getDeployments(): Promise<Deployment[]> {
    const response = await fetch(`${API_BASE_URL}/deployments`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch deployments');
    }
    
    return response.json();
  }

  async createDeployment(deployment: DeploymentData): Promise<Deployment> {
    const response = await fetch(`${API_BASE_URL}/deployments`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(deployment),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create deployment');
    }
    
    return response.json();
  }

  async getDeployment(id: number): Promise<Deployment> {
    const response = await fetch(`${API_BASE_URL}/deployments/${id}`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch deployment');
    }
    
    return response.json();
  }

  async deleteDeployment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/deployments/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete deployment');
    }
  }

  // Admin endpoints
  async getAllDeployments(): Promise<Deployment[]> {
    const response = await fetch(`${API_BASE_URL}/admin/deployments`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch all deployments');
    }
    
    return response.json();
  }

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders(),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  }

  async updateUserRole(userId: number, role: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user role');
    }
  }

  // Utility methods
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}

export const apiService = new ApiService();
