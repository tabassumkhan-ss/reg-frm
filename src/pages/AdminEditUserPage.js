import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contractConfig";
import "../styles/formcard.css";

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    mobile: "",
    aadhar: "",
    fullName: "",
    email: "",
    password: "",
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pinCode: "",
    referralCode: "",
    pan: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const basic = await contract.getBasicInfo(id);
        const addr = await contract.getAddressInfo(id);
        const kyc = await contract.getKycInfo(id);

        setForm({
          mobile: basic[0],
          aadhar: basic[1],
          fullName: basic[2],
          email: basic[3],
          password: basic[4],
          country: addr[0],
          state: addr[1],
          city: addr[2],
          address1: addr[3],
          address2: addr[4],
          pinCode: addr[5],
          referralCode: kyc[0],
          pan: kyc[1]
        });
      } catch (err) {
        console.error("Error loading user:", err);
        alert("Error loading user: " + (err.reason || err.message));
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      const basic = {
        mobile: form.mobile,
        aadhar: form.aadhar,
        fullName: form.fullName,
        email: form.email,
        password: form.password
      };

      const addr = {
        country: form.country,
        state: form.state,
        city: form.city,
        address1: form.address1,
        address2: form.address2,
        pinCode: form.pinCode
      };

      const kyc = {
        referralCode: form.referralCode,
        pan: form.pan
      };

      const tx = await contract.updateProfileById(id, basic, addr, kyc);
      await tx.wait();

      alert("User updated successfully!");
      navigate("/admin-users");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Error updating user: " + (err.reason || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="form-card">Loading user…</div>;

  return (
    <div className="form-card">
      <h2>Edit User ID {id}</h2>

      <label>Mobile</label>
      <input name="mobile" value={form.mobile} onChange={handleChange} />

      <label>Aadhaar</label>
      <input name="aadhar" value={form.aadhar} onChange={handleChange} />

      <label>Full Name</label>
      <input name="fullName" value={form.fullName} onChange={handleChange} />

      <label>Email</label>
      <input name="email" value={form.email} onChange={handleChange} />

      { /*<label>Password</label>
      <input name="password" type="text" value={form.password} onChange={handleChange} /> */}

      <label>Country</label>
      <input name="country" value={form.country} onChange={handleChange} />

      <label>State</label>
      <input name="state" value={form.state} onChange={handleChange} />

      <label>City</label>
      <input name="city" value={form.city} onChange={handleChange} />

      <label>Address Line 1</label>
      <input name="address1" value={form.address1} onChange={handleChange} />

      <label>Address Line 2</label>
      <input name="address2" value={form.address2} onChange={handleChange} />

      <label>Pin Code</label>
      <input name="pinCode" value={form.pinCode} onChange={handleChange} />

      <label>Referral Code</label>
      <input name="referralCode" value={form.referralCode} onChange={handleChange} />

      <label>PAN</label>
      <input name="pan" value={form.pan} onChange={handleChange} />

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "6px 12px", fontSize: "0.9rem" }}
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>

        <button
          onClick={() => navigate("/admin-users")}
          style={{ padding: "6px 12px", fontSize: "0.9rem" }}
        >
          Cancel
        </button>

        <button
          onClick={() => navigate("/")}
          style={{ padding: "6px 12px", fontSize: "0.9rem" }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default AdminEditUserPage;