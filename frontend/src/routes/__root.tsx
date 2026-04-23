import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast";

export const Route = createRootRoute({
  component: RootComponent,
});


const queryClient = new QueryClient();
function RootComponent() {
  // const pathname = useRouterState({ select: (s) => s.location.pathname });


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
