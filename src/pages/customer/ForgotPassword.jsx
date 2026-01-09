import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import actions
import { requestPasswordReset, resetPasswordReset } from "../../actions/customerActions";

// Import hero banner
import herobanner from '../../assets/hero-banner.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  
  const dispatch = useDispatch();
  
  // Get state from Redux store
  const passwordReset = useSelector((state) => state.passwordReset);
  const { loading, success, error, message } = passwordReset;

  // Reset state on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetPasswordReset());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
  };

  const handleResend = () => {
    dispatch(requestPasswordReset(email));
  };

  const handleTryAgain = () => {
    dispatch(resetPasswordReset());
    setEmail("");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${herobanner})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 py-4 sm:py-6">
        <div className="container mx-auto flex items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              soundwave
            </span>
            <span className="text-xl sm:text-2xl font-light text-white/80">audio</span>
          </Link>
          <Link
            to="/login"
            className="flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to Login</span>
            <span className="sm:hidden">Login</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full px-4 py-20 sm:py-24">
        <div className="container mx-auto flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Card */}
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              {!success ? (
                <>
                  {/* Icon */}
                  <div className="flex justify-center pt-8">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/10">
                      <Mail className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>

                  <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white text-center">
                      Forgot Password?
                    </CardTitle>
                    <p className="text-center text-sm text-white/60">
                      No worries! Enter your email and we'll send you a reset code.
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Error Alert */}
                    {error && (
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400 text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 text-sm">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                            required
                            disabled={loading}
                          />
                        </div>
                      </div>

                      {/* Submit Button */}
                      <Button 
                        type="submit" 
                        className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                            Sending...
                          </div>
                        ) : (
                          "Send Reset Code"
                        )}
                      </Button>
                    </form>

                    {/* Back to Login */}
                    <div className="text-center pt-2">
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                        Back to Sign In
                      </Link>
                    </div>
                  </CardContent>
                </>
              ) : (
                /* Success State */
                <CardContent className="py-8">
                  <div className="text-center space-y-6">
                    {/* Success Icon */}
                    <div className="flex justify-center">
                      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-green-500/20">
                        <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">Check Your Email</h1>
                      <p className="mt-3 text-sm text-white/60">
                        {message || "We've sent a password reset code to:"}
                      </p>
                      <p className="mt-2 font-semibold text-white">{email}</p>
                    </div>

                    {/* Instructions */}
                    <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-left">
                      <p className="text-xs sm:text-sm text-white/60">
                        Didn't receive the email? Check your spam folder or{" "}
                        <button
                          onClick={handleTryAgain}
                          className="font-medium text-white hover:text-white/80 underline transition-colors"
                        >
                          try another email address
                        </button>
                        .
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                      <Button
                        onClick={handleResend}
                        variant="outline"
                        className="w-full h-11 sm:h-12 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Sending...
                          </div>
                        ) : (
                          "Resend Email"
                        )}
                      </Button>
                      <Link to="/reset-password" className="block">
                        <Button 
                          variant="ghost" 
                          className="w-full h-11 sm:h-12 text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          I have a code
                        </Button>
                      </Link>
                      <Link to="/login" className="block">
                        <Button 
                          variant="ghost" 
                          className="w-full h-11 sm:h-12 text-white/70 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Sign In
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;