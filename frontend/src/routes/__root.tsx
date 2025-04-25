import { createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import App from "@/App";

// Note: This file uses two underscores before "root" as per the convention

export const Route = createRootRoute({
  component: () => (
    <>
      <App />
    </>
  ),
});
