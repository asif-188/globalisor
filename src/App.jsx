import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';

import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import Applications from './pages/admin/Applications.jsx';
import StaffManagement from './pages/admin/StaffManagement.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import KYCReview from './pages/admin/KYCReview.jsx';
import ComplianceMonitoring from './pages/admin/ComplianceMonitoring.jsx';
import Reports from './pages/admin/Reports.jsx';
import Settings from './pages/admin/Settings.jsx';

import StaffLayout from './layouts/StaffLayout.jsx';
import StaffDashboard from './pages/staff/StaffDashboard.jsx';
import ApplicationQueue from './pages/staff/ApplicationQueue.jsx';
import KYCVerification from './pages/staff/KYCVerification.jsx';
import DocumentReview from './pages/staff/DocumentReview.jsx';
import ClientFollowups from './pages/staff/ClientFollowups.jsx';
import CompletedTasks from './pages/staff/CompletedTasks.jsx';

import ClientLayout from './layouts/ClientLayout.jsx';
import ClientDashboard from './pages/client/ClientDashboard.jsx';
import RegisterBusiness from './pages/client/RegisterBusiness.jsx';
import UploadDocuments from './pages/client/UploadDocuments.jsx';
import TrackApplication from './pages/client/TrackApplication.jsx';
import Messages from './pages/client/Messages.jsx';
import Profile from './pages/client/Profile.jsx';
import CompanyProfile from './pages/shared/CompanyProfile.jsx';
import DocumentVault from './pages/shared/DocumentVault.jsx';

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="kyc" element={<KYCReview />} />
        <Route path="compliance" element={<ComplianceMonitoring />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="company/:id" element={<CompanyProfile />} />
        <Route path="vault/:companyId" element={<DocumentVault />} />
      </Route>

      {/* Staff Portal */}
      <Route path="/staff" element={<RequireAuth role="staff"><StaffLayout /></RequireAuth>}>
        <Route index element={<StaffDashboard />} />
        <Route path="queue" element={<ApplicationQueue />} />
        <Route path="kyc" element={<KYCVerification />} />
        <Route path="documents" element={<DocumentReview />} />
        <Route path="followups" element={<ClientFollowups />} />
        <Route path="completed" element={<CompletedTasks />} />
        <Route path="company/:id" element={<CompanyProfile />} />
        <Route path="vault/:companyId" element={<DocumentVault />} />
      </Route>

      {/* Client Portal */}
      <Route path="/client" element={<RequireAuth role="client"><ClientLayout /></RequireAuth>}>
        <Route index element={<ClientDashboard />} />
        <Route path="register" element={<RegisterBusiness />} />
        <Route path="documents" element={<UploadDocuments />} />
        <Route path="track" element={<TrackApplication />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        {/* Shared Corporate Features */}
        <Route path="company" element={<CompanyProfile />} />
        <Route path="company/:id" element={<CompanyProfile />} />
        <Route path="vault" element={<DocumentVault />} />
        <Route path="vault/:companyId" element={<DocumentVault />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
