"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RoleId } from "@/types";
import { withRole } from "@/lib/role";
import {
  FRIEND_PEOPLE,
  FRIEND_ROLE_META,
  friendableRoles,
  friendRuleHint,
  type FriendPerson,
  type Relationship,
} from "@/data/friends";

// =============================================================
// KẾT BẠN — mạng xã hội nội bộ Q-Broker (kiểu Facebook/LinkedIn).
// 3 tab: Bạn bè · Lời mời · Gợi ý. Mọi danh sách được LỌC theo luật
// kết bạn của role hiện tại (xem data/friends.ts):
//   broker  -> chỉ thấy/kết bạn với broker
//   customer-> thấy/kết bạn với customer + broker
// Click vào thẻ -> mở trang cá nhân /realtor/ket-ban/[id].
// Tương tác demo (state cục bộ): chấp nhận / từ chối lời mời, gửi lời
// mời, huỷ kết bạn, tìm kiếm.
// =============================================================

type Tab = "friends" | "requests" | "suggestions";

// Trạng thái cục bộ thêm "outgoing" (tôi đã gửi lời mời, đang chờ)
type LocalRel = Relationship | "outgoing";

export function FriendsView({ roleId }: { roleId?: RoleId }) {
  const allowed = friendableRoles(roleId);
  const [tab, setTab] = useState<Tab>("friends");
  const [query, setQuery] = useState("");

  // Bản đồ quan hệ có thể thay đổi khi người dùng thao tác (id -> quan hệ)
  const [rels, setRels] = useState<Record<string, LocalRel>>(() =>
    Object.fromEntries(FRIEND_PEOPLE.map((p) => [p.id, p.rel]))
  );

  // Chỉ giữ những người thuộc nhóm role được phép kết bạn.
  const visiblePeople = useMemo(
    () => FRIEND_PEOPLE.filter((p) => allowed.includes(p.role)),
    [allowed]
  );

  const q = query.trim().toLowerCase();
  const match = (p: FriendPerson) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    p.title.toLowerCase().includes(q) ||
    p.location.toLowerCase().includes(q);

  const friends = visiblePeople.filter((p) => rels[p.id] === "friend" && match(p));
  const requests = visiblePeople.filter(
    (p) => rels[p.id] === "incoming" && match(p)
  );
  const suggestions = visiblePeople.filter(
    (p) => (rels[p.id] === "none" || rels[p.id] === "outgoing") && match(p)
  );

  const setRel = (id: string, rel: LocalRel) =>
    setRels((prev) => ({ ...prev, [id]: rel }));

  const TABS: { id: Tab; label: string; icon: string; count: number }[] = [
    { id: "friends", label: "Bạn bè", icon: "Users", count: friends.length },
    { id: "requests", label: "Lời mời", icon: "UserPlus", count: requests.length },
    {
      id: "suggestions",
      label: "Gợi ý",
      icon: "Sparkles",
      count: suggestions.length,
    },
  ];

  // Role không được phép dùng mạng xã hội -> màn thông báo.
  if (allowed.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-realtor-50 text-realtor-500">
          <Icon name="Users" className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-xl font-bold text-realtor-ink">
          Tính năng dành cho môi giới & khách hàng
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Mạng kết bạn Q-Broker hiện mở cho môi giới và khách hàng. Vui lòng đăng
          nhập bằng tài khoản phù hợp để kết nối.
        </p>
      </div>
    );
  }

  const active =
    tab === "friends" ? friends : tab === "requests" ? requests : suggestions;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      {/* Tiêu đề + luật kết bạn theo role */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-realtor-ink">Kết bạn</h1>
          <p className="mt-1 max-w-xl text-sm text-slate-500">
            {friendRuleHint(roleId)}
          </p>
        </div>
        {/* Ô tìm kiếm */}
        <div className="relative w-full sm:w-72">
          <Icon
            name="Search"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên, khu vực..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition-colors focus:border-realtor-400 focus:ring-2 focus:ring-realtor-100"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex gap-1 overflow-x-auto border-b border-slate-200">
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={
                "relative flex shrink-0 items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors " +
                (on ? "text-realtor-600" : "text-slate-500 hover:text-slate-700")
              }
            >
              <Icon name={t.icon} className="h-4 w-4" />
              {t.label}
              <span
                className={
                  "rounded-full px-2 py-0.5 text-xs font-bold " +
                  (on
                    ? "bg-realtor-50 text-realtor-600"
                    : "bg-slate-100 text-slate-500")
                }
              >
                {t.count}
              </span>
              {on && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-realtor-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Lưới thẻ người dùng */}
      {active.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {active.map((p) => (
            <PersonCard
              key={p.id}
              person={p}
              rel={rels[p.id]}
              href={withRole(`/realtor/ket-ban/${p.id}`, roleId)}
              msgHref={withRole(`/realtor/tin-nhan?f=${p.id}`, roleId)}
              onAccept={() => setRel(p.id, "friend")}
              onDecline={() => setRel(p.id, "none")}
              onAdd={() => setRel(p.id, "outgoing")}
              onCancel={() => setRel(p.id, "none")}
              onRemove={() => setRel(p.id, "none")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Thẻ một người: ảnh bìa, avatar, tên + badge nhóm, bạn chung, nút thao tác. */
function PersonCard({
  person,
  rel,
  href,
  msgHref,
  onAccept,
  onDecline,
  onAdd,
  onCancel,
  onRemove,
}: {
  person: FriendPerson;
  rel: LocalRel;
  href: string;
  msgHref: string;
  onAccept: () => void;
  onDecline: () => void;
  onAdd: () => void;
  onCancel: () => void;
  onRemove: () => void;
}) {
  const meta = FRIEND_ROLE_META[person.role];
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Vùng click mở trang cá nhân: bìa + avatar + thông tin */}
      <Link href={href} className="block">
        {/* Ảnh bìa (gradient nền dự phòng nếu ảnh lỗi tải) */}
        <div
          className="h-20 bg-cover bg-center"
          style={{
            backgroundColor: person.coverColor,
            backgroundImage: `url("${person.coverImage}")`,
          }}
        />

        <div className="px-4">
          {/* Avatar đè lên bìa */}
          <div className="-mt-8 flex items-end justify-between gap-2">
            <div className="relative shrink-0">
              <span
                className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full text-2xl font-bold text-white ring-4 ring-white"
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
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </div>
            <span
              className={
                "mb-1 inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold " +
                meta.chip
              }
            >
              <Icon name={meta.icon} className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </div>

          {/* Tên + mô tả */}
          <h3 className="mt-2 truncate font-bold text-realtor-ink group-hover:text-realtor-600">
            {person.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">
            {person.title}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <Icon name="MapPin" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{person.location}</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
            <Icon name="Users" className="h-3.5 w-3.5 shrink-0" />
            {person.mutual} bạn chung
          </p>
        </div>
      </Link>

      {/* Nút thao tác theo quan hệ (ngoài vùng Link để không lồng interactive) */}
      <div className="flex gap-2 px-4 pb-4 pt-3">
        {rel === "friend" && (
          <>
            <Link
              href={msgHref}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-realtor-500 px-3 py-2 text-sm font-semibold text-white hover:bg-realtor-600"
            >
              <Icon name="MessageCircle" className="h-4 w-4" />
              Nhắn tin
            </Link>
            <button
              type="button"
              onClick={onRemove}
              title="Huỷ kết bạn"
              className="flex items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-slate-500 hover:bg-slate-50 hover:text-rose-600"
            >
              <Icon name="UserMinus" className="h-4 w-4" />
            </button>
          </>
        )}

        {rel === "incoming" && (
          <>
            <button
              type="button"
              onClick={onAccept}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-realtor-500 px-3 py-2 text-sm font-semibold text-white hover:bg-realtor-600"
            >
              <Icon name="Check" className="h-4 w-4" />
              Chấp nhận
            </button>
            <button
              type="button"
              onClick={onDecline}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Từ chối
            </button>
          </>
        )}

        {rel === "none" && (
          <button
            type="button"
            onClick={onAdd}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-realtor-500 px-3 py-2 text-sm font-semibold text-white hover:bg-realtor-600"
          >
            <Icon name="UserPlus" className="h-4 w-4" />
            Kết bạn
          </button>
        )}

        {rel === "outgoing" && (
          <button
            type="button"
            onClick={onCancel}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Icon name="Clock" className="h-4 w-4" />
            Đã gửi lời mời
          </button>
        )}
      </div>
    </div>
  );
}

/** Trạng thái rỗng cho mỗi tab. */
function EmptyState({ tab }: { tab: Tab }) {
  const meta = {
    friends: {
      icon: "Users",
      title: "Chưa có bạn bè",
      desc: "Hãy khám phá mục Gợi ý để mở rộng mạng lưới của bạn.",
    },
    requests: {
      icon: "MailCheck",
      title: "Không có lời mời nào",
      desc: "Khi có người muốn kết bạn, lời mời sẽ xuất hiện tại đây.",
    },
    suggestions: {
      icon: "Sparkles",
      title: "Chưa có gợi ý",
      desc: "Bạn đã kết nối hết những người phù hợp. Quay lại sau nhé!",
    },
  }[tab];

  return (
    <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <Icon name={meta.icon} className="h-7 w-7" />
      </span>
      <h3 className="mt-4 font-bold text-realtor-ink">{meta.title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{meta.desc}</p>
    </div>
  );
}
