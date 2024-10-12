import { QueryClient, QueryClientProvider } from "react-query";
import { AuthBoundary } from "./AuthBoundary";
import { AuthProvider } from "./context/AuthProvider";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000 * 60,
      retryOnMount: false,
      retry: false,
    },
  },
});

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthBoundary />
    </AuthProvider>
    <Toaster />
  </QueryClientProvider>
);
