import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { WalletContext } from "../WalletContext";
import { auth } from "../firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import "../styles/formcard.css";
import "../styles/otpmodal.css";

const MobilePage = () => {
  const [mobile, setMobile] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const { formData, setFormData } = useContext(WalletContext);
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      setFormData({ ...formData, wallet: accounts[0] });
    } else {
      alert("MetaMask not found");
    }
  };

  const sendOtp = async () => {
    if (!mobile) return alert("Enter mobile number");
    const phoneNumber = "+91" + mobile;

    setSendingOtp(true);

    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    try {
      const result = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );
      setConfirmationResult(result);
      setShowOtpModal(true);
    } catch (err) {
      console.error("SMS not sent", err);
      alert(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otpDigits];
      newOtp[index] = value;
      setOtpDigits(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const verifyOtp = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) return alert("Enter 6-digit OTP");
    try {
      await confirmationResult.confirm(otp);
      alert("OTP verified!");
      setFormData({ ...formData, mobile });
      setShowOtpModal(false);
      navigate("/aadhaar");
    } catch (err) {
      console.error("Invalid OTP", err);
      alert("Invalid OTP");
    }
  };

  return (
    <div className="form-card">
      <h2>Mobile Verification</h2>

      <button onClick={connectWallet} style={{ marginBottom: "1rem" }}>
        {walletAddress
          ? `Connected: ${walletAddress.substring(0, 6)}...`
          : "Connect Wallet"}
      </button>

      <div id="recaptcha-container"></div>

      {/* Input and button inline */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Enter mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          style={{ flex: 1 }}
        />
        <button onClick={sendOtp} disabled={sendingOtp}>
          {sendingOtp ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>

      <br />
      <button onClick={() => navigate("/admin-login")}>Go to Admin</button>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Enter the 6-digit OTP</h3>
            <div className="otp-inputs">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                />
              ))}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button onClick={verifyOtp}>Verify OTP</button>
              <button onClick={() => setShowOtpModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobilePage;