import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";

import { useMe } from "../features/auth/hooks";
import { useUser } from "../features/users/hooks";
import { useFieldsForUser } from "../features/fields/hooks";

function formatShortDate(value: string): string {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit" }).format(dt);
}

function statusToBadgeClass(status: string | undefined): string {
  if (status === "At Risk") return "badge badge--risk";
  if (status === "Completed") return "badge badge--completed";
  return "badge badge--active";
}

function roleBadge(role: string | undefined) {
  if (role === "ADMIN") {
    return (
      <span
        className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ background: "#F3F4F6", color: "#374151" }}
      >
        Admin
      </span>
    );
  }
  return (
    <span
      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
      style={{ background: "#EBF5EF", color: "#2D6A4F" }}
    >
      Agent
    </span>
  );
}

export default function UserDetailsPage(props: { userId: string }) {
  const navigate = useNavigate();
  const meQuery = useMe();
  const isAdmin = meQuery.data?.role === "ADMIN";
  const safeUserId = isAdmin ? props.userId : "";
  const userQuery = useUser(safeUserId);
  const fieldsQuery = useFieldsForUser(safeUserId);

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
            You need to be signed in to view user details.
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "#2D6A4F" }}
          >
            Go to login →
          </button>
        </div>
      </div>
    );
  }

  if (!meQuery.isFetching && meQuery.data && meQuery.data.role !== "ADMIN") {
    return (
      <div className="p-6 lg:p-8 mx-auto bg-white w-full">
        <button
          type="button"
          onClick={() => navigate({ to: "/home" })}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#9A9994] hover:text-[#1A1A18] transition-colors mb-8 group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
            aria-hidden
          />
          Back to dashboard
        </button>

        <div className="bg-white rounded-2xl border border-[#E4E2DC] p-8 text-center">
          <div className="text-[15px] font-semibold text-[#1A1A18] mb-1">
            Admin access required
          </div>
          <div className="text-[13px] text-[#6B6B66] mb-5">
            Only Admins can view users.
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/home" })}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            style={{ background: "#2D6A4F" }}
          >
            Go to dashboard →
          </button>
        </div>
      </div>
    );
  }

  const user = userQuery.data;
  const fields = fieldsQuery.data ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button
          type="button"
          onClick={() => navigate({ to: "/users" })}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#9A9994] hover:text-[#1A1A18] transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="group-hover:-translate-x-0.5 transition-transform"
            aria-hidden
          />
          Back to users
        </button>
        <div className="text-[12px] font-medium text-[#B0AEA8]">
          {fields.length} {fields.length === 1 ? "field" : "fields"} assigned
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6">
        {userQuery.isLoading ? (
          <div className="text-[14px] text-[#6B6B66]">Loading user…</div>
        ) : userQuery.isError ? (
          <div className="text-[14px] text-[#6B6B66]">
            Failed to load user.
          </div>
        ) : user ? (
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1
                className="text-[26px] tracking-[-0.025em] text-[#1A1A18] leading-tight mb-1"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {user.name}
              </h1>
              <div className="text-[13px] text-[#6B6B66] font-medium truncate">
                {user.email}
              </div>
            </div>
            <div>{roleBadge(user.role)}</div>
          </div>
        ) : (
          <div className="text-[14px] text-[#6B6B66]">User not found.</div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[17px] font-bold text-[#1A1A18] tracking-tight">
              Assigned fields
            </h2>
            {fieldsQuery.isFetching ? (
              <span className="text-[12px] font-semibold text-[#9A9994] bg-[#F7F6F3] border border-[#E4E2DC] px-2.5 py-0.5 rounded-full">
                Updating…
              </span>
            ) : null}
          </div>
        </div>

        {fieldsQuery.isLoading ? (
          <div className="text-[14px] text-[#6B6B66]">Loading fields…</div>
        ) : fieldsQuery.isError ? (
          <div className="text-[14px] text-[#6B6B66]">Failed to load fields.</div>
        ) : fields.length === 0 ? (
          <div className="text-[14px] text-[#6B6B66]">No assigned fields.</div>
        ) : (
          <div className="field-grid">
            {fields.map((field) => {
              const statusLabel = field.status ?? "Active";
              const plantingDate = formatShortDate(field.planting_date);

              return (
                <Link
                  key={field.id}
                  to="/fields/$id"
                  params={{ id: field.id }}
                  className="card field-card"
                >
                  <div className="field-card-top">
                    <div>
                      <div className="field-name">{field.name}</div>
                      <div className="field-meta">
                        {field.crop_type} • Planted {plantingDate}
                      </div>
                    </div>

                    <span className={statusToBadgeClass(statusLabel)}>{statusLabel}</span>
                  </div>

                  <div className="divider" />

                  <div
                    className="field-meta"
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  >
                    <span className="badge badge--completed">
                      {field.current_stage}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
