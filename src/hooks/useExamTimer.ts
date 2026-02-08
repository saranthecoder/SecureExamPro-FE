import { useState, useEffect, useCallback, useRef } from "react";

export const useExamTimer = (
  durationMinutes: number,
  onTimeUp: () => void
) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  // ✅ Reset when duration changes
  useEffect(() => {
    if (durationMinutes > 0) {
      setTimeLeft(durationMinutes * 60);
    }
  }, [durationMinutes]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const formatted = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  const percentage =
    durationMinutes > 0
      ? ((durationMinutes * 60 - timeLeft) /
          (durationMinutes * 60)) *
        100
      : 0;

  const isLow = timeLeft <= 60; // last 1 min warning

  return { timeLeft, formatted, percentage, isLow, start, pause, isRunning };
};
