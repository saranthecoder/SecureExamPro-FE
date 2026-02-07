import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { useExamTimer } from "@/hooks/useExamTimer";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Maximize,
  Send,
  Shield,
} from "lucide-react";
import BASE_URL from "@/config/api";

const ExamPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [started, setStarted] = useState(false);

  // 🔥 FETCH EXAM FROM BACKEND
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(`${BASE_URL}/exam/${code}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Exam unavailable");
          navigate("/student");
          return;
        }

        setExam(data);

        const initialAnswers = data.questions.map((q: any) => ({
          questionId: q._id,
          selectedOption: null,
        }));

        setAnswers(initialAnswers);
      } catch (err) {
        alert("Server error");
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };

    if (code) fetchExam();
  }, [code, navigate]);

  // =======================
  // 🔥 SAFE SUBMIT FUNCTION (NO CIRCULAR DEPENDENCY)
  // =======================

  const submitExam = async (finalTabSwitchCount: number) => {
    try {
      const parsedUser = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        studentName: parsedUser.name,
        studentEmail: parsedUser.email,
        answers,
        terminated: finalTabSwitchCount >= 3,
        tabSwitch: finalTabSwitchCount > 0,
        tabSwitchCount: finalTabSwitchCount,
      };

      const res = await fetch(`${BASE_URL}/exam/submit/${exam.examCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Submission failed");
        return;
      }

      console.log("Submission response:", data);

      setSubmitted(true);
      setShowConfirm(false);
      exitFullscreen();
    } catch (error) {
      alert("Server error during submission");
    }
  };

  // =======================
  // 🔐 SECURITY HOOK
  // =======================

  const {
    tabSwitchCount,
    showWarning,
    warningMessage,
    dismissWarning,
    enterFullscreen,
    exitFullscreen,
  } = useExamSecurity({
    enabled: started && !submitted,
    maxWarnings: 3,
    onDisqualify: () => submitExam(tabSwitchCount),
  });

  // =======================
  // 🕒 TIMER HOOK
  // =======================

  const timer = useExamTimer(exam?.duration || 30, () =>
    submitExam(tabSwitchCount),
  );

  // =======================
  // 🖱 NORMAL SUBMIT BUTTON
  // =======================

  const handleSubmit = () => {
    submitExam(tabSwitchCount);
  };

  const handleStart = () => {
    setStarted(true);
    enterFullscreen();
    timer.start();
  };

  const selectOption = (option: string) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selectedOption: option } : a,
      ),
    );
  };

  const questions = exam?.questions || [];
  const currentQuestion = questions[currentIndex];
  const answeredCount = answers.filter((a) => a.selectedOption).length;

  if (loading) return null;

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-warning" />
          <h2 className="mb-2 text-2xl font-bold">Exam Not Found</h2>
          <Button onClick={() => navigate("/student")}>Go Back</Button>
        </div>
      </div>
    );
  }

  // =======================
  // RESULT SCREEN
  // =======================
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 inline-flex rounded-full bg-success/10 p-4 text-success">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Exam Submitted</h1>
          <p className="mb-6 text-muted-foreground">{exam.title}</p>

          <div className="mb-8 rounded-xl border bg-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground">Answered</p>
            <p className="mt-1 text-3xl font-bold">
              {answeredCount}/{questions.length}
            </p>

            <div className="mt-4 text-sm">
              Tab Switches:{" "}
              <span className={tabSwitchCount > 0 ? "text-warning" : ""}>
                {tabSwitchCount}
              </span>
            </div>
          </div>

          <Button onClick={() => navigate("/student")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // =======================
  // PRE START SCREEN
  // =======================
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-lg text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h1 className="mb-2 text-3xl font-bold">{exam.title}</h1>
          <p className="mb-6 text-muted-foreground">Code: {exam.examCode}</p>

          <div className="mb-8 rounded-xl border bg-card p-6 text-left shadow-card">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Duration: {exam.duration} minutes</li>
              <li>• Fullscreen enforced</li>
              <li>• 3 tab switches → auto submit</li>
              <li>• Auto submit when time ends</li>
            </ul>
          </div>

          <Button
            size="lg"
            className="bg-accent text-accent-foreground"
            onClick={handleStart}
          >
            <Maximize className="mr-2 h-4 w-4" />
            Start Exam
          </Button>
        </div>
      </div>
    );
  }

  // =======================
  // ACTIVE EXAM
  // =======================
  return (
    <div className="min-h-screen bg-background">
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card p-6 rounded-xl text-center">
            <AlertTriangle className="mx-auto mb-2 text-warning" />
            <p>{warningMessage}</p>
            <Button onClick={dismissWarning}>Return</Button>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card p-6 rounded-xl text-center">
            <h3 className="mb-3 font-bold">Submit Exam?</h3>
            <p className="mb-4 text-sm">
              Answered: {answeredCount}/{questions.length}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 border-b bg-card p-4 flex justify-between">
        <span className="font-semibold">{exam.title}</span>

        <div
          className={`px-3 py-1 rounded ${
            timer.isLow ? "bg-destructive/20 text-destructive" : ""
          }`}
        >
          <Clock className="inline h-4 w-4 mr-1" />
          {timer.formatted}
        </div>

        <Button onClick={() => setShowConfirm(true)}>
          <Send className="mr-1 h-4 w-4" />
          Submit
        </Button>
      </header>

      <div className="container mx-auto flex gap-6 px-4 py-6">
        {/* SIDE QUESTION BOXES */}
        <div className="hidden w-48 shrink-0 md:block">
          <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-card">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              Questions
            </p>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-9 w-9 rounded-lg text-sm ${
                    i === currentIndex
                      ? "bg-accent text-accent-foreground"
                      : answers[i]?.selectedOption
                        ? "bg-success/20 text-success"
                        : "bg-muted"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION AREA */}
        <div className="flex-1">
          <div className="mb-6">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h2 className="mb-6">{currentQuestion.question}</h2>

            {(["A", "B", "C", "D"] as const).map((opt) => {
              const text = currentQuestion.options[opt];
              const isSelected = answers[currentIndex]?.selectedOption === opt;

              return (
                <button
                  key={opt}
                  onClick={() => selectOption(opt)}
                  className={`w-full text-left p-3 mb-3 border rounded ${
                    isSelected ? "border-accent bg-accent/10" : ""
                  }`}
                >
                  <strong>{opt}.</strong> {text}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <Button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
