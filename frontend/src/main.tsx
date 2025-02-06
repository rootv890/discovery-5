import { Analytics } from "@vercel/analytics/react";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";

import RootLayout from "./RootLayout.tsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router";

import WaitlistPage from "./pages/Landing/Waitlist/page.tsx";

import ThankYouPage from "./pages/Landing/ThankYouPage.tsx";
import LandingPage from "./pages/Landing/page.tsx";
import LandingLayout from "./pages/Landing/layout.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingLayout />, // Has marketing navbar and outlet
        children: [
          {
            path: "waitlist",
            element: <WaitlistPage />,
          },
          {
            path: "/thank-you",
            element: <ThankYouPage />,
          },
          {
            index: true,
            path: "/",
            element: <LandingPage />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [{ path: "/auth/login", element: <LoginPage /> }],
      },
      {
        path: "/app",
        element: <App />,
      },
    ],
  },
]);
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthLayout from "./pages/auth/layout.tsx";
import LoginPage from "./pages/auth/login/page.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Analytics />
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
