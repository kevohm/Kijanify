import * as React from "react";
import { Outlet, createRootRoute, useRouterState } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppShell } from "../components/layout/AppShell";
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: RootComponent,
});


const queryClient = new QueryClient();
function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAppRoute = pathname.startsWith("/home");

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <Toaster/>

          <div className="w-full h-screen flex flex-col">
            <Outlet />
          </div>
        
      </QueryClientProvider>
    </React.Fragment>
  );
}
