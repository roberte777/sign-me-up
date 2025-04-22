import { Outlet } from "@tanstack/react-router";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto py-6">
        <h1 className="text-3xl font-bold">Sign Me Up</h1>
      </header>
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
