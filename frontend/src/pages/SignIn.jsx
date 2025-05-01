import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, checkServerHealth } from '../config/api';
import { useToast } from '../components/ui/use-toast';
import authService from '../services/authService';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Loader2, Eye, EyeOff, LogIn } from 'lucide-react';

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState(true);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkServer = async () => {
      const isHealthy = await checkServerHealth();
      setServerStatus(isHealthy);
      if (!isHealthy) {
        toast({
          variant: "destructive",
          title: "Server Error",
          description: "Unable to connect to server. Please try again later.",
        });
      }
    };
    checkServer();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serverStatus) {
      toast({ variant: "destructive", title: "Server Error", description: "Server is unavailable." });
      return;
    }

    setIsLoading(true);
    setShowVerificationMessage(false);

    try {
      await authService.login(formData.email, formData.password);
      toast({ title: "Success!", description: "Signed in successfully" });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const message = error?.message || "Failed to sign in";

      if (message.includes('verification')) {
        setShowVerificationMessage(true);
      }

      toast({ variant: "destructive", title: "Error", description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <LogIn className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">Access your dashboard</p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              value={formData.email} 
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <span className="ml-2 text-sm">Remember me</span>
            </label>

            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>

          {showVerificationMessage && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-sm">
              Please check your email for the verification link. 
              <Link to="/resend-verification" className="underline ml-1">Resend</Link>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
