import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../WalletContext";
import "../styles/formcard.css"; // reuse same CSS

const AadhaarPage = () => {
  const { formData, setFormData } = useContext(WalletContext);
  const [aadhaar, setAadhaar] = useState(formData.aadhar || "");
  const navigate = useNavigate();

  const handleOk = (e) => {
    e.preventDefault();
    if (!/^\d{12}$/.test(aadhaar)) {
      alert("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    // store Aadhaar number in context
    setFormData({ ...formData, aadhar: aadhaar });
    // go to profile form page
    navigate("/profile-form");
  };

  return (
    <div className="form-card">
      <h2>Aadhaar Verification</h2>
      <form onSubmit={handleOk}>
        <div className="form-grid">
          <label>
            Aadhaar Number *
            <input
              type="text"
              placeholder="Enter 12-digit Aadhaar Number"
              maxLength={12}
              value={aadhaar}
              onChange={(e) =>
                setAadhaar(e.target.value.replace(/\D/g, ""))
              }
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">OK</button>
        </div>
      </form>
    </div>
  );
};

export default AadhaarPage;