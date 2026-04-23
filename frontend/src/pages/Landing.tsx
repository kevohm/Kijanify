import { Link } from "@tanstack/react-router";
import Logo from "../components/ui/Logo";

// ─── Types ───────────────────────────────────────────────────────────────────

interface CtaLink {
  to: string;
  label: string;
}

interface Capability {
  label: string;
  description: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const capabilities: Capability[] = [
  {
    label: "Role-based access control",
    description:
      "Admins manage fields and assign agents. Field Agents submit observations. Every action is scoped precisely to a role.",
  },
  {
    label: "Full lifecycle tracking",
    description:
      "Fields move through Planted → Growing → Ready → Harvested with timestamped transitions at every stage.",
  },
  {
    label: "Automated risk detection",
    description:
      "Fields inactive beyond a configurable threshold are automatically flagged At Risk — no manual review required.",
  },
  {
    label: "Unified coordinator dashboard",
    description:
      "A single view across all fields, statuses, and agents — giving coordinators complete situational awareness.",
  },
];

const lifecycleStages = [
  {
    stage: "Planted",
    status: "Start",
    bg: "#D1FAE5",
    text: "#065F46",
    filled: true,
  },
  {
    stage: "Growing",
    status: "Active",
    bg: "#D1FAE5",
    text: "#065F46",
    filled: true,
  },
  {
    stage: "Ready",
    status: "Harvest window",
    bg: "#FEF3C7",
    text: "#92400E",
    filled: false,
  },
  {
    stage: "Harvested",
    status: "Completed",
    bg: "#F3F4F6",
    text: "#374151",
    filled: false,
  },
];

// ─── Landing ─────────────────────────────────────────────────────────────────

const Landing: React.FC = () => {

  const primaryCta: CtaLink = { to: "/login", label: "Sign in" };

  return (
    <div className="min-h-screen bg-[#F7F6F3] text-[#1A1A18]">
      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header className="border-b border-[#E4E2DC] bg-[#F7F6F3]">
        <div className="max-w-6xl mx-auto px-8 h-[62px] flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="text-[13px] font-medium text-[#4A4A46] hover:text-[#1A1A18] transition-colors px-4 py-2 rounded-md hover:bg-[#EDECEA]"
            >
              Create account
            </Link>
            <Link
              to={primaryCta.to}
              className="text-[13px] font-semibold text-white px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
              style={{ background: "#2D6A4F" }}
            >
              {primaryCta.label}
            </Link>
          </div>
        </div>
      </header>

      <main className="bg-white">
        {/* ════════════════════════════════════════════════════════════════
            SECTION 1 — Hero
            Left: headline + CTAs + trust row
            Right: dashboard screenshot in browser chrome
        ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 items-center">
            {/* ── Left ── */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-8">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#2D6A4F" }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "#2D6A4F" }}
                >
                  Agricultural field intelligence
                </span>
              </div>

              {/* Headline */}
              <h1
                className="text-xl lg:text-5xl font-semibold leading-[1.07] tracking-[-0.03em] text-[#1A1A18] mb-6"
  
              >
                Monitor fields.
                <br />
                <em style={{ color: "#2D6A4F", fontStyle: "italic" }}>
                  Act before
                </em>{" "}
                risk sets in.
              </h1>

              {/* Body */}
              <p
                className="text-[16px] text-[#6B6B66] leading-[1.8] mb-10"
                style={{ maxWidth: 420 }}
              >
                Kijanify gives coordinators and field agents a shared,
                structured system to track crop stages, detect inactivity, and
                keep every season on course — from one dashboard.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-11">
                <Link
                  to={primaryCta.to}
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  style={{ background: "#2D6A4F" }}
                >
                  {primaryCta.label}
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    viewBox="0 0 16 16"
                    aria-hidden
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center text-[14px] font-semibold text-[#1A1A18] px-6 py-3 rounded-lg border border-[#D8D6CF] bg-white hover:border-[#BFBDB6] transition-colors"
                >
                  Create a free account
                </Link>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-medium text-[#9A9994]">
                {[
                  "Role-based access control",
                  "Automated risk detection",
                  "Full audit trail",
                ].map((item, i, arr) => (
                  <span key={item} className="flex items-center gap-4">
                    {item}
                    {i < arr.length - 1 && (
                      <span className="w-1 h-1 rounded-full bg-[#D0CEC8] inline-block" />
                    )}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right: screenshot ── */}
            <div className="relative">
              {/* Background plate */}
              <div
                className="absolute inset-0 rounded-2xl translate-x-3 translate-y-3"
                style={{ background: "#C8E6D4" }}
              />
              {/* Card */}
              <div className="relative rounded-2xl overflow-hidden border border-[#D0CEC8] shadow-[0_12px_48px_rgba(0,0,0,0.10)]">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#E4E2DC] bg-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EDECEA]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EDECEA]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EDECEA]" />
                  <div className="ml-3 h-5 flex-1 rounded bg-[#F7F6F3] border border-[#E4E2DC] flex items-center px-3">
                    <span className="text-[10px] text-[#C0BDB6] font-medium">
                      kijanify.app/dashboard
                    </span>
                  </div>
                </div>
                <img
                  src={
                    "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmFybXxlbnwwfHwwfHx8MA%3D%3D"
                  }
                  alt="Kijanify field monitoring dashboard"
                  className="w-full object-cover block"
                />
              </div>

              {/* Floating chip */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-[#E4E2DC] shadow-[0_4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[13px]"
                  style={{ background: "#2D6A4F" }}
                >
                  ◎
                </div>
                <div>
                  <div className="text-[12px] font-semibold text-[#1A1A18] leading-none mb-0.5">
                    At Risk auto-detection
                  </div>
                  <div className="text-[11px] text-[#9A9994] font-medium">
                    Configurable inactivity threshold
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            SECTION 2 — Platform capabilities
            Left: section copy + lifecycle timeline
            ════════════════════════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            {/* ── Left ── */}
            <div>
            Right: numbered capability list + demo CTA card
              <div className="flex items-center gap-2 mb-8">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#2D6A4F" }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "#2D6A4F" }}
                >
                  Built for the field
                </span>
              </div>

              <h2
                className="text-[36px] lg:text-[42px] leading-[1.1] tracking-[-0.025em] text-[#1A1A18] mb-5"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                A system your team
                <br />
                will <em style={{ fontStyle: "italic" }}>actually use</em>.
              </h2>

              <p
                className="text-[15px] text-[#6B6B66] leading-[1.75] mb-12"
                style={{ maxWidth: 360 }}
              >
                Designed around the real workflow of agricultural coordinators
                and on-ground agents — no unnecessary complexity, no missed
                signals.
              </p>

              {/* Lifecycle timeline */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9A9994] mb-5">
                  Field lifecycle
                </p>
                <div>
                  {lifecycleStages.map((item, i) => (
                    <div key={item.stage} className="flex items-stretch gap-5">
                      {/* Spine */}
                      <div
                        className="flex flex-col items-center"
                        style={{ width: 16 }}
                      >
                        <div
                          className="w-3 h-3 rounded-full border-2 mt-[18px] flex-shrink-0"
                          style={{
                            borderColor: "#2D6A4F",
                            background: item.filled ? "#2D6A4F" : "#F7F6F3",
                          }}
                        />
                        {i < lifecycleStages.length - 1 && (
                          <div className="w-px flex-1 bg-[#E4E2DC] my-1" />
                        )}
                      </div>
                      {/* Row */}
                      <div
                        className={`flex items-center justify-between py-3 flex-1 ${
                          i < lifecycleStages.length - 1
                            ? "border-b border-[#F0EEE8]"
                            : ""
                        }`}
                      >
                        <span className="text-[14px] font-semibold text-[#1A1A18]">
                          {item.stage}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                          style={{ background: item.bg, color: item.text }}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right ── */}
            <div>
              {/* Capability list */}
              <div className="space-y-1 mb-4">
                {capabilities.map((cap, i) => (
                  <div
                    key={cap.label}
                    className="flex gap-5 px-5 py-5 rounded-xl hover:bg-white hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] border border-transparent hover:border-[#E4E2DC] transition-all duration-200 cursor-default group"
                  >
                    {/* Index */}
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 transition-colors"
                      style={{ background: "#EDECEA", color: "#9A9994" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <div className="text-[14px] font-semibold text-[#1A1A18] mb-1.5">
                        {cap.label}
                      </div>
                      <div className="text-[13px] text-[#6B6B66] leading-[1.7]">
                        {cap.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Demo CTA card */}
              <div className="rounded-xl p-6" style={{ background: "#2D6A4F" }}>
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2"
                  style={{ color: "#A8D5BE" }}
                >
                  Explore the demo
                </p>
                <p className="text-white text-[14px] leading-[1.65] mb-5 opacity-90">
                  Use the seeded credentials below to explore every role and
                  feature — no setup required.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[
                    { role: "Admin", email: "kevinkbet+admin@gmail.com" },
                    { role: "Field Agent", email: "kevinkbet+agent@gmail.com" },
                  ].map((u) => (
                    <div
                      key={u.role}
                      className="rounded-lg p-3.5"
                      style={{ background: "rgba(255,255,255,0.10)" }}
                    >
                      <div
                        className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: "#A8D5BE" }}
                      >
                        {u.role}
                      </div>
                      <div className="text-[12px] text-white opacity-80 font-medium truncate">
                        {u.email}
                      </div>
                      <div className="text-[12px] text-white opacity-80 font-medium">
                        password123
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold bg-white px-5 py-2.5 rounded-lg hover:bg-[#F0EEE8] transition-colors"
                  style={{ color: "#2D6A4F" }}
                >
                  Open demo
                  <svg
                    width="13"
                    height="13"
                    fill="none"
                    viewBox="0 0 16 16"
                    aria-hidden
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#E4E2DC] bg-[#F7F6F3]">
        <div className="max-w-6xl mx-auto px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold select-none"
              style={{ background: "#2D6A4F" }}
            >
              K
            </div>
            <span className="text-[12px] font-medium text-[#9A9994]">
              Kijanify
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
