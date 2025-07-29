import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import React from "react";

// Core Components
import Layout from "./components/Layout";

// Page Imports
import Contact from "./pages/Contact";
import Chatbot from "./pages/Chatbot";
import Help from "./pages/Help";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Medications from "./pages/Medications";
import NotFound from "./pages/NotFound";
import Pharmacists from "./pages/Pharmacists";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";
import Register from "./pages/Auth/Register";

// Dashboard Imports

const queryClient = new QueryClient();

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-hero p-8 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">حدث خطأ غير متوقع</h1>
        <p className="mb-4 text-lg">{error.message}</p>
        <button className="px-6 py-2 bg-primary text-white rounded-lg" onClick={() => window.location.reload()}>إعادة تحميل الصفحة</button>
      </div>
    );
  }
  return (
    <React.ErrorBoundary fallbackRender={({ error }) => {
      setError(error);
      return null;
    }}>
      {children}
    </React.ErrorBoundary>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/pharmacists" element={<Pharmacists />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="pharmacist" />}>
                <Route path="/dashboard/pharmacist" element={<PharmacistDashboard />} />
              </Route>

              <Route element={<ProtectedRoute requiredRole="patient" />}>
                <Route path="/dashboard/patient" element={<PatientDashboard />} />
              </Route>

              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
