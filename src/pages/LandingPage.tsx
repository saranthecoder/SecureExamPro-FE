import { Shield, Clock, Users, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    icon: Shield,
    title: 'Anti-Cheat Protection',
    description: 'Tab switch detection, copy-paste blocking, and fullscreen enforcement.',
  },
  {
    icon: Clock,
    title: 'Timed Assessments',
    description: 'Auto-submit on time expiry with live countdown timer.',
  },
  {
    icon: Users,
    title: 'Live Monitoring',
    description: 'Real-time student activity tracking during exams.',
  },
  {
    icon: Lock,
    title: 'Secure Environment',
    description: 'Keyboard shortcuts disabled, right-click blocked, text selection prevented.',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="bg-gradient-hero text-primary-foreground">
        <nav className="container mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-accent" />
            <span className="text-xl font-bold tracking-tight">SecureExam Pro</span>
          </div>
          <Button
            variant="outline"
            className="border-accent/40 text-accent hover:bg-accent hover:text-accent-foreground"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </nav>

        <div className="container mx-auto px-6 pb-24 pt-20 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <Shield className="h-3.5 w-3.5" />
              Secure · Reliable · Proctored
            </div>
            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Online Exams,
              <br />
              <span className="text-accent">Cheat-Proof.</span>
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-primary-foreground/70">
              Conduct secure online examinations with advanced anti-cheat protection,
              real-time monitoring, and automated grading.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold"
                onClick={() => navigate('/login')}
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Enterprise-Grade Security
          </h2>
          <p className="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
            Every feature designed to ensure exam integrity and fair assessment.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border bg-card p-6 shadow-card transition-all hover:shadow-elevated"
              >
                <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3 text-accent">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto flex items-center justify-between px-6 text-sm text-muted-foreground">
          <span>© 2024 SecureExam Pro</span>
          <span>Built for secure assessments</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
