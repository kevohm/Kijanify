import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";

import { useMe } from "../features/auth/hooks";
import { useUsers } from "../features/users/hooks";

function roleBadge(role: string) {
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

export default function UsersPage() {
  const navigate = useNavigate();
  const meQuery = useMe();
  const isAdmin = meQuery.data?.role === "ADMIN";
  const usersQuery = useUsers({}, { enabled: isAdmin });

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
            You need to be signed in to view users.
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

  const users = usersQuery.data ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <button
        type="button"
        onClick={() => navigate({ to: "/home" })}
        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#9A9994] hover:text-[#1A1A18] transition-colors group"
      >
        <ArrowLeft
          size={14}
          className="group-hover:-translate-x-0.5 transition-transform"
          aria-hidden
        />
        Back to dashboard
      </button>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-[26px] tracking-[-0.025em] text-[#1A1A18] leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Users
          </h1>
          <p className="text-[14px] text-[#6B6B66] font-medium">
            View all users and open a profile to see assigned fields.
          </p>
        </div>
        <div className="text-[12px] font-medium text-[#B0AEA8]">
          {users.length} {users.length === 1 ? "user" : "users"}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E4E2DC] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E4E2DC] flex items-center justify-between">
          <div className="text-[13px] font-semibold text-[#1A1A18]">
            Directory
          </div>
          {usersQuery.isFetching ? (
            <span className="text-[12px] font-semibold text-[#9A9994] bg-[#F7F6F3] border border-[#E4E2DC] px-2.5 py-0.5 rounded-full">
              Updating…
            </span>
          ) : null}
        </div>

        {usersQuery.isLoading ? (
          <div className="p-5 text-[14px] text-[#6B6B66]">Loading users…</div>
        ) : usersQuery.isError ? (
          <div className="p-5 text-[14px] text-[#6B6B66]">Failed to load users.</div>
        ) : users.length === 0 ? (
          <div className="p-5 text-[14px] text-[#6B6B66]">No users found.</div>
        ) : (
          <div className="divide-y divide-[#E4E2DC]">
            {users.map((user) => (
              <Link
                key={user.id}
                to="/users/$id"
                params={{ id: user.id }}
                className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#F7F6F3] transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold text-[#1A1A18] truncate">
                      {user.name}
                    </span>
                    {roleBadge(user.role)}
                  </div>
                  <div className="text-[12px] text-[#6B6B66] font-medium truncate">
                    {user.email}
                  </div>
                </div>
                <div className="text-[12px] font-semibold text-[#2D6A4F] flex-shrink-0">
                  View →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

