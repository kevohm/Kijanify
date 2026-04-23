import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { getAuthToken } from "../lib/auth-token";
import { useLogout, useMe } from "../features/auth/hooks";
import { Grid2X2, Search } from "lucide-react";
import Logo from "../components/ui/Logo";

function initialsFromName(name: string | undefined): string {
  const safe = String(name || "").trim();
  if (!safe) return "?";
  const parts = safe.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
  return `${first}${second ?? ""}`.toUpperCase();
}

const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const token = getAuthToken();
  const meQuery = useMe();
  const logout = useLogout();
  const user = meQuery.data;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F6F3]">
      {/* ── Main area ───────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 px-6 h-[62px] bg-white border-b border-[#E4E2DC] flex-shrink-0">
          <Logo />

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 select-none"
                  style={{ background: "#2D6A4F" }}
                  aria-hidden
                >
                  {initialsFromName(user.name)}
                </div>
                <div className="hidden sm:grid leading-tight">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">
                    {user.name}
                  </span>
                  <span className="text-[11px] font-medium text-[#9A9994] capitalize">
                    {user.role}
                  </span>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-[13px] font-semibold px-4 py-1.5 rounded-lg border border-[#D8D6CF] text-[#4A4A46] hover:border-[#BFBDB6] bg-white transition-colors"
              >
                Login
              </Link>
            )}

            {token && (
              <>
                <div className="w-px h-5 bg-[#E4E2DC]" />
                <button
                  type="button"
                  onClick={logout}
                  className="text-[13px] font-medium text-[#9A9994] hover:text-[#1A1A18] transition-colors px-2 py-1 rounded-md hover:bg-[#F7F6F3]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5">{children}</main>
      </div>
    </div>
  );
};

export default DashboardWrapper;
