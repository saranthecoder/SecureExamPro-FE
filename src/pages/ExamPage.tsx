import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExamStore } from '@/contexts/ExamStoreContext';
import { ExamAnswer, Question } from '@/types/exam';
import { useExamSecurity } from '@/hooks/useExamSecurity';
import { useExamTimer } from '@/hooks/useExamTimer';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Maximize,
  Send,
  Shield,
  X,
} from 'lucide-react';

const ExamPage = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { getExamByCode } = useExamStore();
  const exam = useMemo(() => getExamByCode(code || ''), [code, getExamByCode]);
  const questions = useMemo(() => exam?.questions || [], [exam]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExamAnswer[]>(
    questions.map((q) => ({ questionId: q.id, selectedOption: null }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [started, setStarted] = useState(false);

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    setShowConfirm(false);
    exitFullscreen();
  }, []);

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
    onDisqualify: handleSubmit,
  });

  const timer = useExamTimer(exam?.duration || 30, handleSubmit);

  const handleStart = () => {
    setStarted(true);
    enterFullscreen();
    timer.start();
  };

  const selectOption = (option: string) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selectedOption: option } : a
      )
    );
  };

  const currentQuestion: Question | undefined = questions[currentIndex];
  const answeredCount = answers.filter((a) => a.selectedOption).length;

  // Calculate score
  const score = useMemo(() => {
    if (!submitted) return 0;
    return questions.reduce((total, q, i) => {
      return total + (answers[i]?.selectedOption === q.correctAnswer ? q.marks : 0);
    }, 0);
  }, [submitted, questions, answers]);

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center animate-fade-in">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-warning" />
          <h2 className="mb-2 text-2xl font-bold">Exam Not Found</h2>
          <p className="mb-4 text-muted-foreground">The code "{code}" doesn't match any exam.</p>
          <Button variant="outline" onClick={() => navigate('/student')}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Submitted / Result screen
  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="mb-6 inline-flex rounded-full bg-success/10 p-4 text-success">
            <Shield className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Exam Submitted</h1>
          <p className="mb-6 text-muted-foreground">{exam.title}</p>
          <div className="mb-8 rounded-xl border bg-card p-6 shadow-card">
            <p className="text-sm text-muted-foreground">Your Score</p>
            <p className="mt-1 text-4xl font-extrabold">
              {score}<span className="text-lg text-muted-foreground">/{exam.totalMarks}</span>
            </p>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div>
                <p className="text-muted-foreground">Answered</p>
                <p className="font-semibold">{answeredCount}/{questions.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tab Switches</p>
                <p className={`font-semibold ${tabSwitchCount > 0 ? 'text-warning' : ''}`}>{tabSwitchCount}</p>
              </div>
            </div>
          </div>
          <Button onClick={() => navigate('/student')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Pre-start screen
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="w-full max-w-lg animate-fade-in text-center">
          <Shield className="mx-auto mb-4 h-12 w-12 text-accent" />
          <h1 className="mb-2 text-3xl font-bold">{exam.title}</h1>
          <p className="mb-6 text-muted-foreground">Code: {exam.code}</p>

          <div className="mb-8 rounded-xl border bg-card p-6 text-left shadow-card">
            <h3 className="mb-4 font-semibold">Exam Rules</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Duration: <strong className="text-foreground">{exam.duration} minutes</strong></li>
              <li>• Total Marks: <strong className="text-foreground">{exam.totalMarks}</strong></li>
              <li>• Questions: <strong className="text-foreground">{questions.length}</strong></li>
              <li>• The exam will enter <strong className="text-foreground">fullscreen mode</strong></li>
              <li>• Tab switching will trigger warnings (3 max before auto-submit)</li>
              <li>• Copy, paste, right-click, and keyboard shortcuts are disabled</li>
              <li>• The exam auto-submits when time runs out</li>
            </ul>
          </div>

          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-10"
            onClick={handleStart}
          >
            <Maximize className="mr-2 h-4 w-4" />
            Start Exam
          </Button>
        </div>
      </div>
    );
  }

  // Active exam
  return (
    <div className="exam-secure min-h-screen bg-background">
      {/* Warning overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm animate-fade-in rounded-xl border bg-card p-6 text-center shadow-elevated">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-warning" />
            <h3 className="mb-2 text-lg font-bold">Security Warning</h3>
            <p className="mb-4 text-sm text-muted-foreground">{warningMessage}</p>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={dismissWarning}>
              Return to Exam
            </Button>
          </div>
        </div>
      )}

      {/* Submit confirm */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm animate-fade-in rounded-xl border bg-card p-6 text-center shadow-elevated">
            <h3 className="mb-2 text-lg font-bold">Submit Exam?</h3>
            <p className="mb-1 text-sm text-muted-foreground">
              Answered: {answeredCount}/{questions.length}
            </p>
            <p className="mb-5 text-sm text-muted-foreground">
              Unanswered: {questions.length - answeredCount}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
                Cancel
              </Button>
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            <span className="font-semibold">{exam.title}</span>
          </div>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-sm font-bold ${
            timer.isLow ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-muted text-foreground'
          }`}>
            <Clock className="h-4 w-4" />
            {timer.formatted}
          </div>
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => setShowConfirm(true)}
          >
            <Send className="mr-1 h-4 w-4" /> Submit
          </Button>
        </div>
      </header>

      <div className="container mx-auto flex gap-6 px-4 py-6">
        {/* Question palette (sidebar) */}
        <div className="hidden w-48 shrink-0 md:block">
          <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-card">
            <p className="mb-3 text-sm font-medium text-muted-foreground">Questions</p>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                    i === currentIndex
                      ? 'bg-accent text-accent-foreground shadow-sm'
                      : answers[i]?.selectedOption
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-success/20 border border-success/30" /> Answered
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-muted border" /> Unanswered
              </div>
            </div>
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1">
          {currentQuestion && (
            <div className="animate-fade-in">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium">
                  {currentQuestion.marks} mark{currentQuestion.marks > 1 ? 's' : ''}
                </span>
              </div>

              <div className="rounded-xl border bg-card p-6 shadow-card">
                <h2 className="mb-6 text-lg font-semibold leading-relaxed">
                  {currentQuestion.question}
                </h2>
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const text = currentQuestion[`option${opt}` as keyof Question] as string;
                    const isSelected = answers[currentIndex]?.selectedOption === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => selectOption(opt)}
                        className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                          isSelected
                            ? 'border-accent bg-accent/5 ring-1 ring-accent'
                            : 'hover:bg-muted/50'
                        }`}
                      >
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {opt}
                        </span>
                        <span className="text-sm">{text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((i) => i - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                </Button>

                {/* Mobile palette */}
                <div className="flex gap-1 md:hidden">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`h-7 w-7 rounded text-xs font-medium ${
                        i === currentIndex
                          ? 'bg-accent text-accent-foreground'
                          : answers[i]?.selectedOption
                            ? 'bg-success/20 text-success'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((i) => i + 1)}
                >
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
