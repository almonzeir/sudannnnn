import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import React from "react"

// Theme Provider
import { ThemeProvider } from "./components/theme-provider"

// Auth Provider
import { AuthProvider } from "./context/AuthContext"

// Core Components
import Layout from "./components/Layout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Page Imports
import Contact from "./pages/Contact"
import Chatbot from "./pages/Chatbot"
import Help from "./pages/Help"
import Home from "./pages/Home"
import Login from "./pages/Auth/Login"
import Medications from "./pages/Medications"
import NotFound from "./pages/NotFound"
import Pharmacists from "./pages/Pharmacists"
import Privacy from "./pages/Privacy"
import Profile from "./pages/Profile"
import Register from "./pages/Auth/Register"
import OAuthCallback from "./pages/Auth/OAuthCallback"
import NotificationTest from "./pages/NotificationTest"

// Dashboard Imports
import AdminDashboard from "./pages/Dashboard/AdminDashboard"
import PharmacistDashboard from "./pages/Dashboard/PharmacistDashboard"
import PatientDashboard from "./pages/Dashboard/PatientDashboard"

const queryClient = new QueryClient()

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const App = () => (
  <ErrorBoundary>
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="medical-ui-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/medications" element={<Layout><Medications /></Layout>} />
                <Route path="/pharmacists" element={<Layout><Pharmacists /></Layout>} />
                <Route path="/login" element={<Layout><Login /></Layout>} />
                <Route path="/register" element={<Layout><Register /></Layout>} />
                <Route path="/auth/callback" element={<OAuthCallback />} />
                <Route path="/help" element={<Layout><Help /></Layout>} />
                <Route path="/contact" element={<Layout><Contact /></Layout>} />
                <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
                <Route path="/notifications" element={<Layout><NotificationTest /></Layout>} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/profile" element={<Layout><Profile /></Layout>} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="admin" />}>
                  <Route path="/dashboard/admin" element={<Layout><AdminDashboard /></Layout>} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="pharmacist" />}>
                  <Route path="/dashboard/pharmacist" element={<Layout><PharmacistDashboard /></Layout>} />
                </Route>

                <Route element={<ProtectedRoute requiredRole="patient" />}>
                  <Route path="/dashboard/patient" element={<Layout><PatientDashboard /></Layout>} />
                </Route>

                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  </ErrorBoundary>
)

export default App