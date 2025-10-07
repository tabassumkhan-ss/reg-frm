import React, { createContext, useState } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [formData, setFormData] = useState({
    mobile: "",
    aadhar: "",
    fullName: "",
    country: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
    pinCode: "",
    referralCode: "",
    password: "",
    email: "",
    pan: "",
    userId: "", // new field
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } catch (err) {
        console.error("Error connecting wallet:", err);
      }
    } else {
      alert("MetaMask not detected!");
    }
  };

  return (
    <WalletContext.Provider
      value={{ walletAddress, connectWallet, formData, setFormData }}
    >
      {children}
    </WalletContext.Provider>
  );
};
