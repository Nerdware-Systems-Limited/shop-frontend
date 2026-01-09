import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import actions
import { 
  verifyResetCode, 
  confirmPasswordReset, 
  resetVerifyCode, 
  resetConfirmPassword 
} from "../../actions/customerActions";

// Import hero banner
import herobanner from '../../assets/hero-banner.jpg';

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: verify code, 2: set new password
  const [formData, setFormData] = useState({
    uid: "",
    token: "",
    code: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get state from Redux store
  const passwordResetVerify = useSelector((state) => state.passwordResetVerify);
  const { loading: verifyLoading, success: verifySuccess, error: verifyError } = passwordResetVerify;
  
  const passwordResetConfirm = useSelector((state) => state.passwordResetConfirm);
  const { loading: confirmLoading, success: confirmSuccess, error: confirmError } = passwordResetConfirm;

  // Parse URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlCode = params.get('code');
    const urlUid = params.get('uid');
    const urlToken = params.get('token');
    
    setFormData(prev => ({
      ...prev,
      code: urlCode || '',
      uid: urlUid || '',
      token: urlToken || ''
    }));
  }, [location]);

  // Move to step 2 when code is verified
  useEffect(() => {
    if (verifySuccess) {
      setStep(2);
    }
  }, [verifySuccess]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (confirmSuccess) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmSuccess, navigate]);

  // Reset state on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetVerifyCode());
      dispatch(resetConfirmPassword());
    };
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    console.log(formData)
    dispatch(verifyResetCode(formData.uid, formData.token, formData.code));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return;
    }
    
    dispatch(confirmPasswordReset({
      uid: formData.uid,
      token: formData.token,
      code: formData.code,
      new_password: formData.newPassword,
      new_password2: formData.confirmPassword
    }));
  };

  const handleBackToVerify = () => {
    setStep(1);
    dispatch(resetVerifyCode());
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
              {!confirmSuccess ? (
                <>
                  {/* Icon */}
                  <div className="flex justify-center pt-8">
                    <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-white/10">
                      <Lock className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>

                  <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold text-white text-center">
                      {step === 1 ? "Verify Reset Code" : "Set New Password"}
                    </CardTitle>
                    <p className="text-center text-sm text-white/60">
                      {step === 1 
                        ? "Enter the code from your email"
                        : "Choose a strong password for your account"
                      }
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Error Alert */}
                    {(verifyError || confirmError) && (
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <AlertDescription className="text-red-400 text-sm">
                          {verifyError || confirmError}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Step 1: Verify Code */}
                    {step === 1 && (
                      <form onSubmit={handleVerifyCode} className="space-y-5">
                        {/* Code Field */}
                        <div className="space-y-2">
                          <Label htmlFor="code" className="text-white/90 text-sm">
                            Reset Code
                          </Label>
                          <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={formData.code}
                            onChange={handleInputChange}
                            className="h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all text-center text-lg tracking-widest"
                            maxLength={6}
                            required
                            disabled={verifyLoading}
                          />
                        </div>

                        {/* Hidden fields for uid and token */}
                        <input type="hidden" name="uid" value={formData.uid} />
                        <input type="hidden" name="token" value={formData.token} />

                        {/* Submit Button */}
                        <Button 
                          type="submit" 
                          className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all"
                          disabled={verifyLoading || !formData.uid || !formData.token}
                        >
                          {verifyLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                              Verifying...
                            </div>
                          ) : (
                            "Verify Code"
                          )}
                        </Button>

                        {/* Warning if missing params */}
                        {(!formData.uid || !formData.token) && (
                          <Alert className="border-yellow-500/50 bg-yellow-500/10">
                            <AlertCircle className="h-4 w-4 text-yellow-400" />
                            <AlertDescription className="text-yellow-400 text-xs">
                              Please use the link from your email to access this page.
                            </AlertDescription>
                          </Alert>
                        )}
                      </form>
                    )}

                    {/* Step 2: Set New Password */}
                    {step === 2 && (
                      <form onSubmit={handleResetPassword} className="space-y-5">
                        {/* New Password Field */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-white/90 text-sm">
                            New Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                              required
                              disabled={confirmLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-white/90 text-sm">
                            Confirm Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                              required
                              disabled={confirmLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                              ) : (
                                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                              )}
                            </button>
                          </div>
                          {formData.newPassword && formData.confirmPassword && 
                           formData.newPassword !== formData.confirmPassword && (
                            <p className="text-xs text-red-400">Passwords do not match</p>
                          )}
                        </div>

                        {/* Submit Button */}
                        <Button 
                          type="submit" 
                          className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all"
                          disabled={confirmLoading || formData.newPassword !== formData.confirmPassword}
                        >
                          {confirmLoading ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                              Resetting...
                            </div>
                          ) : (
                            "Reset Password"
                          )}
                        </Button>

                        {/* Back to Verify */}
                        <div className="text-center pt-2">
                          <button
                            type="button"
                            onClick={handleBackToVerify}
                            className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                          >
                            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                            Back to Code Verification
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Back to Login */}
                    {step === 1 && (
                      <div className="text-center pt-2">
                        <Link
                          to="/login"
                          className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                        >
                          <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                          Back to Sign In
                        </Link>
                      </div>
                    )}

                    {/* Need Code? */}
                    {step === 1 && (
                      <div className="text-center pt-2">
                        <Link
                          to="/forgot-password"
                          className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                        >
                          Don't have a code? Request one
                        </Link>
                      </div>
                    )}
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
                      <h1 className="text-xl sm:text-2xl font-bold text-white">Password Reset Successful!</h1>
                      <p className="mt-3 text-sm text-white/60">
                        Your password has been reset successfully.
                      </p>
                      <p className="mt-2 text-sm text-white/60">
                        Redirecting you to login...
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 pt-2">
                      <Link to="/login" className="block">
                        <Button 
                          className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all"
                        >
                          Continue to Login
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

export default ResetPassword;