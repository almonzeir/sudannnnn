import { Toaster } from "@/components/ui/toaster"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BrowserRouter, Route, Routes } from "react-router-dom"

// Theme Provider
import { ThemeProvider } from "./components/theme-provider"

// Core Components
import Layout from "./components/Layout"

// Pages
import Home from "./pages/Home"
import Chatbot from "./pages/Chatbot"

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="medical-ui-theme">
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
)

export default App