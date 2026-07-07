"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import {
  AUCTION_BROKERS,
  AuctionBroker,
  MY_REQUESTS,
  MyRequest,
  RequestStatus,
  StoredRequest,
  img,
  loadMyRequests,
  saveMyRequests,
} from "@/data/auction";
import { cn } from "@/lib/utils";
import { DemandForm } from "./DemandForm";
import { WaitingRoom } from "./WaitingRoom";
import { BrokerSwipe } from "./BrokerSwipe";
import { MatchReveal } from "./MatchReveal";
import { BrokerBoard } from "./BrokerBoard";

// =============================================================
// TRANG CẦN THUÊ - MUA (trải nghiệm dành cho KHÁCH HÀNG)
// Luồng: Landing -> Đăng nhu cầu -> Tin treo trên BẢNG TIN CHỜ (môi giới
// chủ động đăng ký, không giới hạn thời gian) -> Quẹt chọn -> Ghép nối.
// Tin "Chờ kết nối" được lưu localStorage: rời trang / tải lại vẫn treo,
// bấm vào tin trong "Nhu cầu đã đăng của tôi" để mở lại trang chờ.
// Giao diện dành cho Môi giới (đăng ký tham gia tin) sẽ được xây riêng.
// =============================================================

type Step = "landing" | "form" | "waiting" | "swipe" | "match";

const STEP_LABELS = ["Nhu cầu", "Chờ kết nối", "Chọn môi giới", "Ghép nối"];
const STEP_INDEX: Record<Exclude<Step, "landing">, number> = {
  form: 0,
  waiting: 1,
  swipe: 2,
  match: 3,
};

export function CanThueMuaView({
  roleId,
  roleName,
}: {
  roleId?: RoleId;
  roleName?: string;
}) {
  // Môi giới -> bảng tin nhu cầu khách hàng; các role khác -> luồng khách hàng.
  if (roleId === "broker") return <BrokerBoard />;
  return <CustomerFlow roleId={roleId} roleName={roleName} />;
}

