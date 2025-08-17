// routes.js
import { Navigate } from "react-router";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";

// Lazy imports



const protectedRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
    
    ],
  },
];

const publicRoutes = [
  { path: "login", element: <div>test</div> },

];

export { protectedRoutes, publicRoutes };
