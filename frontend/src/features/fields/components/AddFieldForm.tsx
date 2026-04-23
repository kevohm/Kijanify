import type { FormEvent } from "react";
import { useState } from "react";
import { z } from "zod";
import toast from "react-hot-toast";
import { useCreateField } from "../hooks"; // adjust import path as needed
import { useUsers } from "../../users/hooks";

// ─── Schema (mirrors backend) ────────────────────────────────────────────────

const createFieldSchema = z.object({
  name: z.string().min(1),
  crop_type: z.string().min(1),
  planting_date: z.coerce.date(),
  notes: z.array(z.string()).optional().default([]),
  assigned_agent_id: z.string().optional().nullable(),
});

type CreateFieldInput = z.infer<typeof createFieldSchema>;

// ─── Shared primitives ───────────────────────────────────────────────────────

const labelClass =
  "block text-[12px] font-semibold text-[#4A4A46] uppercase tracking-wide mb-1.5";
const inputClass =
  "w-full h-10 px-3 rounded-lg border border-[#D8D6CF] bg-white text-[14px] text-[#1A1A18] font-medium placeholder:text-[#C0BDB6] focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-colors";
const selectClass =
  "w-full h-10 px-3 rounded-lg border border-[#D8D6CF] bg-white text-[14px] text-[#1A1A18] font-medium focus:outline-none focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10 transition-colors appearance-none cursor-pointer";

// ─── CreateFieldForm ─────────────────────────────────────────────────────────

export function AddFieldForm(props: { onSuccess?: () => void }) {
  const createField = useCreateField();
  const agentsQuery = useUsers({ role: "AGENT" }); // { data: Agent[] } — supply your own hook

  const [name, setName] = useState("");
  const [cropType, setCropType] = useState("");
  const [plantingDate, setPlantingDate] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState<string[]>([]);
  const [assignedAgentId, setAssignedAgentId] = useState<string>("");

  function addNote() {
    const trimmed = noteInput.trim();
    if (!trimmed) return;
    setNotes((prev) => [...prev, trimmed]);
    setNoteInput("");
  }

  function removeNote(index: number) {
    setNotes((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const payload: CreateFieldInput = {
      name: name.trim(),
      crop_type: cropType.trim(),
      planting_date: new Date(plantingDate),
      notes,
      assigned_agent_id: assignedAgentId || null,
    };
    let parsed;
    try {
      parsed = await createFieldSchema.parseAsync(payload);
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Please fill in all required fields.");
      return;
    }


    try {
      await createField.mutateAsync(parsed?.data);
      toast.success("Field created successfully.");
      props.onSuccess?.();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create field.");
    }
  }

  const today = new Date().toISOString().split("T")[0]; // cap future dates

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Field name */}
      <div>
        <label htmlFor="field-name" className={labelClass}>
          Field name <span className="text-red-400">*</span>
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

      {/* Crop type */}
      <div>
        <label htmlFor="field-crop" className={labelClass}>
          Crop type <span className="text-red-400">*</span>
        </label>
        <input
          id="field-crop"
          className={inputClass}
          value={cropType}
          onChange={(e) => setCropType(e.target.value)}
          placeholder="e.g. Maize, Wheat, Sorghum"
          required
        />
      </div>

      {/* Planting date */}
      <div>
        <label htmlFor="field-date" className={labelClass}>
          Planting date <span className="text-red-400">*</span>
        </label>
        <input
          id="field-date"
          className={inputClass}
          type="date"
          value={plantingDate}
          onChange={(e) => setPlantingDate(e.target.value)}
          max={today}
          required
        />
      </div>

      {/* Assign agent */}
      <div>
        <label htmlFor="field-agent" className={labelClass}>
          Assigned agent
        </label>
        <div className="relative">
          <select
            id="field-agent"
            className={selectClass}
            value={assignedAgentId}
            onChange={(e) => setAssignedAgentId(e.target.value)}
          >
            <option value="">No agent assigned</option>
            {(agentsQuery.data ?? []).map(
              (agent: { id: string; name: string }) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ),
            )}
          </select>
          {/* Chevron */}
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

      {/* Notes */}
      <div>
        <label className={labelClass}>Notes</label>

        {/* Note input row */}
        <div className="flex gap-2">
          <input
            className={inputClass}
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNote();
              }
            }}
            placeholder="Add a note and press Enter or click Add"
          />
          <button
            type="button"
            onClick={addNote}
            className="flex-shrink-0 h-10 px-4 rounded-lg border border-[#D8D6CF] text-[13px] font-semibold text-[#4A4A46] bg-white hover:border-[#BFBDB6] hover:text-[#1A1A18] transition-colors"
          >
            Add
          </button>
        </div>

        {/* Note pills */}
        {notes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {notes.map((note, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#4A4A46] bg-[#F7F6F3] border border-[#E4E2DC] px-3 py-1 rounded-full"
              >
                {note}
                <button
                  type="button"
                  onClick={() => removeNote(i)}
                  className="text-[#9A9994] hover:text-[#1A1A18] transition-colors leading-none"
                  aria-label={`Remove note: ${note}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#E4E2DC]" />

      {/* Submit */}
      <button
        type="submit"
        disabled={createField.isPending}
        className="w-full h-10 rounded-lg text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: "#2D6A4F" }}
      >
        {createField.isPending ? "Creating field…" : "Create field"}
      </button>
    </form>
  );
}
