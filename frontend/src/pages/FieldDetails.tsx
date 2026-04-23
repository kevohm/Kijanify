import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { ArrowLeft, Lock } from "lucide-react";

import { useMe } from "../features/auth/hooks";
import {
  useAssignAgent,
  useField,
  useUpdateField,
  useUpdateFieldStatus,
} from "../features/fields/hooks";
import type { PlantStage } from "../features/fields/types";
import { useUsers } from "../features/users/hooks";

function toDateInputValue(value: string | undefined): string {
  const safe = String(value || "");
  if (!safe) return "";
  const dt = new Date(safe);
  if (Number.isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
}

const stageOptions: { value: PlantStage; label: string }[] = [
  { value: "PLANTED", label: "Planted" },
  { value: "GROWING", label: "Growing" },
  { value: "READY", label: "Ready" },
  { value: "HARVESTED", label: "Harvested" },
];

const labelClass =
  "block text-[12px] font-semibold text-[#4A4A46] uppercase tracking-wide mb-1.5";
const inputClass =
  "w-full h-10 px-3 rounded-lg border border-[#D8D6CF] bg-white text-[14px] text-[#1A1A18] font-medium placeholder:text-[#C0BDB6] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-colors";
const selectClass =
  "w-full h-10 px-3 rounded-lg border border-[#D8D6CF] bg-white text-[14px] text-[#1A1A18] font-medium focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-colors appearance-none cursor-pointer";

export default function FieldDetails(props: { fieldId: string }) {
  const navigate = useNavigate();
  const meQuery = useMe();
  const fieldQuery = useField(props.fieldId);
  const updateField = useUpdateField();
  const updateStatus = useUpdateFieldStatus();
  const assignAgent = useAssignAgent();

  const me = meQuery.data;
  const field = fieldQuery.data;
  const isAdmin = me?.role === "ADMIN";
  const agentsQuery = useUsers({ role: "AGENT" }, { enabled: isAdmin });

  const [name, setName] = useState("");
  const [cropType, setCropType] = useState("");
  const [plantingDate, setPlantingDate] = useState("");

  const [stage, setStage] = useState<PlantStage>("PLANTED");
  const [note, setNote] = useState("");

  const [assignedAgentId, setAssignedAgentId] = useState<string>("");

  useEffect(() => {
    if (!field) return;
    setName(field.name ?? "");
    setCropType(field.crop_type ?? "");
    setPlantingDate(toDateInputValue(field.planting_date));
    setStage(field.current_stage ?? "PLANTED");
    setAssignedAgentId(field.assigned_agent_id ?? "");
  }, [field?.id, field?.updated_at]);

  const canAssign =
    isAdmin && Boolean(assignedAgentId) && assignedAgentId !== field?.assigned_agent_id;

  const statusLabel = field?.status ?? "Active";

  const lastUpdateLabel = useMemo(() => {
    const value = field?.last_status_update ?? field?.updated_at;
    if (!value) return null;
    const dt = new Date(value);
    if (Number.isNaN(dt.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(dt);
  }, [field?.last_status_update, field?.updated_at]);

  async function onSaveDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!field) return;

    try {
      await updateField.mutateAsync({
        id: field.id,
        input: {
          name: name.trim(),
          crop_type: cropType.trim(),
          planting_date: plantingDate
            ? new Date(plantingDate).toISOString()
            : undefined,
        },
      });
      toast.success("Field updated.");
    } catch {
      toast.error("Failed to update field.");
    }
  }

  async function onAssignAgent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!field || !assignedAgentId) return;

    try {
      await assignAgent.mutateAsync({
        id: field.id,
        input: { assigned_agent_id: assignedAgentId },
      });
      toast.success("Agent assigned.");
    } catch {
      toast.error("Failed to assign agent.");
    }
  }

  async function onSaveUpdate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!field) return;

    const trimmedNote = note.trim();
    try {
      await updateStatus.mutateAsync({
        id: field.id,
        input: {
          current_stage: stage,
          ...(trimmedNote ? { notes: [trimmedNote] } : {}),
        },
      });
      setNote("");
      toast.success("Update saved.");
    } catch {
      toast.error("Failed to save update.");
    }
  }

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
            You need to be signed in to view field details.
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

  return (
    <div className="p-6 lg:p-8 mx-auto bg-white w-full space-y-6">
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

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1
            className="text-[26px] tracking-[-0.025em] text-[#1A1A18] leading-tight mb-1"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            {field?.name ?? "Field"}
          </h1>
          <div className="text-[13px] text-[#6B6B66] font-medium">
            {field?.crop_type ?? "—"} • Status:{" "}
            <span className="font-semibold text-[#1A1A18]">{statusLabel}</span>
            {lastUpdateLabel ? ` • Last update: ${lastUpdateLabel}` : ""}
          </div>
        </div>
      </div>

      {fieldQuery.isLoading ? (
        <div className="text-[14px] text-[#6B6B66]">Loading field…</div>
      ) : fieldQuery.isError ? (
        <div className="text-[14px] text-[#6B6B66]">
          Failed to load this field. You may not have access.
        </div>
      ) : field ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Field details (admin) */}
          {isAdmin ? (
            <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6 space-y-5">
              <div>
                <div className="text-[14px] font-bold text-[#1A1A18] mb-1">
                  Edit field
                </div>
                <div className="text-[12px] text-[#6B6B66] font-medium">
                  Update core field details.
                </div>
              </div>

              <form onSubmit={onSaveDetails} className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="field-name">
                    Field name
                  </label>
                  <input
                    id="field-name"
                    className={inputClass}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. North Ridge Plot"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="crop-type">
                    Crop type
                  </label>
                  <input
                    id="crop-type"
                    className={inputClass}
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    placeholder="e.g. Maize"
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="planting-date">
                    Planting date
                  </label>
                  <input
                    id="planting-date"
                    type="date"
                    className={inputClass}
                    value={plantingDate}
                    onChange={(e) => setPlantingDate(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateField.isPending}
                  className="w-full h-10 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#2D6A4F" }}
                >
                  {updateField.isPending ? "Saving…" : "Save changes"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6 space-y-3">
              <div className="text-[14px] font-bold text-[#1A1A18]">
                Field details
              </div>
              <div className="text-[13px] text-[#6B6B66] font-medium">
                Planting date:{" "}
                <span className="text-[#1A1A18] font-semibold">
                  {toDateInputValue(field.planting_date) || "—"}
                </span>
              </div>
              <div className="text-[13px] text-[#6B6B66] font-medium">
                Assigned to:{" "}
                <span className="text-[#1A1A18] font-semibold">
                  {field.user?.name ?? (field.assigned_agent_id ? "Agent" : "Unassigned")}
                </span>
              </div>
            </div>
          )}

          {/* Updates + assignment */}
          <div className="space-y-6">
            {/* Assign agent (admin) */}
            {isAdmin ? (
              <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6 space-y-4">
                <div>
                  <div className="text-[14px] font-bold text-[#1A1A18] mb-1">
                    Assign field agent
                  </div>
                  <div className="text-[12px] text-[#6B6B66] font-medium">
                    Assign this field to a Field Agent.
                  </div>
                </div>

                <form onSubmit={onAssignAgent} className="space-y-3">
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={assignedAgentId}
                      onChange={(e) => setAssignedAgentId(e.target.value)}
                      disabled={agentsQuery.isLoading || agentsQuery.isError}
                    >
                      <option value="">
                        {field.assigned_agent_id
                          ? "Keep current assignment"
                          : "Select an agent"}
                      </option>
                      {(agentsQuery.data ?? []).map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9994]">
                      <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canAssign || assignAgent.isPending}
                    className="w-full h-10 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: "#2D6A4F" }}
                  >
                    {assignAgent.isPending ? "Assigning…" : "Assign agent"}
                  </button>
                </form>
              </div>
            ) : null}

            {/* Stage update + note */}
            <div className="bg-white rounded-2xl border border-[#E4E2DC] p-6 space-y-4">
              <div>
                <div className="text-[14px] font-bold text-[#1A1A18] mb-1">
                  Field update
                </div>
                <div className="text-[12px] text-[#6B6B66] font-medium">
                  Update the stage and add notes/observations.
                </div>
              </div>

              <form onSubmit={onSaveUpdate} className="space-y-4">
                <div>
                  <label className={labelClass} htmlFor="stage">
                    Current stage
                  </label>
                  <div className="relative">
                    <select
                      id="stage"
                      className={selectClass}
                      value={stage}
                      onChange={(e) => setStage(e.target.value as PlantStage)}
                    >
                      {stageOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9994]">
                      <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
                        <path
                          d="M4 6l4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass} htmlFor="note">
                    Notes / observations (optional)
                  </label>
                  <textarea
                    id="note"
                    className="w-full min-h-[96px] px-3 py-2 rounded-lg border border-[#D8D6CF] bg-white text-[14px] text-[#1A1A18] font-medium placeholder:text-[#C0BDB6] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-colors"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an observation (e.g., pest signs, irrigation done, uneven growth)…"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updateStatus.isPending}
                  className="w-full h-10 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "#2D6A4F" }}
                >
                  {updateStatus.isPending ? "Saving…" : "Save update"}
                </button>
              </form>

              <div className="border-t border-[#E4E2DC]" />

              <div>
                <div className="text-[12px] font-semibold text-[#4A4A46] uppercase tracking-wide mb-2">
                  Notes
                </div>
                {Array.isArray(field.notes) && field.notes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {field.notes.map((n, idx) => (
                      <span
                        key={`${idx}-${n}`}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4A4A46] bg-[#F7F6F3] border border-[#E4E2DC] px-3 py-1 rounded-full"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-[#6B6B66] font-medium">
                    No notes yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
