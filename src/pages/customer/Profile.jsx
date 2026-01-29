import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Shadcn Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Lucide Icons
import {
  User, Mail, Phone, Calendar, MapPin, Package,
  CheckCircle, Save, Shield, Award, Headphones, LogOut,
  Eye, EyeOff, Lock, Bell, Edit2, Trash2, Plus, Star
} from 'lucide-react';

// Custom Components
import Loader from '../../components/common/Loader';
import MyOrders from './MyOrders';
import { AddressModal } from '../../components/checkout/AddressModal';

// Redux Actions
import { 
  getUserDetails, 
  updateUserProfile, 
  resetUpdateProfile,
  changePassword,
  resetChangePassword,
  listAddresses,
  deleteAddress,
  logout 
} from '../../actions/customerActions';

// Profile Update Schema
const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
});

// Password Change Schema
const passwordSchema = z.object({
  old_password: z.string().min(6, 'Old password is required'),
  new_password: z.string().min(6, 'New password must be at least 6 characters'),
  new_password2: z.string().min(6, 'Confirm new password'),
}).refine((data) => data.new_password === data.new_password2, {
  message: "Passwords don't match",
  path: ["new_password2"],
});

// Skeleton Loader Components
const SidebarSkeleton = () => (
  <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
    <CardContent className="p-0">
      {/* Profile Header Skeleton */}
      <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 pb-12">
        <div className="relative flex flex-col items-center text-center space-y-4">
          <Skeleton className="w-28 h-28 rounded-2xl" />
          <div className="space-y-2 w-full">
            <Skeleton className="h-6 w-32 mx-auto" />
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>
      </div>

      {/* Loyalty Badge Skeleton */}
      <div className="px-6 -mt-6 relative z-10">
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>

      <Separator className="my-6 mx-6" />

      {/* Navigation Skeleton */}
      <nav className="space-y-1 px-4 pb-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </nav>
    </CardContent>
  </Card>
);

