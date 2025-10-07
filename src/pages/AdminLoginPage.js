import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/formcard.css";

const AdminLoginPage = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple static password check for admin
    if (password === "admin123") {
      navigate("/admin-users");
    } else {
      alert("Invalid admin password!");
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: "400px", margin: "auto" }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-grid">
          <label>
            Password *
            <div className="password-field" style={{ display: "flex", alignItems: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{ flex: 1 }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
                style={{
                  cursor: "pointer",
                  marginLeft: "8px",
                  fontSize: "1.1rem",
                  color: "#555",
                }}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </label>
        </div>

        <div className="form-actions">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginPage;