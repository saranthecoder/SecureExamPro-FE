import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, LogOut, Play } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [examCode, setExamCode] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleJoinExam = () => {
    if (examCode.trim()) {
      navigate(`/exam/${examCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold">SecureExam Pro</span>
            <Badge variant="secondary" className="ml-2 text-xs">Student</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto flex items-center justify-center px-6" style={{ minHeight: 'calc(100vh - 65px)' }}>
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
              placeholder="Enter exam code (e.g. DSA2024)"
              value={examCode}
              onChange={(e) => setExamCode(e.target.value.toUpperCase())}
              className="text-center font-mono text-lg tracking-widest"
              onKeyDown={(e) => e.key === 'Enter' && handleJoinExam()}
            />
            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90 px-6"
              onClick={handleJoinExam}
              disabled={!examCode.trim()}
            >
              Join
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Demo: Try code <span className="font-mono font-medium">DSA2024</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
