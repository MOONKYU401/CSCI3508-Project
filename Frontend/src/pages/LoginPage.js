import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [formData, setFormData] = useState({ Email: "", password: "" });
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid email or password.");
    }
  };

  return (
    <div style={{ backgroundColor: "#fffbe6", minHeight: "100vh", paddingTop: "60px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Welcome Back 👋
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#555" }}>
        Log in to continue finding your new best friend
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          maxWidth: "400px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "1.5rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            backgroundColor: "#222",
            color: "#fff",
            padding: "12px",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
