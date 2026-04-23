import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { useLogout, useMe } from "../../features/auth/hooks";

function initialsFromName(name: string | undefined): string {
  const safe = String(name || "").trim();
  if (!safe) return "?";
  const parts = safe.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1];
  return `${first}${second ?? ""}`.toUpperCase();
}

function Icon({
  name,
}: {
  name: "dashboard" | "search" | "bell" | "settings";
}) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
  } as const;

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <path
            d="M4 13h7V4H4v9Zm9 7h7V11h-7v9ZM4 20h7v-5H4v5Zm9-11h7V4h-7v5Z"
            fill="currentColor"
          />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <path
            d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Zm0-2a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
            fill="currentColor"
          />
          <path
            d="M16.6 16.6 21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path
            d="M12 22a2.4 2.4 0 0 0 2.3-2h-4.6A2.4 2.4 0 0 0 12 22Z"
            fill="currentColor"
          />
          <path
            d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <path
            d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19.4 13a8.6 8.6 0 0 0 0-2l2-1.5-2-3.5-2.3.8a8.5 8.5 0 0 0-1.7-1L15 3H9l-.4 2.8a8.5 8.5 0 0 0-1.7 1L4.6 6l-2 3.5 2 1.5a8.6 8.6 0 0 0 0 2l-2 1.5 2 3.5 2.3-.8a8.5 8.5 0 0 0 1.7 1L9 21h6l.4-2.8a8.5 8.5 0 0 0 1.7-1l2.3.8 2-3.5-2-1.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}

export function AppShell({ children }: { children: ReactNode }) {
  const meQuery = useMe();
  const logout = useLogout();

  const user = meQuery.data;

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark">K</div>
          <div className="brand-name">Kijanify</div>
        </div>

        <div className="sidebar-section">Main Menu</div>
        <nav className="nav">
          <Link
            to="/home"
            className="nav-link"
            activeProps={{ className: "is-active" }}
          >
            <div className="nav-icon" aria-hidden>
              <Icon name="dashboard" />
            </div>
            <span>Dashboard</span>
          </Link>
        </nav>

        <div />

        <div className="sidebar-help">
          <div style={{ fontWeight: 900 }}>Track field progress</div>
          <div className="text-muted">
            Keep crops on schedule with clear stages and quick status checks.
          </div>
          <button className="btn btn--secondary" type="button">
            View tips
          </button>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <div className="search" role="search">
            <span style={{ color: "var(--muted)" }} aria-hidden>
              <Icon name="search" />
            </span>
            <input
              className="search-input"
              placeholder="Search here..."
              aria-label="Search"
            />
          </div>

          <div className="topbar-actions">
            <button className="icon-btn" type="button" aria-label="Notifications">
              <Icon name="bell" />
            </button>
            <button className="icon-btn" type="button" aria-label="Settings">
              <Icon name="settings" />
            </button>

            {user ? (
              <div className="user-chip">
                <div className="avatar" aria-hidden>
                  {initialsFromName(user.name)}
                </div>
                <div style={{ display: "grid" }}>
                  <div className="user-chip-name">{user.name}</div>
                  <div className="user-chip-role">{user.role}</div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn--secondary">
                Login
              </Link>
            )}

            {user ? (
              <button className="btn btn--ghost" type="button" onClick={logout}>
                Logout
              </button>
            ) : null}
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
