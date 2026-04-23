import { Outlet, createFileRoute } from "@tanstack/react-router";
import DashboardWrapper from "../pages/DashboardWrapper";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DashboardWrapper>
      <Outlet />
    </DashboardWrapper>
  );
}
