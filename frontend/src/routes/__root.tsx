import { createRootRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => <RootLayout />,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="px-2 sm:px-0 border-b bg-gradient-to-r from-purple-900/20 to-indigo-900/20 backdrop-blur-sm">
        <div className="container mx-auto py-6">
          <div className="w-fit">
            <Link to="/" className="bg-white-500">
              <div className="w-fit flex items-center gap-3">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-1 rounded-xl shadow-lg">
                  <img src="/favicon.png" className="size-12" />
                </div>
                <div>
                  <h1 className="text-4xl font-montserrat font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
                    Sign Me Up
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Event registration made simple
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>
      <main className="container h-full mx-auto py-6 px-4 sm:px-0">
        <Outlet />
      </main>
    </div>
  );
}
