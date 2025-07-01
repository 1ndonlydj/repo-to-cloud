
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitBranch } from "lucide-react";
import { apiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        toast({
          title: "Authentication Failed",
          description: "GitHub authentication was cancelled or failed.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      if (!code) {
        toast({
          title: "Authentication Error",
          description: "No authorization code received from GitHub.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        await apiService.githubAuth(code);
        toast({
          title: "Authentication Successful",
          description: "You have been logged in successfully.",
        });
        navigate('/dashboard');
      } catch (error) {
        console.error('Authentication error:', error);
        toast({
          title: "Authentication Failed",
          description: "Failed to authenticate with GitHub. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg mb-4 mx-auto w-fit">
          <GitBranch className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
        <p className="text-gray-300">Please wait while we complete your GitHub authentication.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
