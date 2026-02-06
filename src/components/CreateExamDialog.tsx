import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Question, Exam } from '@/types/exam';
import { useExamStore } from '@/contexts/ExamStoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CreateExamDialog = () => {
  const { addExam } = useExamStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [duration, setDuration] = useState('60');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [fileName, setFileName] = useState('');
  const [parseError, setParseError] = useState('');

  const resetForm = () => {
    setTitle('');
    setCode('');
    setDuration('60');
    setStartTime('');
    setEndTime('');
    setQuestions([]);
    setFileName('');
    setParseError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError('');

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
          setParseError('Excel file is empty.');
          return;
        }

        const parsed: Question[] = rows.map((row, i) => ({
          id: `q_${Date.now()}_${i}`,
          question: String(row['Question'] || row['question'] || ''),
          optionA: String(row['Option A'] || row['optionA'] || row['option A'] || ''),
          optionB: String(row['Option B'] || row['optionB'] || row['option B'] || ''),
          optionC: String(row['Option C'] || row['optionC'] || row['option C'] || ''),
          optionD: String(row['Option D'] || row['optionD'] || row['option D'] || ''),
          correctAnswer: String(row['Correct Answer'] || row['correctAnswer'] || row['correct answer'] || '').toUpperCase(),
          marks: Number(row['Marks'] || row['marks'] || 1),
        }));

        const invalid = parsed.filter(
          (q) => !q.question || !q.optionA || !q.optionB || !q.correctAnswer
        );
        if (invalid.length > 0) {
          setParseError(`${invalid.length} row(s) have missing fields. Please check your Excel.`);
        }

        setQuestions(parsed.filter((q) => q.question && q.optionA && q.optionB));
      } catch {
        setParseError('Failed to parse Excel file. Please check the format.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

  const handleCreate = () => {
    if (!title || !code || !duration || questions.length === 0) {
      toast({ title: 'Missing fields', description: 'Please fill all fields and upload questions.', variant: 'destructive' });
      return;
    }

    const newExam: Exam = {
      id: `exam_${Date.now()}`,
      title,
      code: code.toUpperCase(),
      duration: Number(duration),
      totalMarks,
      startTime: startTime || new Date().toISOString(),
      endTime: endTime || new Date(Date.now() + Number(duration) * 60000).toISOString(),
      questions,
      status: 'active',
    };

    addExam(newExam);
    toast({ title: 'Exam Created!', description: `"${title}" with ${questions.length} questions. Code: ${newExam.code}` });
    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-1 h-4 w-4" /> Create Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exam-title">Exam Title</Label>
              <Input id="exam-title" placeholder="e.g. DSA Final" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="exam-code">Exam Code</Label>
              <Input id="exam-code" placeholder="e.g. DSA2025" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="font-mono" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-duration">Duration (min)</Label>
              <Input id="exam-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="exam-start">Start Time</Label>
              <Input id="exam-start" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="exam-end">End Time</Label>
              <Input id="exam-end" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {/* Excel Upload */}
          <div>
            <Label>Upload Questions (Excel)</Label>
            <div
              className="mt-1 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 p-6 transition-colors hover:border-accent/50 hover:bg-accent/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {fileName || 'Click to upload .xlsx file'}
              </p>
              <p className="text-xs text-muted-foreground/70">
                Columns: Question, Option A, Option B, Option C, Option D, Correct Answer, Marks
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {parseError && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {parseError}
            </div>
          )}

          {questions.length > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3 text-sm text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {questions.length} questions parsed • Total marks: {totalMarks}
            </div>
          )}

          {/* Preview first few questions */}
          {questions.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-lg border bg-card p-3">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Preview</p>
              {questions.slice(0, 5).map((q, i) => (
                <div key={q.id} className="mb-1.5 text-sm">
                  <span className="font-medium text-muted-foreground">{i + 1}.</span>{' '}
                  {q.question} <span className="text-xs text-muted-foreground">({q.marks} marks)</span>
                </div>
              ))}
              {questions.length > 5 && (
                <p className="text-xs text-muted-foreground">...and {questions.length - 5} more</p>
              )}
            </div>
          )}

          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleCreate} disabled={!title || !code || questions.length === 0}>
            <Upload className="mr-1 h-4 w-4" /> Create Exam ({questions.length} questions)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamDialog;
