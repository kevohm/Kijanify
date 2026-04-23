import { Link } from "@tanstack/react-router";
import { FieldList } from "../features/fields/components";
import { useMe } from "../features/auth/hooks";
import { useFields } from "../features/fields/hooks";
import {
  Layers,
  Sprout,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
  Lock,
} from "lucide-react";

export const Dashboard = () => {
  const meQuery = useMe();
  const fieldsQuery = useFields();

  if (!meQuery.isFetching && !meQuery.data) {
    return (
      <div className="flex items-center justify-center h-full bg-[#F7F6F3]">
        <div
          className="bg-white rounded-2xl border border-[#E4E2DC] p-8 text-center"
          style={{ maxWidth: 360 }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[18px]"
            style={{ background: "#EBF5EF" }}
          >
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-[15px] font-semibold text-[#1A1A18] mb-1">
            Sign in required
          </div>
          <div className="text-[13px] text-[#6B6B66] mb-5">
            You need to be signed in to view your dashboard.
          </div>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "#2D6A4F" }}
          >
            Go to login →
          </Link>
        </div>
      </div>
    );
  }

  const fields = fieldsQuery.data ?? [];
  const totalFields = fields.length;
  const planted = fields.filter((f) => f.current_stage === "PLANTED").length;
  const growing = fields.filter((f) => f.current_stage === "GROWING").length;
  const ready = fields.filter((f) => f.current_stage === "READY").length;
  const harvested = fields.filter(
    (f) => f.current_stage === "HARVESTED",
  ).length;

  const firstName =
    meQuery.data?.name?.trim()?.split(/\s+/).filter(Boolean)?.[0] ?? "there";

  const stats: {
    label: string;
    sub: string;
    value: number;
    badge: string;
    badgeBg: string;
    badgeColor: string;
    iconBg: string;
    iconColor: string;
    Icon: LucideIcon;
  }[] = [
    {
      label: "Total Fields",
      sub: "Across your account",
      value: totalFields,
      badge: "Live",
      badgeBg: "#F3F4F6",
      badgeColor: "#374151",
      iconBg: "#F7F6F3",
      iconColor: "#6B6B66",
      Icon: Layers,
    },
    {
      label: "Planted",
      sub: "Newly planted fields",
      value: planted,
      badge: "Stage",
      badgeBg: "#D1FAE5",
      badgeColor: "#065F46",
      iconBg: "#EBF5EF",
      iconColor: "#2D6A4F",
      Icon: Sprout,
    },
    {
      label: "Growing",
      sub: "In active growth",
      value: growing,
      badge: "Stage",
      badgeBg: "#D1FAE5",
      badgeColor: "#065F46",
      iconBg: "#EBF5EF",
      iconColor: "#2D6A4F",
      Icon: TrendingUp,
    },
    {
      label: "Ready / Harvested",
      sub: "Near or at completion",
      value: ready + harvested,
      badge: "Stage",
      badgeBg: "#FEF3C7",
      badgeColor: "#92400E",
      iconBg: "#FFFBEB",
      iconColor: "#92400E",
      Icon: CheckCircle2,
    },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* ── Greeting + CTAs ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-[28px] lg:text-[32px] tracking-[-0.025em] text-[#1A1A18] leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Good day, {firstName}
          </h1>
          <p className="text-[14px] text-[#6B6B66] font-medium">
            Monitor field activity, track crop stages, and keep your season on
            schedule.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {meQuery.data?.role === "ADMIN" ? (
            <>
              <Link
                to={"/add-field"}
                type="button"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                style={{ background: "#2D6A4F" }}
              >
                + Create Field
              </Link>
              <Link
                to={"/users"}
                className="inline-flex items-center text-[13px] font-semibold text-[#4A4A46] px-4 py-2 rounded-lg border border-[#D8D6CF] bg-white hover:border-[#BFBDB6] transition-colors"
              >
                Users
              </Link>
            </>
          ) : null}
          {/* <button
            type="button"
            className="inline-flex items-center text-[13px] font-semibold text-[#4A4A46] px-4 py-2 rounded-lg border border-[#D8D6CF] bg-white hover:border-[#BFBDB6] transition-colors"
          >
            View Reports
          </button> */}
        </div>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-[#E4E2DC] p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: s.iconBg }}
              >
                <s.Icon size={16} style={{ color: s.iconColor }} aria-hidden />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                style={{ background: s.badgeBg, color: s.badgeColor }}
              >
                {s.badge}
              </span>
            </div>
            <div>
              <div className="text-[11px] font-semibold text-[#9A9994] uppercase tracking-wide mb-0.5">
                {s.label}
              </div>
              <div className="text-[11px] text-[#B0AEA8] font-medium">
                {s.sub}
              </div>
            </div>
            <div
              className="text-[36px] font-bold text-[#1A1A18] leading-none tracking-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Fields list ─────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] font-bold text-[#1A1A18] tracking-tight">
              Fields
            </h2>
            {fieldsQuery.isFetching && (
              <span className="text-[12px] font-semibold text-[#9A9994] bg-[#F7F6F3] border border-[#E4E2DC] px-2.5 py-0.5 rounded-full">
                Updating…
              </span>
            )}
          </div>
          <span className="text-[12px] font-medium text-[#B0AEA8]">
            {totalFields} {totalFields === 1 ? "field" : "fields"} total
          </span>
        </div>

        <FieldList />
      </div>
    </div>
  );
};
