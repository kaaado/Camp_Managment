import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Navigate } from "react-router-dom";
import Err404 from "../pages/Error/404";
import RequireBack from "../pages/Protecting/RequireBack";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import RequireAuth from "../pages/Protecting/RequireAuth";
import Dashboard from "../components/Dashboard/Dashboard";
import AdminPanel from "../components/Dashboard/AdminPanel";
import Camp from "../components/Dashboard/Camp";

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      { path: "/", element: <Navigate to="/login" replace /> },
      { path: "/*", element: <Err404 /> },

      // Auth routes (only for non-logged-in users)
      {
        element: <RequireBack />,
        children: [

          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
        ],
      },

        // Protected Routes
        {
          element: <RequireAuth />,

          children: [
            { path: "/dashboard", element: <Dashboard /> },
            {
              element: <RequireAuth allowedRoles={['admin','user']} />,
              children: [
                { path: "/dashboard/camp", element: <Camp /> },
              ],
            },
            // Admin-only Routes
        {
          element: <RequireAuth allowedRoles={['admin']} />,
          children: [
            { path: "/dashboard/admin", element: <AdminPanel /> },
          ],
        },
          ],
        },

      
    ],
  },
]);

export default router;