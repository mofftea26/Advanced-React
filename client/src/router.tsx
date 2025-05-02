// Import necessary types and utilities
import type { AppRouter } from "@advanced-react/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import {
  createTRPCQueryUtils,
  createTRPCReact,
  httpBatchLink,
  TRPCClientError,
} from "@trpc/react-query";
import Spinner from "./features/shared/components/ui/Spinner";
import { env } from "./lib/utils/env";
import { routeTree } from "./routeTree.gen";
import { ErrorComponent } from "./features/shared/components/ErrorComponent";
import { NotFoundComponent } from "./features/shared/components/NotFoundComponent";
// Initialize a new QueryClient instance for managing server state and caching
export const queryClient = new QueryClient();

// Create a TRPC client instance with the AppRouter type for type-safe API calls
export const trpc = createTRPCReact<AppRouter>();

// Configure the TRPC client with a batch HTTP link pointing to the server URL
export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: env.VITE_SERVER_BASE_URL })],
});

// Create TRPC query utilities for managing queries and mutations to make queryClient and trpcClient work together
export const trpcQueryUtils = createTRPCQueryUtils({
  queryClient,
  client: trpcClient,
});

// Main router creation function that sets up the application's routing configuration
function createRouter() {
  const router = createTanStackRouter({
    // The route tree that defines all available routes in the application
    routeTree,
    // Enable automatic scroll restoration when navigating between pages
    scrollRestoration: true,
    // Preload routes when user hovers over links
    defaultPreload: "intent",
    // Provide TRPC query utilities to all routes
    context: {
      trpcQueryUtils,
    },
    // Loading component shown during route transitions
    defaultPendingComponent: () => (
      <div className={`flex items-center justify-center p-2 text-2xl`}>
        <Spinner />
      </div>
    ),
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFoundComponent,
    // Wrapper component that provides TRPC and React Query context to all routes
    Wrap: function WrapComponent({ children }: { children: React.ReactNode }) {
      return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </trpc.Provider>
      );
    },
  });

  return router;
}

// Export the configured router instance
export const router = createRouter();

// Type declaration to ensure type safety for the router instance
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
