"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { SegmentTabs } from "@/components/training/SegmentTabs";
import { QuizRunner } from "@/components/training/QuizRunner";
import {
  ActiveExam,
  ExamGroup,
  SELF_PRACTICE,
  buildExam,
  loadActiveExam,
  saveActiveExam,
} from "@/data/training";
import { cn } from "@/lib/utils";

const GROUPS: readonly ExamGroup[] = ["Cơ sở", "Chuyên môn"];

type Phase = "idle" | "loading" | "running";
interface ExamResult {
  name: string;
  group: ExamGroup;
  score: number;
  total: number;
}

// TAB TRẮC NGHIỆM — "Bộ đề tổng hợp": tạo đề tự luyện -> làm bài; quay lại
// giữa chừng sẽ hiện bài đang làm dở kèm 2 lựa chọn (tiếp tục / huỷ).
export default function TracNghiemPage() {
  const [group, setGroup] = useState<ExamGroup>("Cơ sở");
  const cfg = SELF_PRACTICE[group];

  const [count, setCount] = useState<Record<ExamGroup, number>>({
    "Cơ sở": SELF_PRACTICE["Cơ sở"].startNo - 1,
    "Chuyên môn": SELF_PRACTICE["Chuyên môn"].startNo - 1,
  });
  const [name, setName] = useState("");
  const [active, setActive] = useState<ActiveExam | null>(null); // bài đang làm dở
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<ExamResult | null>(null);
  const [history, setHistory] = useState<ExamResult[]>([]);

  const defaultName = (g: ExamGroup, n: number) => `Đề tự luyện ${g} #${n}`;

  // Nạp bài đang làm dở (nếu có) từ localStorage.
  useEffect(() => {
    const a = loadActiveExam();
    if (a) {
      setActive(a);
      setGroup(a.group);
    }
  }, []);

  useEffect(() => {
    setName(defaultName(group, count[group] + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group]);

  const startNew = () => {
    const finalName = name.trim() || defaultName(group, count[group] + 1);
    const exam = buildExam(group, finalName);
    setActive(exam);
    setPhase("loading");
    setTimeout(() => {
      saveActiveExam(exam);
      setCount((c) => ({ ...c, [group]: c[group] + 1 }));
      setName(defaultName(group, count[group] + 2));
      setPhase("running");
    }, 1600);
  };

  const exitRunner = (updated: ActiveExam) => {
    saveActiveExam(updated);
    setActive(updated);
    setPhase("idle");
  };

  const finishRunner = (updated: ActiveExam, score: number) => {
    saveActiveExam(null);
    setActive(null);
    setPhase("idle");
    const r: ExamResult = {
      name: updated.name,
      group: updated.group,
      score,
      total: updated.questions.length,
    };
    setResult(r);
    setHistory((h) => [r, ...h]);
  };

  const cancelActive = () => {
    saveActiveExam(null);
    setActive(null);
    setPhase("idle");
  };

  // Đang làm bài -> overlay toàn màn hình.
  if (phase === "running" && active) {
    return <QuizRunner exam={active} onExit={exitRunner} onFinish={finishRunner} />;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-al-700">Bộ đề tổng hợp</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tự tạo đề luyện thi ngẫu nhiên theo nhóm chuyên đề — mỗi đề 40 câu, 120 phút.
        </p>
      </div>

      <div className="mt-5">
        <SegmentTabs options={GROUPS} value={group} onChange={setGroup} />
      </div>

      {/* Có bài đang làm dở -> thẻ tiếp tục / huỷ; ngược lại -> thẻ tạo đề */}
      {active ? (
        <ResumeCard exam={active} onContinue={() => setPhase("running")} onCancel={cancelActive} />
      ) : (
        <GeneratorCard
          group={group}
          cfg={cfg}
          name={name}
          onName={setName}
          placeholder={defaultName(group, count[group] + 1)}
          onCreate={startNew}
        />
      )}

      {/* Kết quả gần đây (trong phiên) */}
      {history.length > 0 && (
        <div className="mt-8">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
            <Icon name="History" className="h-4 w-4 text-flame-500" />
            Kết quả gần đây
          </h3>
          <div className="space-y-3">
            {history.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Icon name="CircleCheckBig" className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-slate-800">{r.name}</p>
                  <p className="text-xs text-slate-500">
                    {r.group} · Đúng {r.score}/{r.total} câu
                  </p>
                </div>
                <span className="shrink-0 text-lg font-bold text-al-600">
                  {Math.round((r.score / r.total) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Overlay đang tạo đề */}
      {phase === "loading" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="flex w-64 animate-pop-in flex-col items-center rounded-3xl bg-white px-6 py-8 text-center shadow-2xl">
            <span className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-al-600" />
            <p className="mt-4 font-bold text-slate-800">Hệ thống đang tạo đề thi...</p>
            <p className="mt-1 text-sm text-slate-400">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      )}

      {/* Kết quả sau khi nộp bài */}
      {result && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm animate-pop-in rounded-3xl bg-white p-6 text-center shadow-2xl">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
              <Icon name="CircleCheckBig" className="h-9 w-9" />
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-800">Đã nộp bài!</h3>
            <p className="mt-1 text-sm text-slate-500">{result.name}</p>
            <div className="mt-5 rounded-2xl bg-slate-50 p-5">
              <p className="text-4xl font-bold text-al-700">
                {result.score}
                <span className="text-xl text-slate-400">/{result.total}</span>
              </p>
              <p className="mt-1 text-sm font-semibold text-flame-600">
                Đạt {Math.round((result.score / result.total) * 100)}% số câu đúng
              </p>
            </div>
            <button
              onClick={() => setResult(null)}
              className="mt-5 w-full rounded-2xl bg-al-600 py-3 font-bold text-white hover:bg-al-700"
            >
              Về trang đề
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// -------- Thẻ tạo đề tự luyện --------
function GeneratorCard({
  group,
  cfg,
  name,
  onName,
  placeholder,
  onCreate,
}: {
  group: ExamGroup;
  cfg: (typeof SELF_PRACTICE)[ExamGroup];
  name: string;
  onName: (v: string) => void;
  placeholder: string;
  onCreate: () => void;
}) {
  return (
    <div className="mt-6 animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-al-50 text-al-600">
          <Icon name="ClipboardList" className="h-8 w-8" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-800">Tự luyện Đề {group}</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">{cfg.desc}</p>
      </div>

      <div className="mt-7">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Cấu trúc đề tự luyện
        </p>
        <div className="divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4">
          <StructRow label="Tổng số câu hỏi" value={`${cfg.questions} câu`} />
          <StructRow label="Thời gian làm bài" value={`${cfg.minutes} phút`} />
          <StructRow label="Phạm vi câu hỏi" value={cfg.rangeLabel} />
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
          Đặt tên cho đề thi
        </p>
        <div className="relative">
          <input
            value={name}
            onChange={(e) => onName(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:border-al-400 focus:outline-none focus:ring-2 focus:ring-al-100"
          />
          {name && (
            <button
              onClick={() => onName("")}
              aria-label="Xoá tên"
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <Icon name="X" className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <button
        onClick={onCreate}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-al-600 py-4 text-base font-bold text-white shadow-md shadow-al-600/25 transition-all hover:-translate-y-0.5 hover:bg-al-700"
      >
        <Icon name="Plus" className="h-5 w-5" />
        Tạo đề thi mới
      </button>
    </div>
  );
}

// -------- Thẻ bài thi đang làm dở --------
function ResumeCard({
  exam,
  onContinue,
  onCancel,
}: {
  exam: ActiveExam;
  onContinue: () => void;
  onCancel: () => void;
}) {
  const answered = exam.answers.filter((a) => a !== null).length;
  const mm = Math.floor(exam.remainingSec / 60);
  const ss = exam.remainingSec % 60;

  return (
    <div className="mt-6 animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <Icon name="FileClock" className="h-8 w-8" />
        </span>
        <h2 className="mt-4 text-xl font-bold text-slate-800">
          Bạn có bài thi đang làm dở
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Bạn chưa hoàn thành đề thi: <b className="text-slate-700">{exam.name}</b>.
          Hãy tiếp tục hoặc huỷ đề để bắt đầu đề mới.
        </p>
      </div>

      <div className="mt-6 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4">
        <StructRow label="Thời gian tạo" value={exam.createdAt} />
        <StructRow label="Tiến độ làm bài" value={`${answered}/${exam.questions.length}`} />
        <StructRow
          label="Thời gian còn lại"
          value={`${mm} phút ${ss} giây`}
          highlight
        />
      </div>

      <button
        onClick={onContinue}
        className="mt-6 w-full rounded-2xl bg-al-700 py-4 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-al-800"
      >
        Tiếp tục làm bài
      </button>
      <button
        onClick={onCancel}
        className="mt-3 w-full rounded-2xl border border-rose-200 py-3.5 text-base font-bold text-rose-500 transition-colors hover:bg-rose-50"
      >
        Huỷ bài thi hiện tại
      </button>
    </div>
  );
}

function StructRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={cn("font-bold", highlight ? "text-flame-600" : "text-slate-800")}>
        {value}
      </span>
    </div>
  );
}
