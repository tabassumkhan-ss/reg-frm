import React from "react";
import { Routes, Route } from "react-router-dom";
import { WalletProvider } from "./WalletContext";
import MobilePage from "./pages/MobilePage";
import AadhaarPage from "./pages/AadhaarPage";
import ProfileFormPage from "./pages/ProfileFormPage";
import PanCardPage from "./pages/PanCardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminEditUserPage from "./pages/AdminEditUserPage";

function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/" element={<MobilePage />} />
        <Route path="/aadhaar" element={<AadhaarPage />} />
        <Route path="/profile-form" element={<ProfileFormPage />} />
        <Route path="/pancard" element={<PanCardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-users" element={<AdminUsersPage />} />
        <Route path="/admin-edit/:id" element={<AdminEditUserPage />} />
      </Routes>
    </WalletProvider>
  );
}

export default App;