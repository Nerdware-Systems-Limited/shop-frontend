import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus } from "lucide-react";

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


  // Redux state
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, navigate, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setLocalMessage("Passwords do not match");
      return;
    }
    setLocalMessage("");

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

  return (
    <div className="flex justify-center items-center min-h-screen bg-white text-black px-4">
      <Card className="w-full max-w-md shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            Create Your Account
            <span className="block text-sm font-normal text-gray-500 mt-1">
              Sound Wave Audio
            </span>
          </CardTitle>
        </CardHeader>

        <form onSubmit={submitHandler}>
          <CardContent className="space-y-4">

            {/* Local validation message */}
            {localMessage && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{localMessage}</AlertDescription>
              </Alert>
            )}

            {/* API error */}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Registration Failed</AlertTitle>
                <AlertDescription>
                  {typeof error === "string" ? error : "Check your details"}
                </AlertDescription>
              </Alert>
            )}

            {/* Name */}
            <div className="space-y-1">
              <Label>First Name</Label>
              <Input
                type="text"
                placeholder="John"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white text-black border-gray-300"
                required
              />
            </div>
            <div className="space-y-1">
                <Label>Last Name</Label>
                <Input
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white text-black border-gray-300"
                    required
                />
             </div>

            {/* Email */}
            <div className="space-y-1">
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black border-gray-300"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-black border-gray-300"
                required
              />
            </div>

            {/* Confirm */}
            <div className="space-y-1">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="•••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="bg-white text-black border-gray-300"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full text-white bg-black hover:bg-gray-900"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Register
                </div>
              )}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-black underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Register;