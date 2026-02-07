import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import BASE_URL from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateExamDialogProps {
  onExamCreated?: () => void;
}

const CreateExamDialog = ({ onExamCreated }: CreateExamDialogProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [duration, setDuration] = useState("60");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [questionsCount, setQuestionsCount] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [parseError, setParseError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setCode("");
    setDuration("60");
    setStartTime("");
    setEndTime("");
    setFile(null);
    setQuestionsCount(0);
    setTotalMarks(0);
    setParseError("");
  };

  // Just preview parse (backend still validates)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setParseError("");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet);

        if (!rows.length) {
          setParseError("Excel file is empty.");
          return;
        }

        setQuestionsCount(rows.length);

        const marksSum = rows.reduce(
          (sum, r) => sum + Number(r["Marks"] || 1),
          0,
        );

        setTotalMarks(marksSum);
      } catch {
        setParseError("Invalid Excel format.");
      }
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleCreate = async () => {
    if (!title || !code || !duration || !file) {
      toast({
        title: "Missing fields",
        description: "Fill all fields and upload Excel file",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("examCode", code.toUpperCase());
      formData.append("duration", duration);
      formData.append(
        "startTime",
        startTime ? new Date(startTime).toISOString() : "",
      );

      formData.append(
        "endTime",
        endTime ? new Date(endTime).toISOString() : "",
      );

      formData.append("adminEmail", "coreadmin@secureexam.com");
      formData.append("file", file);

      const res = await fetch(`${BASE_URL}/exam/create`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create exam");
      }

      toast({
        title: "Exam Created Successfully",
        description: `${title} (${code.toUpperCase()})`,
      });

      if (onExamCreated) {
        onExamCreated();
      }

      resetForm();
      setOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="bg-accent text-accent-foreground">
          <Plus className="mr-1 h-4 w-4" /> Create Exam
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Exam Title</Label>
              <Input
                placeholder="e.g. DSA Final"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Exam Code</Label>
              <Input
                placeholder="e.g. DSA2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration (min)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            <div>
              <Label>Start Time</Label>
              <input
                type="datetime-local"
                className="w-full h-11 rounded-md border px-3 py-2 text-sm bg-background"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div>
              <Label>End Time</Label>
              <Input
                type="datetime-local"
                 className="w-full h-11 rounded-md border px-3 py-2 text-sm bg-background"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Upload Questions (Excel)</Label>
            <div
              className="mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-6 hover:bg-muted/40"
              onClick={() => fileInputRef.current?.click()}
            >
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file?.name || "Click to upload .xlsx file"}
              </p>
              <p className="text-xs text-muted-foreground">
                Columns: Question, Option A, Option B, Option C, Option D,
                Correct Answer, Marks
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
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4" />
              {parseError}
            </div>
          )}

          {questionsCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              {questionsCount} questions • Total marks: {totalMarks}
            </div>
          )}

          <Button
            className="w-full bg-accent text-accent-foreground"
            onClick={handleCreate}
            disabled={loading}
          >
            <Upload className="mr-1 h-4 w-4" />
            {loading ? "Creating..." : "Create Exam"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateExamDialog;
