import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../WalletContext";
import "../styles/formcard.css";

const ProfilePage = () => {
  const { formData } = useContext(WalletContext);
  const navigate = useNavigate();

  // Get initials for avatar
  const initials = formData.fullName
    ? formData.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="form-card">
      {/* Header with avatar + name */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>User Profile</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {initials}
          </div>
          <span style={{ fontWeight: "600" }}>{formData.fullName}</span>
        </div>
      </div>

      <form>
        <div className="form-grid">
          <div>
            <label>User ID</label>
            <input type="text" value={formData.userId || ""} readOnly />

            <label>Full Name</label>
            <input type="text" value={formData.fullName || ""} readOnly />

            <label>Country</label>
            <input type="text" value={formData.country || ""} readOnly />

            <label>State</label>
            <input type="text" value={formData.state || ""} readOnly />

            <label>City</label>
            <input type="text" value={formData.city || ""} readOnly />

            <label>Address Line 1</label>
            <input type="text" value={formData.address1 || ""} readOnly />

            <label>Address Line 2</label>
            <input type="text" value={formData.address2 || ""} readOnly />
          </div>

          <div>
            <label>PIN Code</label>
            <input type="text" value={formData.pinCode || ""} readOnly />

            <label>Referral Code</label>
            <input type="text" value={formData.referral || ""} readOnly />

            <label>Email Address</label>
            <input type="text" value={formData.email || ""} readOnly />

            <label>Password</label>
            <input type="password" value={formData.password || ""} readOnly />

            <label>Wallet Address</label>
            <input type="text" value={formData.wallet || ""} readOnly />
          </div>
        </div>

        <br />
        <button type="button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;