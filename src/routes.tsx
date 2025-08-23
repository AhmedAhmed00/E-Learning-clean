// routes.js
import { Navigate } from "react-router";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";
import Orders from "./pages/Orders";
import Students from "./pages/Students";
import Employees from "./pages/EmployeesAndRoles";
import Login from "./pages/Login";
import TeacherDetails from "./features/teachers/TeacherDetails";


// Lazy imports



const protectedRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate replace to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "courses", element: <Courses /> },
      { path: "teachers", element: <Teachers /> },
      { path: "teachers/:teacherId", element: <TeacherDetails /> },
      { path: "orders", element: <Orders /> },
      { path: "students", element: <Students /> },
      { path: "employees", element: <Employees /> },
    
    ],
  },
];

const publicRoutes = [
  { path: "login", element: <Login/> },

];

export { protectedRoutes, publicRoutes };
