import React, { useEffect, useState } from "react";
import { JsonRpcProvider, Contract } from "ethers";
import { useNavigate } from "react-router-dom";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contractConfig";
import "../styles/formcard.css";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        // MST testnet RPC URL
        const provider = new JsonRpcProvider("https://testnetrpc.mstblockchain.com");

        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const ids = await contract.getAllUserIds();
        console.log("All user IDs from contract:", ids.map(id => id.toString()));

        const data = [];
        for (const id of ids) {
          try {
            const basic = await contract.getBasicInfo(id);
            data.push({
              id: id.toString(),
              fullName: basic[2] // tuple index
            });
          } catch (err) {
            console.warn("Skipping userId", id.toString(), "because call failed", err);
          }
        }
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="form-card">
      <h2>Registered Users</h2>
      {loading && <p>Loading…</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px" }}>User ID</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Full Name</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td
                  style={{ padding: "8px", cursor: "pointer", color: "#007bff" }}
                  onClick={() => navigate(`/admin-edit/${u.id}`)}
                >
                  {u.id}
                </td>
                <td
                  style={{ padding: "8px", cursor: "pointer", color: "#007bff" }}
                  onClick={() => navigate(`/admin-edit/${u.id}`)}
                >
                  {u.fullName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default AdminUsersPage;