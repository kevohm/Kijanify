import { Link, useNavigate } from "@tanstack/react-router";
import { RegisterForm } from "../features/auth/components";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex"
    >


      {/* ── Left: image panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=900&auto=format&fit=crop&q=80"
          alt="Farm field"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(20,40,28,0.55) 0%, rgba(20,40,28,0.30) 100%)",
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-10 w-full">
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center text-white text-[13px] font-bold select-none"
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              K
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-[15px] text-white tracking-tight">
                Kijanify
              </span>
 
            </div>
          </div>

          {/* Bottom quote */}
          <div>
            <p
              className="text-white text-[26px] leading-[1.2] tracking-tight mb-4"
              style={{
                fontFamily: "'DM Serif Display', serif",
                textShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
            >
              From planting
              <br />
              to harvest,
              <br />
              <em>nothing missed</em>.
            </p>
            <div className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#6EE7A0" }}
              />
              <span
                className="text-[12px] font-semibold"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Field Monitoring System
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right: form panel ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#F7F6F3] px-6 py-12">
        {/* Mobile brand */}
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: "#2D6A4F" }}
          >
            K
          </div>
          <span className="font-bold text-[15px] text-[#1A1A18] tracking-tight">
            Kijanify
          </span>
        </div>

        <div className="w-full" style={{ maxWidth: 380 }}>
          {/* Heading */}
          <div className="mb-8">
            <h1
              className="text-[32px] tracking-[-0.03em] text-[#1A1A18] mb-2 leading-tight"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Create your account
            </h1>
            <p className="text-[14px] font-medium text-[#6B6B66]">
              Start tracking your fields in minutes.
            </p>
          </div>

          {/* Form */}
          <RegisterForm onSuccess={() => navigate({ to: "/home" })} />

          {/* Footer link */}
          <p className="mt-6 text-[13px] font-medium text-[#9A9994]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline"
              style={{ color: "#2D6A4F" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
