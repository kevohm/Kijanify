import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "../pages/Dashboard";
import DashboardWrapper from "../pages/DashboardWrapper";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardWrapper>
      <Dashboard />
    </DashboardWrapper>
  );
}
