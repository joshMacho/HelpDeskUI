import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import { ContextProvider } from "../AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RoleRedirect from "./RoleRedirect.jsx";
import TokenProtectRoute from "./TokenProtectRoute.jsx";
import AdminRoute from "./AdminRoute.jsx";
import { msalConfig } from "./api/authConfig.js";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import LoadingModal from "./components/LoadingModal.jsx";

const ErrorPage = lazy(() => import("./pages/ErrorPage.jsx"));
const InventoryPage = lazy(() => import("./pages/InventoryPage.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const UsersPage = lazy(() => import("./pages/UsersPage.jsx"));
const SettingsPage = lazy(() => import("./pages/SettingsPage.jsx"));
const IncidentReportPage = lazy(() => import("./pages/IncidentReportPage.jsx"));
const AssignPage = lazy(() => import("./pages/AssignPage.jsx"));
const DeviceTrailPage = lazy(() => import("./pages/DeviceTrailPage.jsx"));
const PasswordResetPage = lazy(() => import("./pages/PasswordResetPage.jsx"));
const License = lazy(() => import("./pages/LicensePage.jsx"));
const LocationsPage = lazy(() => import("./pages/LocationsPage.jsx"));
const IssuesPage = lazy(() => import("./pages/IssuesPage.jsx"));
const DepartmentPage = lazy(() => import("./pages/DepartmentPage.jsx"));
const ProposalPage = lazy(() => import("./pages/ProposalPage.jsx"));
const LicenseAssignPage = lazy(() => import("./pages/LicenseAssignPage.jsx"));
const MotorPage = lazy(() => import("./pages/proposalPages/MotorPage.jsx"));
const IncidentReportForm = lazy(
  () => import("./components/forms/IncidentReportForm.jsx"),
);
const IssueDetailsPage = lazy(() => import("./pages/IssueDetailsPage.jsx"));
const LicenseView = lazy(() => import("./pages/LicenseView.jsx"));
const LicenseAssignDetails = lazy(
  () => import("./pages/LicenseAssignDetails.jsx"),
);
const FirePage = lazy(() => import("./pages/proposalPages/FirePage.jsx"));
const HomeHousePage = lazy(
  () => import("./pages/proposalPages/HomeHousePage.jsx"),
);
const TravelPage = lazy(() => import("./pages/proposalPages/TravelPage.jsx"));
const PublicLiabilityPage = lazy(
  () => import("./pages/proposalPages/PublicLiabilityPage.jsx"),
);
const QuickQuotePage = lazy(() => import("./pages/QuickQuotePage.jsx"));
const QuoteSetupPage = lazy(() => import("./pages/QuoteSetupPage.jsx"));

const msalInstance = new PublicClientApplication(msalConfig);

const router = createBrowserRouter(
  [
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
            {
              path: "inventory",
              element: <InventoryPage />,
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
                {
                  path: "quote-setup",
                  element: <QuoteSetupPage />,
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
          path: "quotes",
          element: <QuickQuotePage />,
        },
        {
          path: "licenses",
          element: <LicenseAssignPage />,
          children: [
            {
              index: true,
              element: <Navigate to="all" replace />,
            },
            {
              path: "all",
              element: <LicenseView />,
            },
            {
              path: "all/:license_id",
              element: <LicenseAssignDetails />,
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
    {
      path: "/fire",
      element: (
        <TokenProtectRoute>
          <FirePage />
        </TokenProtectRoute>
      ),
    },
    {
      path: "/home-or-house",
      element: (
        <TokenProtectRoute>
          <HomeHousePage />
        </TokenProtectRoute>
      ),
    },
    {
      path: "/travel",
      element: (
        <TokenProtectRoute>
          <TravelPage />
        </TokenProtectRoute>
      ),
    },
    {
      path: "/public-liability",
      element: (
        <TokenProtectRoute>
          <PublicLiabilityPage />
        </TokenProtectRoute>
      ),
    },
  ],
  {
    basename: "/prop",
  },
);

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <MsalProvider instance={msalInstance}>
//       <Provider store={store}>
//         <ContextProvider>
//           <ToastContainer position="top-right" theme="dark" />
//           <RouterProvider router={router} />
//         </ContextProvider>
//       </Provider>
//     </MsalProvider>
//   </StrictMode>,
// );

async function startApp() {
  try {
    await msalInstance.initialize();
    console.log("MSAL initialized successfully.");
    createRoot(document.getElementById("root")).render(
      <StrictMode>
        <MsalProvider instance={msalInstance}>
          <Provider store={store}>
            <ContextProvider>
              <ToastContainer position="top-right" theme="dark" />
              <Suspense
                fallback={<LoadingModal message="Loading page..." open />}
              >
                <RouterProvider router={router} />
              </Suspense>
            </ContextProvider>
          </Provider>
        </MsalProvider>
      </StrictMode>,
    );
  } catch (error) {
    console.error("Failed to initialize MSAL:", error);
  }
}

startApp();
