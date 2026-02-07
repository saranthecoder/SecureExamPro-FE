import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all required fields");
      return;
    }

    let success = false;

    if (isLogin) {
      success = await login(email, password, "student");
    } else {
      success = await signup(name, email, password, "student");
    }

    if (success) {
      // Backend decides role
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } else {
      setError(isLogin ? "Invalid email or password" : "Signup failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 lg:flex items-center justify-center text-white">
        <div className="text-center px-12">
          <Shield className="mx-auto mb-6 h-16 w-16 text-white" />
          <h1 className="text-4xl font-extrabold mb-3">
            SecureExam Pro
          </h1>
          <p className="text-white/80">
            Secure online examination platform with advanced monitoring.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md bg-card shadow-xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">
              {isLogin ? "Welcome Back !" : "Create Your Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin
                ? "Login to continue your exam"
                : "Sign up to start taking exams"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                  onClick={() => setIsLogin(false)}
                >
                  Sign Up
                </span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <span
                  className="text-indigo-600 font-medium cursor-pointer hover:underline"
                  onClick={() => setIsLogin(true)}
                >
                  Login
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
