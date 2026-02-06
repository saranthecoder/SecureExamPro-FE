import React, { createContext, useContext, useState, useCallback } from 'react';
import { Exam, Question } from '@/types/exam';
import { mockExams } from '@/data/mockData';

interface ExamStoreContextType {
  exams: Exam[];
  addExam: (exam: Exam) => void;
  getExamByCode: (code: string) => Exam | undefined;
}

const ExamStoreContext = createContext<ExamStoreContextType | null>(null);

export const ExamStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [exams, setExams] = useState<Exam[]>(mockExams);

  const addExam = useCallback((exam: Exam) => {
    setExams((prev) => [...prev, exam]);
  }, []);

  const getExamByCode = useCallback(
    (code: string) => exams.find((e) => e.code === code),
    [exams]
  );

  return (
    <ExamStoreContext.Provider value={{ exams, addExam, getExamByCode }}>
      {children}
    </ExamStoreContext.Provider>
  );
};

export const useExamStore = () => {
  const ctx = useContext(ExamStoreContext);
  if (!ctx) throw new Error('useExamStore must be used within ExamStoreProvider');
  return ctx;
};
