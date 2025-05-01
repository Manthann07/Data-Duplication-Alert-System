import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '../components/ui/use-toast';
import { Button } from '../components/ui/button';
import { Loader2 } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "Invalid verification link. Please try again.",
        });
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          toast({
            title: "Success!",
            description: "Your email has been verified successfully.",
          });
          // Redirect to sign in page after 3 seconds
          setTimeout(() => {
            navigate('/signin');
          }, 3000);
        } else {
          setVerificationStatus('error');
          toast({
            variant: "destructive",
            title: "Verification Failed",
            description: data.message || "Failed to verify email. Please try again.",
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: "An error occurred while verifying your email. Please try again.",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg text-center">
        <div>
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              {isVerifying ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : verificationStatus === 'success' ? (
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
            {isVerifying ? 'Verifying Email...' : 
             verificationStatus === 'success' ? 'Email Verified!' : 'Verification Failed'}
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {isVerifying ? 'Please wait while we verify your email address.' :
             verificationStatus === 'success' ? 'Your email has been verified successfully. Redirecting to sign in...' :
             'There was a problem verifying your email address.'}
          </p>
        </div>

        {!isVerifying && verificationStatus === 'error' && (
          <div className="mt-4">
            <Button
              onClick={() => navigate('/signin')}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 