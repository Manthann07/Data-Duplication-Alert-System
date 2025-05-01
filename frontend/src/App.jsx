import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import Layout from './components/Layout';
import Dashboard from "./pages/Dashboard";
import DataRepository from "./pages/DataRepository";
import UploadDataset from "./pages/UploadDataset";
import DataDuplication from './pages/DataDuplication';
import Records from './pages/Records';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import authService from './services/authService';

const queryClient = new QueryClient();

// Create router with future flags enabled
const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <Landing />
  },
  {
    path: "/signin",
    element: authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <SignIn />
  },
  {
    path: "/signup",
    element: authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <SignUp />
  },
  {
    path: "/verify-email",
    element: <VerifyEmail />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  // Protected Routes
  {
    element: <PrivateRoute><Layout /></PrivateRoute>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "upload",
        element: <UploadDataset />
      },
      {
        path: "repository",
        element: <DataRepository />
      },
      {
        path: "duplicates",
        element: <DataDuplication />
      },
      {
        path: "data-duplication/:fileId",
        element: <DataDuplication />
      },
      {
        path: "records",
        element: <Records />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "profile",
        element: <Profile />
      }
    ]
  },
  // Catch-all route
  {
    path: "*",
    element: authService.isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/" />
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
