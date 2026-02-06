import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { mockResults, mockActiveStudents } from '@/data/mockData';
import { useExamStore } from '@/contexts/ExamStoreContext';
import CreateExamDialog from '@/components/CreateExamDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  LogOut,
  FileText,
  Users,
  BarChart3,
  Eye,
  Download,
} from 'lucide-react';

type Tab = 'exams' | 'results' | 'monitor';

const statusColor = {
  active: 'bg-success/10 text-success',
  upcoming: 'bg-warning/10 text-warning',
  completed: 'bg-muted text-muted-foreground',
};

const studentStatusColor = {
  active: 'bg-success/10 text-success',
  'tab-switched': 'bg-warning/10 text-warning',
  disqualified: 'bg-destructive/10 text-destructive',
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { exams } = useExamStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('exams');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-accent" />
            <span className="text-lg font-bold">SecureExam Pro</span>
            <Badge variant="secondary" className="ml-2 text-xs">Admin</Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { label: 'Total Exams', value: exams.length, icon: FileText },
            { label: 'Students', value: mockResults.length, icon: Users },
            { label: 'Avg Score', value: '75%', icon: BarChart3 },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                </div>
                <div className="rounded-lg bg-accent/10 p-3 text-accent">
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg border bg-muted p-1">
          {([
            { key: 'exams', label: 'Exams', icon: FileText },
            { key: 'results', label: 'Results', icon: BarChart3 },
            { key: 'monitor', label: 'Live Monitor', icon: Eye },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                tab === t.key
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Exams Tab */}
        {tab === 'exams' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Examinations</h2>
              <CreateExamDialog />
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-sm text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">Code</th>
                    <th className="px-4 py-3 text-left font-medium">Duration</th>
                    <th className="px-4 py-3 text-left font-medium">Marks</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {exams.map((exam) => (
                    <tr key={exam.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium">{exam.title}</td>
                      <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{exam.code}</td>
                      <td className="px-4 py-3 text-sm">{exam.duration} min</td>
                      <td className="px-4 py-3 text-sm">{exam.totalMarks}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusColor[exam.status]}`}>
                          {exam.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {tab === 'results' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Student Results</h2>
              <Button variant="outline" size="sm">
                <Download className="mr-1 h-4 w-4" /> Export Excel
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-sm text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Student</th>
                    <th className="px-4 py-3 text-left font-medium">Exam</th>
                    <th className="px-4 py-3 text-left font-medium">Score</th>
                    <th className="px-4 py-3 text-left font-medium">Tab Switches</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockResults.map((r) => (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{r.studentName}</p>
                          <p className="text-xs text-muted-foreground">{r.studentEmail}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{r.examTitle}</td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        {r.score}/{r.totalMarks}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={r.tabSwitchCount > 0 ? 'text-warning font-medium' : ''}>
                          {r.tabSwitchCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          r.status === 'completed' ? 'bg-success/10 text-success' :
                          r.status === 'disqualified' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monitor Tab */}
        {tab === 'monitor' && (
          <div className="animate-fade-in">
            <h2 className="mb-4 text-xl font-semibold">Live Monitoring — DSA Exam</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockActiveStudents.map((s) => (
                <div key={s.studentId} className="rounded-xl border bg-card p-5 shadow-card">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium">{s.studentName}</span>
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${
                      s.status === 'active' ? 'bg-success animate-pulse-ring' :
                      s.status === 'tab-switched' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${studentStatusColor[s.status]}`}>
                    {s.status.replace('-', ' ')}
                  </span>
                  {s.tabSwitchCount > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Tab switches: {s.tabSwitchCount}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
