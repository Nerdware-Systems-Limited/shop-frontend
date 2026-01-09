import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

// Shadcn Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

// Custom Components
import Loader from '../../components/common/Loader';

// Redux Actions
import { login } from '../../actions/customerActions';

// Import hero banner
import herobanner from '../../assets/hero-banner.jpg';

// Schema for form validation
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const redirect = location.search ? location.search.split('=')[1] : '/';

  // Get state from Redux store
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Effect for loading saved username
  useEffect(() => {
    const savedUsername = localStorage.getItem('soundwave_username');
    if (savedUsername) {
      form.setValue('username', savedUsername);
      setRememberMe(true);
    }
  }, [form]);

  // Effect for handling successful login redirect
  useEffect(() => {
    // Only navigate when we have userInfo (successful login)
    if (userInfo && userInfo.access) { // Check for access token
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const onSubmit = async (data) => {
    if (rememberMe) {
      localStorage.setItem('soundwave_username', data.username);
    } else {
      localStorage.removeItem('soundwave_username');
    }
    
    dispatch(login(data.username, data.password));
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
                  Welcome Back
                </CardTitle>
                <p className="text-center text-sm text-white/60">
                  Sign in to your account to continue
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission
                      form.handleSubmit(onSubmit)();
                    }} className="space-y-5" autoComplete="on">
                    {/* Username/Email Field */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 text-sm">Email or Username</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                              <Input
                                placeholder="Enter your email or username"
                                className="pl-10 sm:pl-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between mb-2">
                            <FormLabel className="text-white/90 text-sm">Password</FormLabel>
                            <Link
                              to="/forgot-password"
                              className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-white/40" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="pl-10 sm:pl-11 pr-10 sm:pr-11 h-11 sm:h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:bg-white/10 focus:border-white/30 transition-all"
                                {...field}
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
                          </FormControl>
                          <FormMessage className="text-red-300 text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Remember Me */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-xs sm:text-sm text-white/70 cursor-pointer font-normal"
                      >
                        Remember me for 30 days
                      </Label>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-11 sm:h-12 bg-white text-black hover:bg-white/90 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader className="h-4 w-4 animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </Form>

                {/* Sign Up Link */}
                <p className="text-center text-xs sm:text-sm text-white/60 pt-2">
                  Don't have an account?{' '}
                  <Link
                    to={redirect ? `/register?redirect=${redirect}` : '/register'}
                    className="font-semibold text-white hover:text-white/80 transition-colors"
                  >
                    Create account
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;