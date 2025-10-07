import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../WalletContext";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contractConfig";
import "../styles/formcard.css";

const PanCardPage = () => {
  const { formData, setFormData } = useContext(WalletContext);
  const [pan, setPan] = useState(formData.pan || "");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePan = (pan) =>
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase());

  const handleSubmit = async () => {
    if (!validatePan(pan)) {
      alert("Please enter a valid PAN number (e.g. ABCDE1234F)");
      return;
    }

    setLoading(true);
    try {
      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      // provider + signer for write
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Build the structs from formData
      const basic = {
        mobile: formData.mobile || "",
        aadhar: formData.aadhar || "",
        fullName: formData.fullName || "",
        email: formData.email || "",
        password: formData.password || "",
      };

      const addr = {
        country: formData.country || "",
        state: formData.state || "",
        city: formData.city || "",
        address1: formData.address1 || "",
        address2: formData.address2 || "",
        pinCode: formData.pinCode || "",
      };

      const kyc = {
        referralCode: formData.referral || "",
        pan: pan,
      };

      // Send transaction
      const tx = await contract.registerProfile(basic, addr, kyc);
      const receipt = await tx.wait();

      // Extract userId from event
      let newUserId = null;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          if (parsed.name === "UserRegistered") {
            newUserId = parsed.args.userId.toString();
            break;
          }
        } catch (err) {
          // ignore non-matching logs
        }
      }

      // Save to context
      setFormData({
        ...formData,
        pan,
        userId: newUserId || "USER-" + Date.now(),
      });

      alert("Registered successfully on MST Testnet!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Error submitting PAN: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>PAN Card Verification</h2>

      <label htmlFor="pan">PAN Number *</label>
      <input
        type="text"
        id="pan"
        placeholder="Enter PAN Number"
        value={pan}
        onChange={(e) => setPan(e.target.value.toUpperCase())}
        maxLength={10}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
};

export default PanCardPage;