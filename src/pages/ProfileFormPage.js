import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WalletContext } from "../WalletContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import "../styles/formcard.css";

const ProfileFormPage = () => {
  const { formData, setFormData } = useContext(WalletContext);

  const [fullName, setFullName] = useState(formData.fullName || "");
  const [country, setCountry] = useState(formData.country || "");
  const [stateName, setStateName] = useState(formData.state || "");
  const [city, setCity] = useState(formData.city || "");
  const [address1, setAddress1] = useState(formData.address1 || "");
  const [address2, setAddress2] = useState(formData.address2 || "");
  const [pinCode, setPinCode] = useState(formData.pinCode || "");
  const [referral, setReferral] = useState(formData.referral || "");
  const [email, setEmail] = useState(formData.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sending, setSending] = useState(false);

  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email first");
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setSending(true);

    try {
      await emailjs.send(
        "email786", // your EmailJS service ID
        "template_5xjsa1h", // your template ID
        {
          email: email,
          passcode: code,
          time: new Date().toLocaleTimeString(),
        },
        "N1yBOALEyNErZy855" // replace with your actual public key
      );

      setSending(false);
      setOtpSent(true);
      setOtpInputs(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      alert("OTP sent to your email!");
    } catch (err) {
      setSending(false);
      console.error("Error sending OTP:", err);
      alert("Error sending OTP: " + (err.text || err.message));
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpInputs];
    newOtp[index] = value;
    setOtpInputs(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyOtp = () => {
    const entered = otpInputs.join("");
    if (entered === generatedOtp) {
      setOtpVerified(true);
      setOtpSent(false);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !country || !stateName || !city) {
      alert("Please fill all required fields");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Enter a valid email address");
      return;
    }
    if (pinCode.length !== 6) {
      alert("Enter a valid 6-digit PIN code");
      return;
    }
    if (!password) {
      alert("Please enter password");
      return;
    }
    if (!otpVerified) {
      alert("Please verify the OTP sent to your email");
      return;
    }

    setFormData({
      ...formData,
      fullName,
      country,
      state: stateName,
      city,
      address1,
      address2,
      pinCode,
      referral,
      email,
      password,
    });

    navigate("/pancard");
  };

  return (
    <div className="form-card">
      <h2>Profile Information</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Full Name *
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </label>

          <label>
            Country *
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </label>

          <label>
            State *
            <input
              type="text"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </label>

          <label>
            City *
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>

          <label>
            Address Line 1
            <input
              type="text"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </label>

          <label>
            Address Line 2
            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </label>

          <label>
            PIN Code *
            <input
              type="text"
              maxLength="6"
              value={pinCode}
              onChange={(e) =>
                setPinCode(e.target.value.replace(/\D/g, ""))
              }
            />
          </label>

          <label>
            Referral Code
            <input
              type="text"
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            />
          </label>

          <label>
            Email Address *
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sending}
                style={{ padding: "4px 8px" }}
              >
                {sending ? "Sending..." : "Send OTP"}
              </button>
            </div>
          </label>

          <label>
            Password *
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit">Register</button>
        </div>
      </form>

      {/* OTP Modal */}
      {otpSent && (
        <div
          className="otp-modal"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3>Enter 6-digit OTP</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", margin: "1rem 0" }}>
              {otpInputs.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type="text"
                  maxLength="1"
                  value={v}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  style={{
                    width: "40px",
                    height: "40px",
                    textAlign: "center",
                    fontSize: "18px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                background: "#007bff",
                color: "#fff",
                border: "none",
              }}
            >
              Verify
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFormPage;