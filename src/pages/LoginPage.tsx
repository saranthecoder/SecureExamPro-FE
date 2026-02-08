import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import Loader from "@/components/Loader";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    let success = false;

    if (isLogin) {
      success = await login(email, password, "student");
    } else {
      success = await signup(name, email, password, "student");
    }

    if (success) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

      if (storedUser.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } else {
      setError(isLogin ? "Invalid email or password" : "Signup failed");
    }

    setLoading(false);
  };

  return (
<>
    {loading && <Loader />}
    <div className="flex min-h-screen bg-background">
      {/* ================= LEFT BRAND SECTION ================= */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-emerald-700 via-green-700 to-emerald-900 lg:flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

        <div className="relative z-10 text-center px-12 max-w-md">
          <Shield className="mx-auto mb-6 h-16 w-16 text-white" />

          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">
            SecureExam Pro
          </h1>

          <p className="text-white/80 mb-6">
            Enterprise-grade online examination platform with advanced
            anti-cheat monitoring and secure proctoring.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm">
            Secure • Proctored • Reliable
          </div>

          <div className="mt-12 text-sm text-white/70">
            Developed by <span className="font-semibold">Saran Velmurugan</span>
            <br />
            Under <span className="font-semibold">SR Ecosystem</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM SECTION ================= */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl border bg-card p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            <p className="text-sm text-muted-foreground mt-2">
              {isLogin
                ? "Login to access your exams"
                : "Register to begin secure assessments"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <Label className="text-sm font-medium">Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                  />
              </div>
            )}

            <div>
              <Label className="text-sm font-medium">Email</Label>
              <Input
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2"
                />
            </div>

            <div>
              <Label className="text-sm font-medium">Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2"
                />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5"
            >
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span
                  className="text-emerald-600 font-semibold cursor-pointer hover:underline"
                  onClick={() => setIsLogin(false)}
                  >
                  Create one
                </span>
              </>
            ) : (
              <>
                Already registered?{" "}
                <span
                  className="text-emerald-600 font-semibold cursor-pointer hover:underline"
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
            </>
  );
};

export default AuthPage;
