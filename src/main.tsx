import "./index.scss";
import "./i18n.ts";

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./App.tsx";
import { Auth } from "./pages/app/Auth.tsx";
import { Dashboard } from "./pages/app/dashboard/Dashboard.tsx";
import { Declaration } from "./pages/app/declaration/Declaration.tsx";
import { DeclarationCreate } from "./pages/app/declaration/DeclarationCreate.tsx";
import { DeclarationPay } from "./pages/app/declaration/DeclarationPay.tsx";
import { DeclarationSign } from "./pages/app/declaration/DeclarationSign.tsx";
import { DeclarationSubmit } from "./pages/app/declaration/DeclarationSubmit.tsx";
import { Error } from "./pages/app/Error.tsx";
import { Settings } from "./pages/app/settings/Settings.tsx";
import { Landing } from "./pages/Landing.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/app",
    element: <App />,
    children: [
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "declaration",
        element: <Declaration />,
        children: [
          {
            path: "create",
            element: <DeclarationCreate />,
          },
          {
            path: "sign",
            element: <DeclarationSign />,
          },
          {
            path: "pay",
            element: <DeclarationPay />,
          },
          {
            path: "submit",
            element: <DeclarationSubmit />,
          },
        ],
      },
    ],
  },
  {
    path: "error",
    element: <Error />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
