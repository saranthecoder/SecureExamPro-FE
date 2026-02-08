import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Play } from "lucide-react";

import BASE_URL from "@/config/api";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [examCode, setExamCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Protect Route
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleJoinExam = async () => {
    const trimmedCode = examCode.trim().toUpperCase();

    if (!trimmedCode) {
      setError("Please enter exam code");
      return;
    }

    const parsedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!parsedUser?.email) {
      setError("User session expired. Please login again.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/exam/${trimmedCode}?email=${parsedUser.email}`,  
      );

      const data = await res.json();

      // 🚨 If already attempted (403)
      if (res.status === 403) {
        setError(data.message);
        return;
      }

      if (!res.ok) {
        setError(data.message || "Invalid exam code");
        return;
      }

      // Store exam code
      localStorage.setItem("currentExamCode", trimmedCode);

      navigate(`/exam/${trimmedCode}`);
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SecureExam Pro Logo" className="h-12 w-12" />
            <span className="text-lg font-bold">SecureExam Pro</span>
            <Badge variant="secondary" className="ml-2 text-xs">
              Student
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div
        className="container mx-auto flex items-center justify-center px-6"
        style={{ minHeight: "calc(100vh - 65px)" }}
      >
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="mb-6 inline-flex rounded-full bg-accent/10 p-4 text-accent">
            <Play className="h-8 w-8" />
          </div>

          <h1 className="mb-2 text-3xl font-bold">Join Exam</h1>

          <p className="mb-8 text-muted-foreground">
            Enter the exam code provided by your instructor to begin.
          </p>

          <div className="flex gap-3">
            <Input
              placeholder="Enter exam code (e.g. DSA2026)"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value.toUpperCase())}
              className="text-center font-mono text-lg tracking-widest"
              onKeyDown={(e) => e.key === "Enter" && handleJoinExam()}
            />

            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-6"
              onClick={handleJoinExam}
              disabled={!examCode.trim() || loading}
            >
              {loading ? "Checking..." : "Join"}
            </Button>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
