import { createFileRoute } from "@tanstack/react-router";
import UserDetailsPage from "../pages/UserDetails";

export const Route = createFileRoute("/users/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <UserDetailsPage userId={id} />;
}
