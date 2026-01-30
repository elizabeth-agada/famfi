import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import NavBar from "./components/navbar";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter, Routes, Route } from "react-router";
import "bootstrap-icons/font/bootstrap-icons.css"
import { AppProvider } from './providers/AppContext.tsx';
import Dashboard from './dashboard';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <NavBar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>

      <Toaster />
    </AppProvider>
  </StrictMode>,
)
