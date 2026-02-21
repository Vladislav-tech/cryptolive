import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import Header from '@/components/Header'
import { Toaster } from 'sonner';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 relative">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Header />
          <Outlet />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={3500}
            toastOptions={{
              className: `
      border border-slate-700/60
      bg-slate-900/85 backdrop-blur-xl
      text-slate-100 rounded-xl
      shadow-2xl shadow-black/40
      min-w-[320px]
    `,
              classNames: {
                title: 'text-base font-semibold text-white',
                description: 'text-sm text-slate-400 mt-1',
              },
            }}
          />
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>

  ),
});
