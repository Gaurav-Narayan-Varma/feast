"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { authApi, AuthTokenType, handleApiError } from "@/utils/api";
import { AlertCircle } from "lucide-react";
import React, { useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ChefLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // const navigate = useNavigate();
  // const location = useLocation();

  // Get the redirect path from location state if available
  // const from = location.state?.from?.pathname || "/chef-dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // const response = await authApi.chefLogin({
      //   email: emailRef.current?.value || "",
      //   password: passwordRef.current?.value || "",
      // });

      // Store token in localStorage from the response
      // localStorage.setItem(AuthTokenType.CHEF, response.token);

      // Store chef information if available
      // if (response.chef) {
      //   localStorage.setItem("chefInfo", JSON.stringify(response.chef));
      // }

      toast.success("Login successful! Welcome back");

      // Navigate to the original requested URL or dashboard
      // navigate(from);
    } catch (error) {
      // handleApiError(error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ds-chef-50 to-ds-chef-100">
      <div className="m-auto w-full max-w-md p-8 rounded-xl bg-white shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ds-chef-800">
            Chef Login
          </h1>
          <p className="text-ds-chef-600 mt-2">Welcome back to Feast</p>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-ds-chef-700">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="your@email.com"
              ref={emailRef}
              className="w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-ds-chef-700">
                Password
              </Label>
              <Link
                href="/reset-password-request"
                className="text-sm text-ds-chef-600 hover:text-ds-chef-800 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              id="password"
              name="password"
              ref={passwordRef}
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-ds-chef-700 hover:bg-ds-chef-800 text-white"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-ds-chef-600">Don't have an account?</p>
          <Link
            href="/chef-create-account"
            className="inline-block mt-2 text-ds-chef-700 hover:text-ds-chef-900 font-medium hover:underline"
          >
            Sign up as a Chef
          </Link>
        </div>
      </div>
    </div>
  );
}
