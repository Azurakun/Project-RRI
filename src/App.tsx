import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SejarahPage } from "./pages/SejarahPage";
import { StrukturOrganisasiPage } from "./pages/StrukturOrganisasiPage";
import { EventPage } from "./pages/EventPage";
import { Pro1Page } from "./pages/Pro1Page";
import { Pro2Page } from "./pages/Pro2Page";
import { Pro4Page } from "./pages/Pro4Page";
import { LoginPage } from "./pages/admin/LoginPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ProgramManagementPage } from "./pages/admin/ProgramManagementPage";
import { OrganizationPage } from "./pages/admin/OrganizationPage";
import { EventsPage } from "./pages/admin/EventsPage";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/sejarah" element={<SejarahPage />} />
        <Route path="/struktur-organisasi" element={<StrukturOrganisasiPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/pro1" element={<Pro1Page />} />
        <Route path="/pro2" element={<Pro2Page />} />
        <Route path="/pro4" element={<Pro4Page />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="programs" element={<ProgramManagementPage />} />
          <Route path="organization" element={<OrganizationPage />} />
          <Route path="events" element={<EventsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};