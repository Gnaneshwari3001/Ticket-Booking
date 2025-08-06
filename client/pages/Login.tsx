import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Train,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  User,
  Calendar,
  MapPin,
  Shield,
  CheckCircle,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const { login, signup, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      setSuccess("Login successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      setError(error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(email, password, {
        displayName: `${firstName} ${lastName}`,
        phoneNumber: phone,
        dateOfBirth
      });
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/"), 1000);
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      await resetPassword(email);
      setSuccess("Password reset email sent!");
    } catch (error: any) {
      setError(error.message || "Failed to send reset email");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-railway-blue/5 via-background to-railway-orange/5 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-6">
          <div className="flex items-center space-x-3">
            <div className="bg-railway-blue p-3 rounded-xl">
              <Train className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">RailEase Portal</h1>
              <p className="text-muted-foreground">Your trusted railway booking partner</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-railway-green" />
              <span className="text-sm">Book tickets 120 days in advance</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-railway-green" />
              <span className="text-sm">Instant confirmation & e-tickets</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-railway-green" />
              <span className="text-sm">24/7 customer support</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-railway-green" />
              <span className="text-sm">Secure payment gateway</span>
            </div>
          </div>

          <div className="bg-railway-blue/10 p-6 rounded-xl">
            <h3 className="font-semibold mb-2">Quick Tip</h3>
            <p className="text-sm text-muted-foreground">
              Book your tickets during off-peak hours for better availability.
              Tatkal booking opens at 10:00 AM for AC classes and 11:00 AM for non-AC.
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-muted-foreground">Sign in to your RailEase account</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login" className="space-y-4">
                {/* Error/Success Messages */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  {/* Login Method Toggle */}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant={loginMethod === "email" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLoginMethod("email")}
                      className="flex-1"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button
                      type="button"
                      variant={loginMethod === "phone" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLoginMethod("phone")}
                      className="flex-1"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Mobile
                    </Button>
                  </div>

                  {/* Email/Phone Input */}
                  <div className="space-y-2">
                    <Label htmlFor="login-credential">
                      {loginMethod === "email" ? "Email Address" : "Mobile Number"}
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-credential"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                      {loginMethod === "email" ? (
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember" className="text-sm">Remember me</Label>
                    </div>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-railway-blue hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                {/* OTP Login */}
                <Button variant="outline" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Login with OTP
                </Button>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative">
                      <Input
                        id="dob"
                        type="date"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        required
                        className="pl-10"
                      />
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        required
                        className="pl-10 pr-10"
                      />
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link to="/terms" className="text-railway-blue hover:underline">
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-railway-blue hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  {/* Signup Button */}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg flex items-start space-x-3">
              <Shield className="h-5 w-5 text-railway-blue mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Secure & Protected</p>
                <p className="text-xs text-muted-foreground">
                  Your data is encrypted and protected with bank-level security.
                  We never share your information with third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