const ProfileFormSkeleton = () => (
  <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
      <Skeleton className="h-7 w-48 mb-2" />
      <Skeleton className="h-4 w-72" />
    </CardHeader>
    <CardContent className="p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddressesSkeleton = () => (
  <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
    <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </CardHeader>
    <CardContent className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-2 border-gray-200 rounded-xl p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="space-y-2 mb-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 flex-1" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state selectors
  const userDetails = useSelector((state) => state.userDetails);
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const userChangePassword = useSelector((state) => state.userChangePassword);
  const addressList = useSelector((state) => state.addressList);
  const userLogin = useSelector((state) => state.userLogin);

  const { loading: loadingUser, error: userError, user } = userDetails;
  const { loading: updating, success: updateSuccess, error: updateError } = userUpdateProfile;
  const { loading: changingPassword, success: passwordSuccess, error: passwordError } = userChangePassword;
  const { loading: loadingAddresses, addresses, error: addressesError } = addressList;
  const { userInfo } = userLogin;

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
    },
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_password: '',
      new_password: '',
      new_password2: '',
    },
  });

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      dispatch(getUserDetails());
      dispatch(listAddresses());
    }
  }, [dispatch, navigate, userInfo]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user, profileForm]);

  useEffect(() => {
    if (updateSuccess) {
      setTimeout(() => {
        dispatch(resetUpdateProfile());
      }, 3000);
    }
    if (passwordSuccess) {
      setTimeout(() => {
        dispatch(resetChangePassword());
        passwordForm.reset();
      }, 3000);
    }
  }, [updateSuccess, passwordSuccess, dispatch, passwordForm]);

  const onProfileSubmit = (data) => {
    dispatch(updateUserProfile(data));
  };

  const onPasswordSubmit = (data) => {
    dispatch(changePassword(data));
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    dispatch(logout(refreshToken));
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setModalOpen(true);
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      dispatch(deleteAddress(addressId));
    }
  };

  const handleSaveAddress = () => {
    setModalOpen(false);
    setEditingAddress(null);
    dispatch(listAddresses());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Premium Header with Glassmorphism */}
      <div className="bg-white/80 border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-black/5 blur-xl rounded-full group-hover:bg-black/10 transition-all duration-300"></div>
                <Headphones className="h-7 w-7 text-black relative z-10 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="text-2xl font-light tracking-tight text-black">
                Sound Wave <span className="font-semibold bg-gradient-to-r from-black to-gray-600 bg-clip-text text-transparent">Audio</span>
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-black hover:bg-gray-100/50 transition-all duration-300"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Premium Sidebar */}
          <div className="lg:col-span-1">
            {loadingUser ? (
              <SidebarSkeleton />
            ) : (
              <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardContent className="p-0">
                  {/* Profile Header with Gradient */}
                  <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 p-8 pb-12">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
                    <div className="relative flex flex-col items-center text-center space-y-4">
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-gray-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                        <div className="relative w-28 h-28 rounded-2xl border-2 border-white/30 flex items-center justify-center bg-white/10 backdrop-blur-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                          {user?.profile_image ? (
                            <img 
                              src={user.profile_image} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-14 w-14 text-white/90" />
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {user?.first_name} {user?.last_name}
                        </h3>
                        <p className="text-sm text-white/70">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty Badge */}
                  <div className="px-6 -mt-6 relative z-10">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center space-x-2">
                          <Award className="h-5 w-5" />
                          <span className="font-semibold">Loyalty Points</span>
                        </div>
                        <span className="text-2xl font-bold">{user?.loyalty_points || 0}</span>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6 mx-6" />

                  {/* Navigation */}
                  <nav className="space-y-1 px-4 pb-6">
                    {[
                      { id: 'profile', icon: User, label: 'Personal Information' },
                      { id: 'security', icon: Shield, label: 'Security' },
                      { id: 'addresses', icon: MapPin, label: `Addresses (${addresses?.results?.length || 0})` },
                      { id: 'orders', icon: Package, label: 'Order History' },
                      // { id: 'notifications', icon: Bell, label: 'Notifications' },
                    ].map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? 'secondary' : 'ghost'}
                        className={`w-full justify-start text-sm font-normal transition-all duration-200 ${
                          activeTab === item.id 
                            ? 'bg-black text-white hover:bg-gray-900 shadow-md' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              loadingUser ? (
                <ProfileFormSkeleton />
              ) : (
                <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <CardTitle className="text-xl font-semibold text-black">Personal Information</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Update your personal details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    {updateSuccess && (
                      <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 font-medium">
                          Profile updated successfully
                        </AlertDescription>
                      </Alert>
                    )}
                    {updateError && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{updateError}</AlertDescription>
                      </Alert>
                    )}

                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-800">First Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="First name"
                                    className="border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={profileForm.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-semibold text-gray-800">Last Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Last name"
                                    className="border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-xs" />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    placeholder="email@example.com"
                                    className="pl-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">Date of Birth</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    type="date"
                                    className="pl-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={updating}
                            className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {updating ? (
                              <>
                                <Loader className="mr-2 h-4 w-4" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              loadingUser ? (
                <ProfileFormSkeleton />
              ) : (
                <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <CardTitle className="text-xl font-semibold text-black">Security Settings</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Update your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    {passwordSuccess && (
                      <Alert className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 font-medium">
                          Password changed successfully
                        </AlertDescription>
                      </Alert>
                    )}
                    {passwordError && (
                      <Alert variant="destructive" className="mb-6">
                        <AlertDescription>{passwordError}</AlertDescription>
                      </Alert>
                    )}

                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                        <FormField
                          control={passwordForm.control}
                          name="old_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">Current Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    className="pl-11 pr-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="new_password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter new password"
                                    className="pl-11 pr-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                  >
                                    {showNewPassword ? (
                                      <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="new_password2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-semibold text-gray-800">Confirm New Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm new password"
                                    className="pl-11 pr-11 border-gray-300 bg-white text-black focus:border-black focus:ring-black transition-all duration-200"
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  >
                                    {showConfirmPassword ? (
                                      <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            disabled={changingPassword}
                            className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            {changingPassword ? (
                              <>
                                <Loader className="mr-2 h-4 w-4" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Update Password
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              loadingAddresses ? (
                <AddressesSkeleton />
              ) : (
                <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                  <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl font-semibold text-black">Address Book</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          Manage your shipping and billing addresses
                        </CardDescription>
                      </div>
                      <Button 
                        onClick={handleAddAddress}
                        className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Address
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    {addressesError ? (
                      <Alert variant="destructive">
                        <AlertDescription>{addressesError}</AlertDescription>
                      </Alert>
                    ) : addresses?.count === 0 ? (
                      <div className="text-center py-16">
                        <div className="relative inline-block mb-6">
                          <div className="absolute inset-0 bg-gray-200/50 blur-2xl rounded-full"></div>
                          <MapPin className="h-20 w-20 text-gray-300 relative z-10" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h3>
                        <p className="text-gray-500 mb-8">Add your first address to get started with faster checkout</p>
                        <Button 
                          onClick={handleAddAddress}
                          className="bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-900 hover:to-black shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Address
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses?.results?.map((address) => (
                          <div 
                            key={address.id} 
                            className="group relative border-2 border-gray-200 rounded-xl p-6 hover:border-black hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                          >
                            {/* Default Badge */}
                            {address.is_default && (
                              <div className="absolute -top-3 -right-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full"></div>
                                  <Badge className="relative bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg px-3 py-1">
                                    <Star className="h-3 w-3 mr-1 fill-white" />
                                    Default
                                  </Badge>
                                </div>
                              </div>
                            )}

                            {/* Address Content */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-lg text-black mb-2 capitalize">{address.address_type}</h4>
                              <div className="space-y-1.5 text-sm text-gray-700">
                                <p className="font-medium">{address.street_address}</p>
                                {address.apartment && (
                                  <p className="text-gray-600">Apt: {address.apartment}</p>
                                )}
                                <p className="text-gray-600">
                                  {address.city}, {address.state} {address.postal_code}
                                </p>
                                <p className="text-gray-600">{address.country}</p>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                              <Button 
                                onClick={() => handleEditAddress(address)}
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-200"
                              >
                                <Edit2 className="h-3.5 w-3.5 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                onClick={() => handleDeleteAddress(address.id)}
                                variant="outline" 
                                size="sm"
                                className="flex-1 border-gray-300 text-red-600 hover:border-red-500 hover:bg-red-500 hover:text-white transition-all duration-200"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                <MyOrders />
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="border border-gray-200/60 bg-white shadow-xl shadow-gray-200/50 overflow-hidden">
                <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white p-6">
                  <CardTitle className="text-xl font-semibold text-black">Notification Preferences</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    Manage how you receive updates from Sound Wave Audio
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {[
                      {
                        title: 'Order Updates',
                        description: 'Receive notifications about your orders and shipments',
                        enabled: true
                      },
                      {
                        title: 'Promotional Emails',
                        description: 'Get updates on new products, exclusive deals and sales',
                        enabled: false
                      },
                      {
                        title: 'Sound Wave Audio Newsletter',
                        description: 'Monthly newsletter with audio insights and industry news',
                        enabled: true
                      },
                      {
                        title: 'Product Recommendations',
                        description: 'Personalized suggestions based on your preferences',
                        enabled: true
                      }
                    ].map((item, index) => (
                      <div 
                        key={index}
                        className="group flex items-center justify-between p-6 border-2 border-gray-200 rounded-xl hover:border-black transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-black mb-1.5 text-base">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="relative ml-6">
                          <button 
                            className={`relative h-7 w-14 rounded-full transition-all duration-300 ${
                              item.enabled 
                                ? 'bg-gradient-to-r from-black to-gray-800 shadow-lg' 
                                : 'bg-gray-300'
                            }`}
                          >
                            <div 
                              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                                item.enabled ? 'translate-x-7' : 'translate-x-0'
                              }`}
                            ></div>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleSaveAddress}
        editAddress={editingAddress}
        mode="shipping"
      />
    </div>
  );
}

export default Profile;