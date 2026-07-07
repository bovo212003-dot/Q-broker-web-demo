"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import { withRole } from "@/lib/role";
import {
  FRIEND_ROLE_META,
  mutualPreview,
  type FriendPerson,
  type Relationship,
} from "@/data/friends";

// =============================================================
// TRANG CÁ NHÂN CỦA BẠN BÈ — /realtor/ket-ban/[id]
// Bố cục kiểu Facebook: ảnh bìa -> CHỈ avatar đè lên bìa, còn tên +
// thông tin nằm hẳn dưới nền trắng (không bị ảnh che). Có nút Kết bạn
// / Chấp nhận / Nhắn tin theo quan hệ. Tôn trọng luật kết bạn (role
// không được phép đã bị chặn ở tầng route).
//   Tab: Giới thiệu · Ảnh · Bạn chung
// Ảnh dùng CSS background (lỗi tải -> lộ màu nền, không "vỡ").
// =============================================================

type TabKey = "about" | "photos" | "mutual";
type LocalRel = Relationship | "outgoing";

export function FriendProfileView({
  person,
  roleId,
}: {
  person: FriendPerson;
  roleId?: RoleId;
}) {
  const [tab, setTab] = useState<TabKey>("about");
  const [rel, setRel] = useState<LocalRel>(person.rel);
  const meta = FRIEND_ROLE_META[person.role];
  const mutuals = mutualPreview(person, roleId, 8);
  const backHref = withRole("/realtor/ket-ban", roleId);
  const msgHref = withRole(`/realtor/tin-nhan?f=${person.id}`, roleId);

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: "about", label: "Giới thiệu", icon: "Info" },
    { key: "photos", label: "Ảnh", icon: "Image" },
    { key: "mutual", label: "Bạn chung", icon: "Users" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto max-w-4xl px-0 sm:px-4">
        {/* Khối hồ sơ nền trắng bo góc, chứa bìa + header */}
        <div className="overflow-hidden bg-white shadow-sm sm:mt-6 sm:rounded-3xl sm:border sm:border-slate-200">
          {/* ---------- ẢNH BÌA ---------- */}
          <div className="relative">
            <div
              className="h-40 bg-cover bg-center sm:h-56"
              style={{
                backgroundColor: person.coverColor,
                backgroundImage: `url("${person.coverImage}")`,
              }}
            />
            <Link
              href={backHref}
              className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-white"
            >
              <Icon name="ArrowLeft" className="h-4 w-4" />
              Quay lại
            </Link>
          </div>

          {/* ---------- HEADER: avatar (đè bìa) + hành động ---------- */}
          <div className="px-4 pb-5 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Avatar đè lên bìa (chỉ mình avatar overlap) */}
              <div className="-mt-14 flex justify-center sm:-mt-16 sm:justify-start">
                <div className="relative shrink-0">
                  <span
                    className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full text-4xl font-bold text-white ring-4 ring-white sm:h-32 sm:w-32"
                    style={{ backgroundColor: person.avatarColor }}
                  >
                    <span className="relative">
                      {person.name.charAt(0).toUpperCase()}
                    </span>
                    <span
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url("${person.avatarImage}")` }}
                    />
                  </span>
                  {person.online && (
                    <span className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  )}
                </div>
              </div>

              {/* Nút hành động theo quan hệ */}
              <div className="flex w-full gap-2 sm:w-auto sm:pb-1">
                <ActionButtons rel={rel} setRel={setRel} msgHref={msgHref} />
              </div>
            </div>

            {/* Tên + badge + meta — nằm HẲN dưới nền trắng, chữ tối đọc rõ */}
            <div className="mt-3 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:justify-start">
                <h1 className="text-2xl font-bold text-realtor-ink">
                  {person.name}
                </h1>
                {person.verified && (
                  <Icon
                    name="BadgeCheck"
                    className="h-5 w-5 text-realtor-500"
                  />
                )}
                <span
                  className={
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold " +
                    meta.chip
                  }
                >
                  <Icon name={meta.icon} className="h-3.5 w-3.5" />
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {person.title}
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 sm:justify-start">
                <span className="flex items-center gap-1">
                  <Icon name="Briefcase" className="h-3.5 w-3.5" />
                  {person.company}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" className="h-3.5 w-3.5" />
                  {person.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" className="h-3.5 w-3.5" />
                  {person.experience}
                </span>
              </div>
            </div>

            {/* Chỉ số nhanh */}
            <div className="mt-5 grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 text-center">
              <Stat value={person.friendsCount} label="Bạn bè" />
              <Stat value={person.mutual} label="Bạn chung" />
              <Stat value={person.posts} label="Bài đăng" />
              <Stat value={person.photos.length} label="Ảnh" />
            </div>
          </div>
        </div>

        {/* ---------- TABS ---------- */}
        <div className="mt-4 px-4 sm:px-0">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
            {tabs.map((t) => {
              const on = tab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={
                    "relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors " +
                    (on
                      ? "text-realtor-600"
                      : "text-slate-500 hover:text-slate-700")
                  }
                >
                  <Icon name={t.icon} className="h-4 w-4" />
                  {t.label}
                  {on && (
                    <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-realtor-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- NỘI DUNG TAB ---------- */}
        <div className="mt-5 px-4 sm:px-0">
          {tab === "about" && <AboutTab person={person} />}
          {tab === "photos" && <PhotosTab person={person} />}
          {tab === "mutual" && <MutualTab mutuals={mutuals} roleId={roleId} />}
        </div>
      </div>
    </div>
  );
}

/** Cụm nút hành động — đổi theo quan hệ hiện tại. */
function ActionButtons({
  rel,
  setRel,
  msgHref,
}: {
  rel: LocalRel;
  setRel: (r: LocalRel) => void;
  msgHref: string;
}) {
  const msgBtn = (
    <Link
      href={msgHref}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:flex-none"
    >
      <Icon name="MessageCircle" className="h-4 w-4" />
      Nhắn tin
    </Link>
  );

  if (rel === "friend") {
    return (
      <>
        <button
          type="button"
          onClick={() => setRel("none")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 sm:flex-none"
        >
          <Icon name="UserCheck" className="h-4 w-4" />
          Bạn bè
        </button>
        {msgBtn}
      </>
    );
  }

  if (rel === "incoming") {
    return (
      <>
        <button
          type="button"
          onClick={() => setRel("friend")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-realtor-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-realtor-600 sm:flex-none"
        >
          <Icon name="Check" className="h-4 w-4" />
          Chấp nhận
        </button>
        <button
          type="button"
          onClick={() => setRel("none")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
        >
          Từ chối
        </button>
      </>
    );
  }

  if (rel === "outgoing") {
    return (
      <>
        <button
          type="button"
          onClick={() => setRel("none")}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 sm:flex-none"
        >
          <Icon name="Clock" className="h-4 w-4" />
          Đã gửi lời mời
        </button>
        {msgBtn}
      </>
    );
  }

  // rel === "none"
  return (
    <>
      <button
        type="button"
        onClick={() => setRel("outgoing")}
        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-realtor-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-realtor-600 sm:flex-none"
      >
        <Icon name="UserPlus" className="h-4 w-4" />
        Kết bạn
      </button>
      {msgBtn}
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-lg font-bold text-realtor-ink">
        {value.toLocaleString("vi-VN")}
      </p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  );
}

// ---------- Tab: Giới thiệu ----------
function AboutTab({ person }: { person: FriendPerson }) {
  const contact = [
    { icon: "Phone", label: "Điện thoại", value: person.phone },
    { icon: "Mail", label: "Email", value: person.email },
    { icon: "MapPin", label: "Khu vực", value: person.location },
    { icon: "CalendarDays", label: "Tham gia", value: person.joined },
    ...(person.website
      ? [{ icon: "Globe", label: "Website", value: person.website }]
      : []),
  ];

  return (
    <div className="space-y-5">
      {/* Giới thiệu */}
      <Section icon="Quote" title="Giới thiệu">
        <p className="text-[15px] leading-relaxed text-slate-600">{person.bio}</p>
      </Section>

      {/* Chuyên môn (chips) */}
      <Section icon="Sparkles" title="Chuyên môn">
        <div className="flex flex-wrap gap-2">
          {person.specialties.map((s) => (
            <span
              key={s}
              className="rounded-full bg-realtor-50 px-3 py-1.5 text-sm font-semibold text-realtor-600"
            >
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* Khu vực hoạt động + Ngôn ngữ (2 cột) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Section icon="Map" title="Khu vực hoạt động">
          <ul className="space-y-2">
            {person.areas.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <Icon name="MapPin" className="h-4 w-4 text-realtor-500" />
                {a}
              </li>
            ))}
          </ul>
        </Section>
        <Section icon="Languages" title="Ngôn ngữ">
          <ul className="space-y-2">
            {person.languages.map((l) => (
              <li
                key={l}
                className="flex items-center gap-2 text-sm text-slate-600"
              >
                <Icon name="Check" className="h-4 w-4 text-realtor-500" />
                {l}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Thông tin liên hệ (tile) */}
      <div>
        <h2 className="mb-3 flex items-center gap-2 px-1 text-base font-bold text-realtor-ink">
          <Icon name="Contact" className="h-5 w-5 text-realtor-500" />
          Thông tin liên hệ
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contact.map((r) => (
            <div
              key={r.label}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-realtor-50 text-realtor-500">
                <Icon name={r.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400">{r.label}</p>
                <p className="truncate text-sm font-semibold text-realtor-ink">
                  {r.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-realtor-ink">
        <Icon name={icon} className="h-5 w-5 text-realtor-500" />
        {title}
      </h2>
      {children}
    </div>
  );
}

// ---------- Tab: Ảnh ----------
function PhotosTab({ person }: { person: FriendPerson }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {person.photos.map((src, i) => (
        <div
          key={i}
          className="group overflow-hidden rounded-2xl bg-slate-100 shadow-sm"
        >
          <div
            className="aspect-square w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url("${src}")` }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------- Tab: Bạn chung ----------
function MutualTab({
  mutuals,
  roleId,
}: {
  mutuals: FriendPerson[];
  roleId?: RoleId;
}) {
  if (mutuals.length === 0)
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
        Chưa có bạn chung.
      </div>
    );
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {mutuals.map((m) => {
        const meta = FRIEND_ROLE_META[m.role];
        return (
          <Link
            key={m.id}
            href={withRole(`/realtor/ket-ban/${m.id}`, roleId)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: m.avatarColor }}
            >
              <span className="relative">{m.name.charAt(0).toUpperCase()}</span>
              <span
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${m.avatarImage}")` }}
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-realtor-ink">{m.name}</p>
              <p className="truncate text-xs text-slate-400">{m.title}</p>
            </div>
            <span
              className={
                "shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold " +
                meta.chip
              }
            >
              {meta.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
