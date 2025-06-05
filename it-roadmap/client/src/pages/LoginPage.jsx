"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { typeText } from "../lib/animations";
import { Alert, AlertDescription } from "../components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, devMode } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply typing effect to title
    typeText(".login-title", null, 800);

    // Animation temporarily disabled
    /* Subtle card animation
    const loginCard = document.querySelector(".login-card");
    if (loginCard) {
      // Animation code removed due to compatibility issues
    } */
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ email, password });
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">

      <Card className="w-full max-w-md login-card">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl font-bold text-primary login-title">
            Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            {devMode && (
              <Alert className="bg-yellow-50 border border-yellow-300 text-yellow-700">
                <InfoIcon className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700 text-xs">
                  Development mode active. Any email/password will work.
                  {email.includes("admin") && (
                    <span className="block mt-1 font-bold">
                      Using "admin" in email will create an admin account.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required

              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:text-primary/90"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required

              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col pt-2">
            <Button
              type="submit"
              className="w-full"
              variant="default"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary/90"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
