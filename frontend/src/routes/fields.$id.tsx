import { createFileRoute } from "@tanstack/react-router";
import DashboardWrapper from "../pages/DashboardWrapper";
import FieldDetails from "../pages/FieldDetails";

export const Route = createFileRoute("/fields/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return (
    <DashboardWrapper>
      <FieldDetails fieldId={id} />
    </DashboardWrapper>
  );
}

