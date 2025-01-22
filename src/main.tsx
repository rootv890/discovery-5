import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.tsx";

import RootLayout from "./RootLayout.tsx";
import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router";
import LandingPage from "./pages/LandingPage.tsx";
import WaitlistPage from "./pages/WaitlistPage.tsx";
import MarketingPage from "./pages/MarketingPage.tsx";
import ThankYouPage from "./pages/ThankYouPage.tsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MarketingPage />, // Has marketing navbar and outlet
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
            path: "/home",
            element: <LandingPage />,
          },
        ],
      },
      {
        path: "/",
        element: <App />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
