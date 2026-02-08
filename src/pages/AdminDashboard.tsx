import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "@/config/api";
import CreateExamDialog from "@/components/CreateExamDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  LogOut,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
  try {
    const res = await fetch(`${BASE_URL}/exam/all`);
    const data = await res.json();

    // Ensure exams is always array
    if (Array.isArray(data)) {
      setExams(data);
    } else if (Array.isArray(data.exams)) {
      setExams(data.exams);
    } else {
      setExams([]);
    }
  } catch (error) {
    console.error("Failed to fetch exams");
    setExams([]);
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem("coreAdmin");
    navigate("/coreadmin-login");
  };

  const calculateTotalMarks = (questions: any[]) => {
    if (!questions) return 0;
    return questions.reduce((sum, q) => sum + (q.marks || 0), 0);
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
              Core-Admin
            </Badge>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="mr-1 h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Exams</p>
                <p className="mt-1 text-2xl font-bold">{exams.length}</p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3 text-accent">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="mt-1 text-2xl font-bold">
                  {exams.reduce(
                    (sum, exam) => sum + (exam.questions?.length || 0),
                    0
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3 text-accent">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Marks</p>
                <p className="mt-1 text-2xl font-bold">
                  {exams.reduce(
                    (sum, exam) =>
                      sum + calculateTotalMarks(exam.questions),
                    0
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3 text-accent">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Exams Section */}
        <div className="animate-fade-in">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Examinations</h2>
            <CreateExamDialog onExamCreated={fetchExams} />
          </div>

          {loading ? (
            <p className="text-muted-foreground">Loading exams...</p>
          ) : exams.length === 0 ? (
            <p className="text-muted-foreground">No exams created yet.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-sm text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Code</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Questions
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                      Total Marks
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((exam) => (
                    <tr
                      key={exam._id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium">
                        {exam.title}
                      </td>

                      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">
                        {exam.examCode}
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {exam.duration} min
                      </td>

                      <td className="px-4 py-3 text-sm">
                        {exam.questions?.length || 0}
                      </td>

                      <td className="px-4 py-3 text-sm font-semibold">
                        {calculateTotalMarks(exam.questions)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