function CustomerFlow({
  roleId,
  roleName,
}: {
  roleId?: RoleId;
  roleName?: string;
}) {
  const [step, setStep] = useState<Step>("landing");
  const [myReqs, setMyReqs] = useState<StoredRequest[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null); // tin đang mở
  const [liked, setLiked] = useState<AuctionBroker[]>([]);
  const [swipeKey, setSwipeKey] = useState(0); // đổi key để "quẹt lại" từ đầu

  // Nạp các tin đã đăng từ localStorage (chỉ chạy phía client).
  useEffect(() => {
    setMyReqs(loadMyRequests());
  }, []);

  // Mỗi lần đổi bước -> cuộn lên đầu cho gọn.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const active = myReqs.find((r) => r.id === activeId) ?? null;

  // Cập nhật 1 tin + lưu lại localStorage (functional update tránh stale state).
  const patchReq = (id: string, patch: Partial<StoredRequest>) =>
    setMyReqs((prev) => {
      const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      saveMyRequests(next);
      return next;
    });

  const reset = () => {
    setStep("landing");
    setActiveId(null);
    setLiked([]);
  };

  // Đăng nhu cầu mới -> tạo tin "Chờ kết nối" treo trên bảng tin.
  const publish = (d: StoredRequest["draft"]) => {
    const req: StoredRequest = {
      id: `req-${Date.now()}`,
      title: `Cần ${d.type.toLowerCase()} ${d.propertyType.toLowerCase()}`,
      type: d.type,
      area: d.area,
      budget: d.budget,
      status: "Chờ kết nối",
      createdAt: new Date().toISOString().slice(0, 10),
      joined: 0,
      draft: d,
    };
    setMyReqs((prev) => {
      const next = [req, ...prev];
      saveMyRequests(next);
      return next;
    });
    setActiveId(req.id);
    setStep("waiting");
  };

  // Bấm vào tin "Chờ kết nối" trong danh sách -> mở lại trang chờ.
  // Tin mock chưa có trong storage sẽ được "nhận nuôi" vào storage trước.
  const openRequest = (r: MyRequest) => {
    if (r.status !== "Chờ kết nối" || !r.draft) return;
    if (!myReqs.some((x) => x.id === r.id)) {
      const adopted: StoredRequest = { ...r, draft: r.draft, joined: r.joined ?? 0 };
      setMyReqs((prev) => {
        const next = [adopted, ...prev];
        saveMyRequests(next);
        return next;
      });
    }
    setActiveId(r.id);
    setStep("waiting");
  };

  // Nút "Quay lại": lùi về bước liền trước trong luồng.
  // Rời trang chờ -> tin VẪN treo "Chờ kết nối" (đã lưu ở publish/patch).
  const back = () => {
    if (step === "form") setStep("landing");
    else if (step === "waiting") {
      setActiveId(null);
      setStep("landing");
    } else if (step === "swipe") setStep("waiting");
    else if (step === "match") {
      setSwipeKey((k) => k + 1); // quẹt lại từ đầu
      setStep("swipe");
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Nhắc nhở khi xem bằng role không phải khách hàng */}
      {roleId && roleId !== "customer" && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <Icon name="Info" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Bạn đang xem bằng vai trò <b>{roleName}</b>. Trải nghiệm này được
            thiết kế cho <b>Khách hàng</b>; <b>Môi giới</b> có bảng tin nhu cầu
            riêng. Các vai trò khác chỉ đang xem thử.
          </p>
        </div>
      )}

      {step === "landing" ? (
        <Landing
          myReqs={myReqs}
          onOpen={openRequest}
          onStart={() => setStep("form")}
        />
      ) : (
        <>
          {/* Nút quay lại + thanh bước */}
          <div className="relative mx-auto max-w-5xl">
            <button
              onClick={back}
              className="mb-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-colors hover:border-al-300 hover:text-al-600 lg:absolute lg:left-0 lg:top-0 lg:mb-0"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              Quay lại
            </button>
            <Stepper current={STEP_INDEX[step]} />
          </div>
          {step === "form" && <DemandForm onSubmit={publish} />}
          {step === "waiting" && active && (
            <WaitingRoom
              req={active}
              brokers={AUCTION_BROKERS}
              onJoined={(n) => patchReq(active.id, { joined: n })}
              onStart={() => setStep("swipe")}
              onClose={() => {
                patchReq(active.id, { status: "Đã đóng" });
                reset();
              }}
            />
          )}
          {step === "swipe" && active && (
            <BrokerSwipe
              key={swipeKey}
              brokers={AUCTION_BROKERS.slice(0, active.joined)}
              onDone={(l) => {
                setLiked(l);
                setStep("match");
              }}
            />
          )}
          {step === "match" && active && (
            <MatchReveal
              draft={active.draft}
              liked={liked}
              onRetry={() => {
                setSwipeKey((k) => k + 1);
                setStep("swipe");
              }}
              onUseAll={() => setLiked(AUCTION_BROKERS.slice(0, active.joined))}
              onFinish={(winner) => {
                patchReq(active.id, {
                  status: "Đã ghép nối",
                  brokerName: winner?.name,
                });
                reset();
              }}
            />
          )}
        </>
      )}
    </main>
  );
}

