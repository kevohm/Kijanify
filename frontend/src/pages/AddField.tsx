import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sprout } from "lucide-react";
import { AddFieldForm } from "../features/fields/components/AddFieldForm";
import { useMe } from "../features/auth/hooks";

const AddField = () => {
  const navigate = useNavigate();
  const meQuery = useMe();

  if (!meQuery.isFetching && !meQuery.data) {
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
            Sign in required
          </div>
          <div className="text-[13px] text-[#6B6B66] mb-5">
            You need to be signed in to create a new field.
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
            Only Admins can create new fields.
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

  return (
    <div
      className="p-6 lg:p-8 mx-auto bg-white w-full"
    >
      {/* ── Back link ──────────────────────────────────────────────────── */}
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

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div className="flex items-start gap-4 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "#EBF5EF" }}
        >
          <Sprout size={18} style={{ color: "#2D6A4F" }} aria-hidden />
        </div>
        <div>
          <h1
            className="text-[26px] tracking-[-0.025em] text-[#1A1A18] leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Add a new field
          </h1>
          <p className="text-[14px] text-[#6B6B66] font-medium">
            Fill in the details below to register a field and begin tracking its
            crop lifecycle.
          </p>
        </div>
      </div>

      {/* ── Form card ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <AddFieldForm onSuccess={() => navigate({ to: "/home" })} />
      </div>
    </div>
  );
};

export default AddField;
