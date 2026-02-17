import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExamSecurity } from "@/hooks/useExamSecurity";
import { useExamTimer } from "@/hooks/useExamTimer";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

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
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [started, setStarted] = useState(false);

   //===================
  //Shuffler
  //===================
  const shuffleArray = (array: any[]) => {
    const arr = [...array]; // avoid mutating original
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

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

        // 🔀 Shuffle Questions
        const shuffledQuestions = shuffleArray(data.questions).map((q: any) => {
          // Convert options object → array
          const optionsArray = Object.entries(q.options).map(
            ([key, value]) => ({
              key,
              value,
            }),
          );

          // Shuffle options
          const shuffledOptions = shuffleArray(optionsArray);

          return {
            ...q,
            shuffledOptions,
          };
        });

        setExam({
          ...data,
          questions: shuffledQuestions,
        });

        const initialAnswers = shuffledQuestions.map((q: any) => ({
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
    if (submitting) return; // prevent double submit

    try {
      setSubmitting(true);

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
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setShowConfirm(false);
      exitFullscreen();
    } catch (error) {
      alert("Server error during submission");
    } finally {
      setSubmitting(false);
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

  const duration = exam?.duration ?? 0;

  // =======================
  // 🕒 TIMER HOOK
  // =======================

  const timer = useExamTimer(duration, () => submitExam(tabSwitchCount));

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
    <div className="min-h-screen bg-[#eef2f7] relative font-roboto">
      {/* STRUCTURED WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <div className="text-center opacity-[0.04] rotate-[-25deg]">
          <h1 className="text-[110px] font-extrabold tracking-widest text-gray-800 leading-none">
            SECURE EXAM PRO
          </h1>

          <p className="text-2xl font-semibold tracking-[0.4em] text-gray-800 mt-4">
            UNDER SR ECOSYSTEM
          </p>

          <p className="text-lg tracking-wide text-gray-800 mt-2">
            Developed by Saran Velmurugan
          </p>
        </div>
      </div>

      {/* LOADER */}
      {submitting && (
        <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* WARNING MODAL */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-md shadow-lg w-[350px] text-center">
            <AlertTriangle className="mx-auto mb-2 text-red-600" />
            <p className="mb-4 text-sm">{warningMessage}</p>
            <Button onClick={dismissWarning}>Return</Button>
          </div>
        </div>
      )}

      {/* CONFIRM SUBMIT */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white p-6 rounded-md shadow-lg w-[400px] text-center">
            <h3 className="mb-3 font-bold text-lg">Submit Examination?</h3>
            <p className="mb-4 text-sm">
              Answered: {answeredCount}/{questions.length}
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSubmit}
              >
                Final Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-[#0b3d91] text-white border-b shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* LEFT */}
          <div>
            <h1 className="text-lg font-semibold tracking-wide">
              Secure Exam Pro – Computer Based Test
            </h1>
            <p className="text-xs opacity-80">
              Under SR Ecosystem | Developed by Saran Velmurugan
            </p>
          </div>

          {/* TIMER */}
          <div
            className={`px-4 py-1 rounded-md font-medium ${
              timer.isLow
                ? "bg-red-500 text-white animate-pulse"
                : "bg-white text-[#0b3d91]"
            }`}
          >
            <Clock className="inline h-4 w-4 mr-1" />
            {timer.formatted}
          </div>

          {/* SUBMIT */}
          <Button
            onClick={() => setShowConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="mr-1 h-4 w-4" />
            Submit Exam
          </Button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto flex gap-6 px-6 py-6">
        {/* QUESTION PALETTE */}
        <div className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-24 bg-white border border-gray-300 p-4 rounded-md shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-600">
              Question Palette
            </p>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-9 w-9 text-sm font-medium rounded-sm border transition ${
                    i === currentIndex
                      ? "bg-[#0b3d91] text-white border-[#0b3d91]"
                      : answers[i]?.selectedOption
                        ? "bg-green-100 text-green-700 border-green-400"
                        : "bg-white border-gray-300 hover:bg-gray-100"
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
          <div className="mb-4 text-sm font-medium text-gray-600">
            Question {currentIndex + 1} of {questions.length}
          </div>

          <div className="bg-white border border-gray-300 p-6 shadow-sm rounded-md">
            <h2 className="mb-6 text-lg font-semibold text-gray-800">
              Q{currentIndex + 1}. {currentQuestion.question}
            </h2>

            {currentQuestion.shuffledOptions.map((opt: any, index: number) => {
              const isSelected =
                answers[currentIndex]?.selectedOption === opt.key;

              return (
                <button
                  key={index}
                  onClick={() => selectOption(opt.key)}
                  className={`w-full text-left px-4 py-3 mb-3 border rounded-md transition-all ${
                    isSelected
                      ? "border-[#0b3d91] bg-blue-50 font-medium"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <strong>{String.fromCharCode(65 + index)}.</strong>{" "}
                  {opt.value}
                </button>
              );
            })}

          </div>

          {/* NAVIGATION */}
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

      {/* FOOTER STATUS BAR */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 px-6 py-2 text-sm flex justify-between">
        <div>
          Answered: <span className="font-semibold">{answeredCount}</span>
        </div>
        <div>
          Total Questions:{" "}
          <span className="font-semibold">{questions.length}</span>
        </div>
      </footer>
    </div>
  );
};

export default ExamPage;