// -------- Thanh bước --------
function Stepper({ current }: { current: number }) {
  return (
    <div className="mx-auto mb-8 flex max-w-xl items-center">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className={cn("flex items-center", i > 0 && "flex-1")}>
          {i > 0 && (
            <div
              className={cn(
                "h-0.5 flex-1 rounded-full transition-colors",
                i <= current ? "bg-flame-500" : "bg-slate-200"
              )}
            />
          )}
          <div className="flex flex-col items-center gap-1 px-1.5">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all",
                i < current
                  ? "bg-flame-500 text-white"
                  : i === current
                    ? "bg-al-600 text-white ring-4 ring-al-100"
                    : "bg-slate-200 text-slate-500"
              )}
            >
              {i < current ? <Icon name="Check" className="h-4 w-4" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[11px] font-semibold sm:block",
                i === current ? "text-al-700" : "text-slate-400"
              )}
            >
              {label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// -------- Landing --------
const HOW_IT_WORKS = [
  {
    icon: "FileText",
    title: "Đăng nhu cầu",
    desc: "Mô tả BĐS bạn cần mua / thuê — chỉ mất 1 phút, được xác minh.",
  },
  {
    icon: "Radar",
    title: "Tin treo trên bảng chờ",
    desc: "Tin luôn mở, không giới hạn thời gian — môi giới đủ điều kiện chủ động đăng ký.",
  },
  {
    icon: "Heart",
    title: "Bạn quẹt chọn",
    desc: "Xem hồ sơ từng môi giới, quẹt phải người bạn muốn kết nối.",
  },
  {
    icon: "Sparkles",
    title: "AI ghép nối 1 người",
    desc: "Chấm điểm phù hợp, chọn đúng 1 môi giới — không bị gọi dồn dập.",
  },
];

const BENEFITS = [
  { icon: "PhoneOff", text: "Không bị nhiều môi giới gọi cùng lúc" },
  { icon: "ShieldCheck", text: "Môi giới cạnh tranh bằng uy tín, không bằng quảng cáo" },
  { icon: "Lock", text: "Liên hệ chỉ chia sẻ sau khi ghép nối thành công" },
  { icon: "Star", text: "Đánh giá 2 chiều sau mỗi lần tư vấn" },
];

const STATUS_TONE: Record<RequestStatus, string> = {
  "Chờ kết nối": "bg-amber-50 text-amber-600 border-amber-200",
  "Đã ghép nối": "bg-al-50 text-al-700 border-al-200",
  "Hoàn thành": "bg-emerald-50 text-emerald-600 border-emerald-200",
  "Đã đóng": "bg-slate-100 text-slate-500 border-slate-200",
};

function Landing({
  myReqs,
  onOpen,
  onStart,
}: {
  myReqs: StoredRequest[];
  onOpen: (r: MyRequest) => void;
  onStart: () => void;
}) {
  // Tin tự đăng (localStorage) đứng trước, tin mock đứng sau — bỏ trùng id
  // (tin mock "Chờ kết nối" sau khi bấm vào sẽ được nhận nuôi vào storage).
  const requests: MyRequest[] = [
    ...myReqs,
    ...MY_REQUESTS.filter((m) => !myReqs.some((r) => r.id === m.id)),
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-al-700 via-al-600 to-al-500 px-6 py-10 text-white shadow-lg sm:px-12 sm:py-14">
        {/* Ảnh nền phủ toàn khung + ken-burns — gradient chuyển mượt */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img("photo-1600585154340-be6161a56a0c", 1200)}
            alt=""
            className="h-full w-full animate-kenburns object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-al-800 via-al-700/90 to-al-600/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-al-800/60 to-transparent" />
        </div>
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-flame-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-al-300/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-10 hidden animate-float lg:block">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Icon name="HeartHandshake" className="h-8 w-8" />
          </span>
        </div>

        <div className="relative max-w-2xl">
          <p className="inline-flex animate-fade-up items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
            <Icon name="Radar" className="h-3.5 w-3.5 text-flame-400" />
            Bảng tin chờ kết nối môi giới — Broker Board
          </p>
          <h1
            style={{ animationDelay: "80ms" }}
            className="mt-4 animate-fade-up text-3xl font-bold leading-tight sm:text-5xl"
          >
            Cần thuê hay mua nhà?
            <br />
            <span className="text-flame-400"> Hãy để môi giới tiềm năng tự tìm đến bạn.</span>
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="mt-4 max-w-xl animate-fade-up text-base text-white/80"
          >
            Đăng nhu cầu một lần duy nhất — tin của bạn treo trên bảng tin chờ
            để môi giới chủ động đăng ký. Khi bạn sẵn sàng, AI ghép nối đúng{" "}
            <b className="text-white">một môi giới phù hợp nhất</b> — không spam,
            không bị gọi dồn dập.
          </p>
          <div
            style={{ animationDelay: "240ms" }}
            className="mt-7 flex animate-fade-up flex-wrap items-center gap-4"
          >
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2 rounded-2xl bg-flame-500 px-7 py-4 text-base font-bold shadow-lg shadow-flame-900/30 transition-all hover:-translate-y-0.5 hover:bg-flame-600"
            >
              Đăng nhu cầu ngay
              <Icon
                name="ArrowRight"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
              />
            </button>
            <div className="flex items-center gap-2 text-sm text-white/75">
              <div className="flex -space-x-2">
                {AUCTION_BROKERS.slice(0, 4).map((b) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={b.id}
                    src={b.avatar}
                    alt={b.name}
                    className="h-8 w-8 rounded-full border-2 border-al-600 object-cover"
                  />
                ))}
              </div>
              <span>500+ môi giới đã xác thực</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cách hoạt động */}
      <section>
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-al-700">
          <Icon name="Route" className="h-5 w-5 text-flame-500" />
          Hoạt động như thế nào?
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s, i) => {
            const last = i === HOW_IT_WORKS.length - 1;
            return (
              <div
                key={s.title}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group relative animate-fade-up rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-al-200 hover:shadow-md"
              >
                {/* Số thứ tự — chìm nhẹ, hover vào thẻ thì nổi rõ lên */}
                <span className="absolute right-4 top-4 font-mono text-3xl font-black text-slate-100 transition-all duration-300 group-hover:scale-110 group-hover:text-flame-500">
                  {i + 1}
                </span>

                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-al-50 text-al-600 transition-transform group-hover:scale-110">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-3 font-bold text-slate-800">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>

                {/* Mũi tên nối bước tiếp theo — chìm, không ô tròn */}
                {!last && (
                  <>
                    {/* Desktop (4 cột): mũi tên ngang giữa hai ô */}
                    <Icon
                      name="ChevronRight"
                      className="absolute -right-5 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-slate-300 lg:block"
                    />
                    {/* Mobile (1 cột): mũi tên dọc giữa hai ô */}
                    <Icon
                      name="ChevronDown"
                      className="absolute -bottom-5 left-1/2 h-5 w-5 -translate-x-1/2 text-slate-300 sm:hidden"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Vì sao khác biệt */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="grid items-stretch lg:grid-cols-2">
          {/* Ảnh minh hoạ */}
          <div className="group relative min-h-[240px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img("photo-1582407947304-fd86f028f716", 1000)}
              alt="Môi giới đồng hành cùng khách hàng"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-al-800/70 via-al-800/10 to-transparent" />
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-xl bg-white/15 px-3.5 py-2 text-sm font-bold text-white backdrop-blur">
              <Icon name="HeartHandshake" className="h-4 w-4 text-flame-400" />
              1 môi giới tốt nhất đồng hành cùng bạn
            </div>
          </div>
          {/* Nội dung */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-al-700">
              Khác gì việc tự đi tìm môi giới?
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Trên các kênh thông thường, một tin đăng có thể khiến bạn nhận hàng
              chục cuộc gọi. Ở đây, cơ chế bảng tin chờ + ghép nối thông minh đảm bảo
              chỉ <b className="text-slate-700">một môi giới tốt nhất</b> đồng
              hành cùng bạn.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {BENEFITS.map((b, i) => (
                <div
                  key={b.text}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="flex animate-fade-up items-start gap-2.5 rounded-xl bg-slate-50 p-3.5 text-sm text-slate-600 transition-colors hover:bg-al-50"
                >
                  <Icon
                    name={b.icon}
                    className="mt-0.5 h-4 w-4 shrink-0 text-flame-500"
                  />
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nhu cầu đã đăng */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-bold text-al-700">
            <Icon name="FolderOpen" className="h-5 w-5 text-flame-500" />
            Nhu cầu đã đăng của tôi
          </h2>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-1 text-sm font-semibold text-al-600 hover:text-al-700"
          >
            <Icon name="Plus" className="h-4 w-4" />
            Đăng mới
          </button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {requests.map((r, i) => {
            const waiting = r.status === "Chờ kết nối";
            return (
              <div
                key={r.id}
                onClick={() => waiting && onOpen(r)}
                style={{ animationDelay: `${i * 70}ms` }}
                className={cn(
                  "animate-fade-up rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
                  waiting && "cursor-pointer hover:border-amber-300"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-bold",
                      STATUS_TONE[r.status]
                    )}
                  >
                    {r.status}
                  </span>
                  <span className="text-xs text-slate-400">{r.createdAt}</span>
                </div>
                <h3 className="mt-3 font-bold text-slate-800">{r.title}</h3>
                <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <Icon name="MapPin" className="h-3.5 w-3.5" />
                  {r.area}
                  <span className="text-slate-300">·</span>
                  <Icon name="Wallet" className="h-3.5 w-3.5" />
                  {r.budget}
                </p>
                {waiting ? (
                  <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-600">
                    <Icon name="Timer" className="h-3.5 w-3.5" />
                    Đang chờ kết nối · {r.joined ?? 0} môi giới đã đăng ký — bấm
                    để mở tin
                  </p>
                ) : r.status === "Đã đóng" ? (
                  <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
                    <Icon name="XCircle" className="h-3.5 w-3.5" />
                    Tin đã được bạn đóng
                  </p>
                ) : r.brokerName ? (
                  <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-al-50 px-3 py-2 text-xs font-semibold text-al-700">
                    <Icon name="UserCheck" className="h-3.5 w-3.5" />
                    Môi giới phụ trách: {r.brokerName}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
