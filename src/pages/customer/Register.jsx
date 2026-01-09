import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, AlertCircle, Check } from "lucide-react";

import { register } from "../../actions/customerActions";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

// Import hero banner
import herobanner from '../../assets/hero-banner.jpg';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Redux state
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  console.log("Register", userInfo)

  useEffect(() => {
    if (userInfo && userInfo.tokens.access) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Clear previous local message
    setLocalMessage("");

    // Validation
    if (!agreeToTerms) {
      setLocalMessage("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (password !== confirm) {
      setLocalMessage("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setLocalMessage("Password must be at least 8 characters long");
      return;
    }

    dispatch(
        register({
          username: email,
          email,
          first_name: name,
          last_name: lastName,
          password,
          password2: confirm,
        })
      );
  };

  // Password requirements checker
  const passwordRequirements = [
    { text: "At least 8 characters", met: password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { text: "Contains number", met: /\d/.test(password) },
    { text: "Passwords match", met: password === confirm && password.length > 0 },
  ];

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
            to="/"
            className="flex items-center gap-2 text-xs sm:text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back to Store</span>
            <span className="sm:hidden">Back</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full px-4 py-20 sm:py-24">
        <div className="container mx-auto flex items-center justify-center">
          <div className="w-full max-w-md">
            {/* Card */}
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white text-center">
                  Create Account
                </CardTitle>
                <p className="text-center text-sm text-white/60">
                  Join us and discover amazing audio gear
                </p>
              </CardHeader>

              <form onSubmit={submitHandler}>
                <CardContent className="space-y-5">
                  {/* Local validation message */}
                  {localMessage && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{localMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* API error */}
                  {error && (
                    <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {typeof error === "string" ? error : "Registration failed. Please check your details."}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                      <Input
                        type="text"
                        placeholder="John"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                      <Input
                        type="text"
                        placeholder="Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                        required
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

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label className="text-white/90 text-sm">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                        required
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
                  </div>

                  {/* Password Requirements */}
                  {password.length > 0 && (
                    <div className="rounded-lg bg-white/5 border border-white/10 p-3">
                      <p className="mb-2 text-xs font-medium text-white/70">
                        Password requirements:
                      </p>
                      <ul className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <li
                            key={index}
                            className={`flex items-center gap-2 text-xs transition-colors ${
                              req.met ? "text-green-400" : "text-white/40"
                            }`}
                          >
                            <Check
                              className={`h-3.5 w-3.5 transition-colors ${
                                req.met ? "text-green-400" : "text-white/20"
                              }`}
                            />
                            {req.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked)}
                      className="mt-0.5 border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <Label 
                      htmlFor="terms" 
                      className="cursor-pointer text-xs sm:text-sm text-white/70 font-normal leading-snug"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-white hover:text-white/80 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-white hover:text-white/80 underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !agreeToTerms}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  {/* Login Link */}
                  <p className="text-center text-xs sm:text-sm text-white/60">
                    Already have an account?{" "}
                    <Link
                      to={redirect ? `/login?redirect=${redirect}` : "/login"}
                      className="font-semibold text-white hover:text-white/80 transition-colors"
                    >
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Register;