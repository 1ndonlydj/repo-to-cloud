
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

export function GitHubAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleGitHubCallback(code);
    }
  }, []);

  const handleGitHubCallback = async (code: string) => {
    try {
      await apiService.githubAuth(code);
      toast({
        title: "Authentication Successful",
        description: "You have been logged in successfully.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with GitHub. Please try again.",
        variant: "destructive",
      });
      navigate('/');
    }
  };

  const initiateGitHubLogin = () => {
    const clientId = 'YOUR_ACTUAL_GITHUB_CLIENT_ID'; // Replace with your actual GitHub app client ID
    const redirectUri = `${window.location.origin}/auth/callback`;
    const scope = 'user:email';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    window.location.href = githubAuthUrl;
  };

  return { initiateGitHubLogin };
}
