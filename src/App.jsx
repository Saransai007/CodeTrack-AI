import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import Dashboard from "./pages/Dashboard";
import ToDo from "./pages/ToDo";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProtectedRoute from "./ui/ProtectedRoute";
import ChatAI from "./pages/ChatAI";
import CodeEditor from "./pages/CodeEditor";
import { useState } from "react";

import { ToggleContext } from "./ToggleContext";
import CodeTrackLanding from "./pages/CodeTrackLanding";

function App() {
  const [toggle, setToggle] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleToggle = () => {
    setToggle(!toggle);
    console.log("Toggle state:", !toggle);
  };

  const handleMobileNavToggle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  return (
    <ToggleContext.Provider
      value={{ toggle, handleToggle, mobileNavOpen, handleMobileNavToggle }}
    >
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route index element={<CodeTrackLanding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ToDo" element={<ToDo />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/chat" element={<ChatAI />} />
            <Route path="/Compiler" element={<CodeEditor />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToggleContext.Provider>
  );
}

export default App;
