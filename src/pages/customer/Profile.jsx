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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Lucide Icons
import {
  User, Mail, Phone, Calendar, MapPin, Package,
  CreditCard, CheckCircle, Clock, Truck, Settings,
  Edit2, Save, Shield, Award, Headphones, LogOut,
  Eye, EyeOff, Lock, Bell, Globe, Camera
} from 'lucide-react';

// Custom Components
import Loader from '../../components/common/Loader';

// Redux Actions
import { 
  getUserDetails, 
  updateUserProfile, 
  resetUpdateProfile,
  changePassword,
  resetChangePassword,
  listAddresses,
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

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  console.log(user)

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
    console.log("shite");
    // navigate('/login');
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Headphones className="h-6 w-6 text-black" />
              <h1 className="text-2xl font-light tracking-tight text-black">
                Sound Wave <span className="font-medium">Audio</span>
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-gray-600 hover:text-black"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-100 bg-white shadow-none">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 border border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                    {user?.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-black">
                      {user?.first_name} {user?.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <Badge variant="outline" className="border-gray-200 text-gray-600">
                    <Award className="h-3 w-3 mr-1" />
                    {user?.loyalty_points || 0} Points
                  </Badge>
                </div>

                <Separator className="my-6" />

                <nav className="space-y-1">
                  <Button
                    variant={activeTab === 'profile' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Personal Information
                  </Button>
                  <Button
                    variant={activeTab === 'security' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield className="h-4 w-4 mr-3" />
                    Security
                  </Button>
                  <Button
                    variant={activeTab === 'addresses' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => setActiveTab('addresses')}
                  >
                    <MapPin className="h-4 w-4 mr-3" />
                    Addresses ({addresses?.results?.length || 0})
                  </Button>
                  <Button
                    variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => setActiveTab('orders')}
                  >
                    <Package className="h-4 w-4 mr-3" />
                    Order History
                  </Button>
                  <Button
                    variant={activeTab === 'notifications' ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm font-normal"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Notifications
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="border border-gray-100 bg-white shadow-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-medium text-black">Personal Information</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {updateSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
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
                              <FormLabel className="text-sm font-medium text-gray-700">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="First name"
                                  className="border-gray-200 bg-white text-black"
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
                              <FormLabel className="text-sm font-medium text-gray-700">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Last name"
                                  className="border-gray-200 bg-white text-black"
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
                            <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="email@example.com"
                                  className="pl-10 border-gray-200 bg-white text-black"
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
                            <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="+1 (555) 000-0000"
                                  className="pl-10 border-gray-200 bg-white text-black"
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
                            <FormLabel className="text-sm font-medium text-gray-700">Date of Birth</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type="date"
                                  className="pl-10 border-gray-200 bg-white text-black"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={updating}
                          className="bg-black text-white hover:bg-gray-800 border-0"
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
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="border border-gray-100 bg-white shadow-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-medium text-black">Security Settings</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Update your password and security preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {passwordSuccess && (
                    <Alert className="mb-6 border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-600">
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
                            <FormLabel className="text-sm font-medium text-gray-700">Current Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Enter current password"
                                  className="pl-10 border-gray-200 bg-white text-black"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
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
                            <FormLabel className="text-sm font-medium text-gray-700">New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showNewPassword ? 'text' : 'password'}
                                  placeholder="Enter new password"
                                  className="pl-10 border-gray-200 bg-white text-black"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
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
                            <FormLabel className="text-sm font-medium text-gray-700">Confirm New Password</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  placeholder="Confirm new password"
                                  className="pl-10 border-gray-200 bg-white text-black"
                                  {...field}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-400" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={changingPassword}
                          className="bg-black text-white hover:bg-gray-800 border-0"
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
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <Card className="border border-gray-100 bg-white shadow-none">
                <CardHeader className="border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-medium text-black">Address Book</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Manage your shipping and billing addresses
                      </CardDescription>
                    </div>
                    <Button className="bg-black text-white hover:bg-gray-800 border-0 text-sm">
                      <Edit2 className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingAddresses ? (
                    <div className="flex justify-center py-12">
                      <Loader />
                    </div>
                  ) : addressesError ? (
                    <Alert variant="destructive">
                      <AlertDescription>{addressesError}</AlertDescription>
                    </Alert>
                  ) : addresses?.count === 0 ? (
                    <div className="text-center py-12">
                      <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
                      <p className="text-gray-500 mb-6">Add your first address to get started</p>
                      <Button className="bg-black text-white hover:bg-gray-800 border-0">
                        Add Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {addresses?.results?.map((address) => (
                        <div key={address.id} className="border border-gray-100 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-black mb-1">{address.address_type}</h4>
                              {address.is_default && (
                                <Badge className="bg-gray-100 text-gray-600 border-0">Default</Badge>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-700">{address.street_address}</p>
                            {address.apartment && (
                              <p className="text-gray-700">Apt: {address.apartment}</p>
                            )}
                            <p className="text-gray-700">
                              {address.city}, {address.state} {address.postal_code}
                            </p>
                            <p className="text-gray-700">{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <Card className="border border-gray-100 bg-white shadow-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-medium text-black">Order History</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    View your past purchases and track current orders
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-100">
                          <TableHead className="text-sm font-medium text-gray-700">Order ID</TableHead>
                          <TableHead className="text-sm font-medium text-gray-700">Date</TableHead>
                          <TableHead className="text-sm font-medium text-gray-700">Total</TableHead>
                          <TableHead className="text-sm font-medium text-gray-700">Status</TableHead>
                          <TableHead className="text-sm font-medium text-gray-700"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* Note: You'll need to implement order actions and reducers */}
                        <TableRow className="border-b border-gray-50">
                          <TableCell className="text-sm text-gray-600">SWA-001234</TableCell>
                          <TableCell className="text-sm text-gray-600">Nov 15, 2024</TableCell>
                          <TableCell className="text-sm font-medium text-black">$1,299.00</TableCell>
                          <TableCell>
                            <Badge className="bg-green-50 text-green-600 border-0">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Delivered
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="text-gray-600">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                        {/* Add more orders as needed */}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                      You'll need to implement order actions and reducers to view your actual orders.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card className="border border-gray-100 bg-white shadow-none">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-lg font-medium text-black">Notification Preferences</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Manage how you receive updates from Sound Wave Audio
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                      <div>
                        <h4 className="font-medium text-black mb-1">Order Updates</h4>
                        <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                      </div>
                      <div className="h-6 w-11 bg-black border-0 rounded-none"></div>
                    </div>
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                      <div>
                        <h4 className="font-medium text-black mb-1">Promotional Emails</h4>
                        <p className="text-sm text-gray-500">Get updates on new products and sales</p>
                      </div>
                      <div className="h-6 w-11 bg-gray-200 border-0 rounded-none"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-black mb-1">Sound Wave Audio Newsletter</h4>
                        <p className="text-sm text-gray-500">Monthly newsletter with audio insights</p>
                      </div>
                      <div className="h-6 w-11 bg-black border-0 rounded-none"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 Sound Wave Audio. All rights reserved.</p>
            <p className="mt-2">Elevating your audio experience since 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;