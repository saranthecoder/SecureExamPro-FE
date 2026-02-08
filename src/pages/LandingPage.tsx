import { Shield, Clock, Users, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Shield,
    title: "Advanced Anti-Cheat",
    description:
      "Tab switch detection, fullscreen enforcement, and activity monitoring to maintain exam integrity.",
  },
  {
    icon: Clock,
    title: "Smart Timer Engine",
    description:
      "Real-time countdown with automatic submission when time expires.",
  },
  {
    icon: Users,
    title: "Live Exam Monitoring",
    description:
      "Track student participation and detect suspicious behavior instantly.",
  },
  {
    icon: Lock,
    title: "Secure Exam Environment",
    description:
      "Copy, paste, right-click, and shortcut keys disabled for maximum security.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      {/* ================= NAVBAR ================= */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-50">
        <nav className="container mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SecureExam Pro Logo" className="h-12 w-12" />
            <span className="text-3xl font-bold tracking-tight">
              SecureExam Pro
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/coreadmin-login")}
            >
              Admin Login
            </Button>

            <Button
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={() => navigate("/login")}
            >
              Join as Student
            </Button>
          </div>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative py-32 overflow-hidden">

        {/* Animated Background Glow */}
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[120px] animate-pulse"></div>

        <div className="container relative mx-auto px-6 text-center">
          <div className="mx-auto max-w-3xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <Shield className="h-4 w-4" />
              Secure · Scalable · Reliable
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Conduct Exams
              <br />
              <span className="text-accent">Without Compromise.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
              A professional online examination system built with strong
              anti-cheat mechanisms, live monitoring, and seamless student
              experience.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-base font-semibold"
                onClick={() => navigate("/login")}
              >
                Join as Student
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="px-8 text-base font-semibold"
                onClick={() => navigate("/coreadmin-login")}
              >
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PREMIUM ANIMATED STRIP ================= */}
<section className="relative overflow-hidden bg-emerald-600 py-5 text-white">

  {/* Edge Fade Effect */}
  <div className="pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-emerald-600 to-transparent z-10"></div>
  <div className="pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-emerald-600 to-transparent z-10"></div>

  <div className="relative flex overflow-hidden">
    <div className="flex min-w-full animate-marquee items-center gap-12 whitespace-nowrap">
      
      {/* Item 1 */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Shield className="h-5 w-5" />
        Fullscreen Enforcement
      </div>

      {/* Item 2 */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Clock className="h-5 w-5" />
        Auto Submission Engine
      </div>

      {/* Item 3 */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Users className="h-5 w-5" />
        Live Student Monitoring
      </div>

      {/* Item 4 */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Lock className="h-5 w-5" />
        Keyboard & Copy Protection
      </div>

      {/* Item 5 */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Shield className="h-5 w-5" />
        Tab Switch Detection
      </div>

      {/* Duplicate for seamless loop */}
      <div className="flex items-center gap-3 text-sm font-medium">
        <Shield className="h-5 w-5" />
        Fullscreen Enforcement
      </div>

      <div className="flex items-center gap-3 text-sm font-medium">
        <Clock className="h-5 w-5" />
        Auto Submission Engine
      </div>

      <div className="flex items-center gap-3 text-sm font-medium">
        <Users className="h-5 w-5" />
        Live Student Monitoring
      </div>

      <div className="flex items-center gap-3 text-sm font-medium">
        <Lock className="h-5 w-5" />
        Keyboard & Copy Protection
      </div>

    </div>
  </div>
</section>


      {/* ================= FEATURES ================= */}
      <section className="relative py-28 bg-muted/40">
        <div className="container mx-auto px-6">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight">
            Enterprise-Grade Security
          </h2>

          <p className="mx-auto mb-16 max-w-lg text-center text-muted-foreground">
            Designed for institutions, academies, and organizations that value
            fairness and exam integrity.
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-card p-8 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-4 text-accent transition-all group-hover:scale-110">
                  <f.icon className="h-7 w-7" />
                </div>

                <h3 className="mb-3 font-semibold text-lg">
                  {f.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative py-24 text-center overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-green-600/10 blur-2xl"></div>

        <div className="relative container mx-auto px-6">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to conduct secure exams?
          </h2>

          <p className="mb-8 text-muted-foreground">
            Join SecureExam Pro and elevate your examination system.
          </p>

          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-10"
            onClick={() => navigate("/login")}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-card py-10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <div>© 2026 SecureExam Pro</div>

          <div className="text-center">
            Developed by{" "}
            <span className="font-semibold text-foreground">
              Saran Velmurugan
            </span>
            <br />
            Under <span className="font-semibold">SR Ecosystem</span>
          </div>

          <div>Secure Online Examination Platform</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
