import { useFields } from "../hooks";
import { Link } from "@tanstack/react-router";

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

export function FieldList() {
  const fieldsQuery = useFields();

  if (fieldsQuery.isLoading) return <div>Loading fields...</div>;
  if (fieldsQuery.isError) return <div>Failed to load fields</div>;

  const fields = fieldsQuery.data ?? [];
  if (fields.length === 0) return <div>No fields found.</div>;

  return (
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

            <div className="field-meta" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span className="badge badge--completed">{field.current_stage}</span>
              {field.assigned_agent_id ? (
                <span className="text-muted" style={{ fontWeight: 700 }}>
                  Assigned to {field.user?.name ?? "Agent"}
                </span>
              ) : (
                <span className="text-muted" style={{ fontWeight: 700 }}>
                  Unassigned
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
