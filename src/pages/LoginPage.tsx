import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'student'>('student');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    const success = login(email, password, role);
    if (success) {
      navigate(role === 'admin' ? '/admin' : '/student');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 bg-gradient-hero lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="px-12 text-center">
          <Shield className="mx-auto mb-6 h-16 w-16 text-accent" />
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-primary-foreground">
            SecureExam Pro
          </h1>
          <p className="text-primary-foreground/60">
            Secure online examination platform with advanced proctoring
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-8 lg:hidden flex items-center gap-2 justify-center">
            <Shield className="h-7 w-7 text-accent" />
            <span className="text-xl font-bold">SecureExam Pro</span>
          </div>

          <h2 className="mb-1 text-2xl font-bold">Welcome back</h2>
          <p className="mb-8 text-sm text-muted-foreground">Sign in to your account</p>

          {/* Role toggle */}
          <div className="mb-6 flex rounded-lg border bg-muted p-1">
            {(['student', 'admin'] as const).map((r) => (
              <button
                key={r}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  role === r
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setRole(r)}
                type="button"
              >
                {r === 'admin' ? 'Admin' : 'Student'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={role === 'admin' ? 'admin@secureexam.com' : 'student@secureexam.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo: Use any email/password. Select role above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
