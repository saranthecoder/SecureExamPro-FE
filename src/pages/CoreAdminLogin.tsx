import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DEFAULT_ADMIN = {
  username: "coreadmin",
  password: "Secure@123"
};

const CoreAdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      username === DEFAULT_ADMIN.username &&
      password === DEFAULT_ADMIN.password
    ) {
      localStorage.setItem("coreAdmin", "true");
      navigate("/coreadmin");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm bg-card p-8 rounded-2xl shadow-xl">
        <div className="text-center mb-6">
          <Shield className="mx-auto h-10 w-10 text-accent mb-2" />
          <h2 className="text-2xl font-bold">Core Admin Access</h2>
          <p className="text-sm text-muted-foreground">
            Authorized personnel only
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button className="w-full bg-accent hover:bg-accent/90">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CoreAdminLogin;
