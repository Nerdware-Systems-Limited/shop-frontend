import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Shadcn Components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Headphones, Music, Shield, User, Lock, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

// Custom Components
import Loader from '../../components/common/Loader';
import FloatingAudioWaves from '@/components/ui/FloatingAudioWaves';

// Redux Actions
import { login } from '../../actions/customerActions';

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

  useEffect(() => {
    const savedUsername = localStorage.getItem('soundwave_username');
    if (savedUsername) {
      form.setValue('username', savedUsername);
      setRememberMe(true);
    }

    if (userInfo) navigate(redirect);
  }, [navigate, userInfo, redirect, form]);

  const onSubmit = (data) => {
    if (rememberMe) {
      localStorage.setItem('soundwave_username', data.username);
    } else {
      localStorage.removeItem('soundwave_username');
    }
    dispatch(login(data.username, data.password));
  };

  const handleDemoLogin = () => {
    form.setValue('username', 'demo_user');
    form.setValue('password', 'demo123');
    dispatch(login('demo_user', 'demo123'));
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 flex items-center justify-center">
      <div className="container max-w-6xl mx-auto py-12">

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">

          {/* Left Branding Section */}
          <div className="lg:w-1/2 space-y-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black text-white rounded-xl">
                <Headphones className="h-7 w-7" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">
                Sound Wave Audio
              </h1>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              Premium sound, clean design, engineered for audio lovers.  
              Welcome to a system built for clarity, power, and perfection.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Music, title: 'Premium Sound', desc: 'Studio-grade clarity' },
                { icon: Shield, title: 'Secure', desc: 'Protected accounts' },
                { icon: Sparkles, title: 'Innovative', desc: 'Next-gen tech' },
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 p-4 rounded-xl text-center hover:shadow-sm transition">
                  <item.icon className="h-6 w-6 mx-auto mb-1 text-black" />
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Login Card */}
          <div className="lg:w-1/2 max-w-md">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
                <CardDescription>Sign in to your Sound Wave Audio account</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Error */}
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Success */}
                {userInfo && !error && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Login successful! Redirecting…</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                    {/* Username */}
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Username or Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                className="pl-10 border-gray-300 text-black placeholder:text-gray-400 bg-white"
                                placeholder="Enter your username or email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-black">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                className="pl-10 pr-10 border-gray-300 text-black placeholder:text-gray-400 bg-white"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Remember / Forgot */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded border-gray-400"
                        />
                        <span className="text-sm text-gray-700">Remember me</span>
                      </div>

                      <Link to="/forgot-password" className="text-sm text-gray-700 underline">
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-6 hover:bg-gray-900"
                    >
                      {loading ? (
                        <>
                          <Loader className="mr-2 h-4 w-4" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </Form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDemoLogin}
                  className="w-full border-gray-300 text-black hover:bg-gray-100"
                >
                  Google under construction
                </Button>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <p className="text-center text-gray-700">
                  Don't have an account?{" "}
                  <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="underline">
                    Create one now
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;