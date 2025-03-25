import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import Layout from './components/Layout';
import Dashboard from "./pages/Dashboard";
import DataRepository from "./pages/DataRepository";
import UploadDataset from "./pages/UploadDataset";
import Duplicates from './pages/Duplicates';
import Records from './pages/Records';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <SignIn />
          } />
          <Route path="/signup" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <SignUp />
          } />
          
          {/* Protected Routes - Require Authentication */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/upload" element={<UploadDataset />} />
            <Route path="/repository" element={<DataRepository />} />
            <Route path="/duplicates" element={<Duplicates />} />
            <Route path="/records" element={<Records />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Catch all route - Redirect to landing or dashboard based on auth status */}
          <Route path="*" element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Navigate to="/" />
          } />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
