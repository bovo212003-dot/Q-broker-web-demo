"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { ActiveExam } from "@/data/training";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E"];

// Đọc to nội dung (TTS) — có voice tiếng Việt thì đọc, không thì bỏ qua êm.
function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "vi-VN";
  window.speechSynthesis.speak(u);
}

// Màn "Làm bài kiểm tra" — overlay toàn màn hình: đồng hồ đếm ngược, câu hỏi,
// đáp án, điều hướng, nộp bài. Thoát (back/X) sẽ lưu tiến độ để tiếp tục sau.
export function QuizRunner({
  exam,
  onExit,
  onFinish,
}: {
  exam: ActiveExam;
  onExit: (updated: ActiveExam) => void; // lưu & rời (còn tiếp tục được)
  onFinish: (updated: ActiveExam, score: number) => void; // đã nộp bài
}) {
  const total = exam.questions.length;
  const [answers, setAnswers] = useState<(number | null)[]>(exam.answers);
  const [marked, setMarked] = useState<number[]>(exam.marked);
  const [current, setCurrent] = useState(exam.current);
  const [remaining, setRemaining] = useState(exam.remainingSec);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const answered = answers.filter((a) => a !== null).length;
  const q = exam.questions[current];
  const isMarked = marked.includes(current);

  const snapshot = (): ActiveExam => ({
    ...exam,
    answers,
    marked,
    current,
    remainingSec: remaining,
  });

  const score = () =>
    answers.reduce<number>(
      (s, a, i) => (a === exam.questions[i].answer ? s + 1 : s),
      0
    );

  // Refs để timer luôn đọc state mới nhất khi tự nộp bài lúc hết giờ.
  const stateRef = useRef({ answers, marked, current, remaining });
  stateRef.current = { answers, marked, current, remaining };

  // Đồng hồ đếm ngược; về 0 -> tự nộp bài.
  useEffect(() => {
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          const st = stateRef.current;
          const sc = st.answers.reduce<number>(
            (s, a, i) => (a === exam.questions[i].answer ? s + 1 : s),
            0
          );
          onFinish({ ...exam, ...st, remainingSec: 0 }, sc);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const choose = (i: number) =>
    setAnswers((a) => a.map((v, idx) => (idx === current ? i : v)));

  const toggleMark = () =>
    setMarked((m) =>
      m.includes(current) ? m.filter((x) => x !== current) : [...m, current]
    );

  const doSubmit = () => onFinish(snapshot(), score());
  const trySubmit = () => {
    if (answered < total) setConfirmSubmit(true);
    else doSubmit();
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-slate-50">
      {/* Thanh tiêu đề */}
      <div className="shrink-0 border-b border-slate-200 bg-white">
        <div className="relative flex h-14 items-center justify-center px-4">
          <button
            onClick={() => onExit(snapshot())}
            aria-label="Quay lại"
            className="absolute left-3 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Icon name="ArrowLeft" className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">Làm bài kiểm tra</h1>
          <button
            onClick={() => onExit(snapshot())}
            aria-label="Đóng"
            className="absolute right-3 rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <Icon name="X" className="h-5 w-5" />
          </button>
        </div>
        {/* Đồng hồ · tiến độ · nộp bài */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums",
              remaining <= 300 ? "text-rose-500" : "text-slate-800"
            )}
          >
            <Icon name="Timer" className="h-5 w-5" />
            {mm}:{ss}
          </span>
          <span className="text-sm text-slate-500">
            <b className="text-slate-800">{answered}</b> / {total} câu
          </span>
          <button
            onClick={trySubmit}
            className="rounded-xl bg-al-700 px-5 py-2 text-sm font-bold text-white hover:bg-al-800"
          >
            Nộp bài
          </button>
        </div>
      </div>

      {/* Nội dung câu hỏi */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl px-4 py-6">
          <p className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
            Câu hỏi {current + 1}:
            <SpeakBtn onClick={() => speak(q.q)} />
          </p>

          <div className="flex items-start gap-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="flex-1 text-[15px] font-semibold leading-relaxed text-slate-800">
              {q.q}
            </p>
            <SpeakBtn onClick={() => speak(q.q)} />
          </div>

          <div className="mt-5 space-y-3">
            {q.options.map((opt, i) => {
              const selected = answers[current] === i;
              return (
                <button
                  key={i}
                  onClick={() => choose(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all",
                    selected
                      ? "border-al-600 ring-1 ring-al-600"
                      : "border-slate-100 hover:border-al-200"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                      selected ? "bg-al-600 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {LETTERS[i]}
                  </span>
                  <span
                    className={cn(
                      "flex-1 text-[15px] font-semibold leading-snug",
                      selected ? "text-al-700" : "text-slate-700"
                    )}
                  >
                    {opt}
                  </span>
                  <SpeakBtn onClick={() => speak(opt)} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Thanh điều hướng dưới */}
      <div className="shrink-0 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2 px-4 py-3">
          <button
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
            disabled={current === 0}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
              current === 0
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Icon name="ChevronLeft" className="h-4 w-4" />
            Trước
          </button>

          <div className="flex items-center gap-1.5">
            <NavIcon icon="LayoutGrid" label="Danh sách câu" onClick={() => setNavOpen(true)} />
            <NavIcon icon="Volume2" label="Đọc câu hỏi" onClick={() => speak(q.q)} />
            <NavIcon
              icon="Bookmark"
              label="Đánh dấu"
              active={isMarked}
              onClick={toggleMark}
            />
          </div>

          <button
            onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}
            disabled={current === total - 1}
            className={cn(
              "inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
              current === total - 1
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            Tiếp
            <Icon name="ChevronRight" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bảng chọn nhanh câu hỏi */}
      {navOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center"
          onClick={() => setNavOpen(false)}
        >
          <div
            className="max-h-[70vh] w-full animate-pop-in overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="font-bold text-slate-800">Danh sách câu hỏi</p>
              <button
                onClick={() => setNavOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <Icon name="X" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
              {exam.questions.map((_, i) => {
                const done = answers[i] !== null;
                const cur = i === current;
                const mk = marked.includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrent(i);
                      setNavOpen(false);
                    }}
                    className={cn(
                      "relative flex h-10 items-center justify-center rounded-lg text-sm font-bold transition-colors",
                      cur
                        ? "bg-al-600 text-white ring-2 ring-al-300"
                        : done
                        ? "bg-al-50 text-al-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    )}
                  >
                    {i + 1}
                    {mk && (
                      <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-flame-500" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
              <Legend cls="bg-al-600" text="Đang xem" />
              <Legend cls="bg-al-50 ring-1 ring-al-200" text="Đã trả lời" />
              <Legend cls="bg-slate-100" text="Chưa trả lời" />
              <Legend cls="bg-flame-500" text="Đánh dấu" />
            </div>
          </div>
        </div>
      )}

      {/* Xác nhận nộp bài khi chưa hoàn thành */}
      {confirmSubmit && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm animate-pop-in rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-center text-lg font-bold text-slate-800">
              Chưa hoàn thành
            </h3>
            <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
              Bạn vẫn chưa hoàn thành toàn bộ câu hỏi ({answered}/{total}). Bạn có
              muốn nộp bài luôn không?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmSubmit(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100"
              >
                Làm tiếp
              </button>
              <button
                onClick={() => {
                  setConfirmSubmit(false);
                  doSubmit();
                }}
                className="rounded-xl bg-al-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-al-700"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpeakBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label="Đọc to"
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100"
    >
      <Icon name="Volume2" className="h-4 w-4" />
    </button>
  );
}

function NavIcon({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
        active
          ? "bg-flame-50 text-flame-500"
          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
      )}
    >
      <Icon name={icon} className={cn("h-5 w-5", active && icon === "Bookmark" && "fill-flame-500")} />
    </button>
  );
}

function Legend({ cls, text }: { cls: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-3.5 w-3.5 rounded", cls)} />
      {text}
    </span>
  );
}
