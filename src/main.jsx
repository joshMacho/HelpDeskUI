import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import { Provider } from "react-redux";
import { ContextProvider } from "../AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.js";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import IncidentReportPage from "./pages/IncidentReportPage.jsx";
import AssignPage from "./pages/AssignPage.jsx";
import DeviceTrailPage from "./pages/DeviceTrailPage.jsx";
import RoleRedirect from "./RoleRedirect.jsx";
import PasswordResetPage from "./pages/PasswordResetPage.jsx";
import License from "./pages/LicensePage.jsx";
import LocationsPage from "./pages/LocationsPage.jsx";
import IssuesPage from "./pages/IssuesPage.jsx";
import DepartmentPage from "./pages/DepartmentPage.jsx";
import ProposalPage from "./pages/ProposalPage.jsx";
import LicenseAssignPage from "./pages/LicenseAssignPage.jsx";
import MotorPage from "./pages/MotorPage.jsx";
import TokenProtectRoute from "./TokenProtectRoute.jsx";
import IncidentReportForm from "./components/forms/IncidentReportForm.jsx";
import IssueDetailsPage from "./pages/IssueDetailsPage.jsx";
import AdminRoute from "./AdminRoute.jsx";
import UnAuthorizedPage from "./pages/UnAuthorizedPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <RoleRedirect />,
        //<Navigate to="inventory" replace />,
      },
      {
        element: <AdminRoute />,
        // errorElement: <UnAuthorizedPage />,
        children: [
          {
            path: "inventory",
            element: <InventoryPage />,
          },
          {
            path: "licenses",
            element: <LicenseAssignPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
            children: [
              {
                path: "license",
                element: <License />,
              },
              {
                path: "locations",
                element: <LocationsPage />,
              },
              {
                path: "departments",
                element: <DepartmentPage />,
              },
            ],
          },

          {
            path: "assigned",
            element: <AssignPage />,
          },
          {
            path: "trail",
            element: <DeviceTrailPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
            children: [
              {
                path: "license",
                element: <License />,
              },
              {
                path: "locations",
                element: <LocationsPage />,
              },
              {
                path: "departments",
                element: <DepartmentPage />,
              },
            ],
          },
        ],
      },
      {
        path: "proposal",
        element: <ProposalPage />,
      },

      {
        path: "incidentReport",
        element: <IncidentReportPage />,
        children: [
          {
            index: true,
            element: <Navigate to="issues" replace />,
          },
          {
            path: "issues",
            element: <IssuesPage />,
          },
          {
            path: "issues/:issue_id",
            element: <IssueDetailsPage />,
          },
          {
            path: "new",
            element: <IncidentReportForm />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/auth/reset",
    element: <PasswordResetPage />,
  },
  {
    path: "/motor",
    element: (
      <TokenProtectRoute>
        <MotorPage />
      </TokenProtectRoute>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <ToastContainer position="top-right" />
        <RouterProvider router={router} />
      </ContextProvider>
    </Provider>
  </StrictMode>,
);
