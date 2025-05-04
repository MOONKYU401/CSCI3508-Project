import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    password: "",
    phone: "",
    state: "",
    preferredZip: ""
  });

  const navigate = useNavigate();
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phonePattern = /^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    const zipPattern = /^\d{5}$/;

    if (formData.phone && !phonePattern.test(formData.phone)) {
      alert("Please enter a valid US phone number (e.g., 123-456-7890)");
      return;
    }

    if (!zipPattern.test(formData.preferredZip)) {
      alert("Please enter a valid 5-digit ZIP code");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/auth/signup`, formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Could not create account. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#fffbe6", minHeight: "100vh", paddingTop: "60px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
        Join Adopt a Pet 🐾
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#555" }}>
        Sign up to start saving your favorite pets!
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
          type="text"
          name="FullName"
          placeholder="Full Name"
          value={formData.FullName}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          style={inputStyle}
        />
        <select
          name="state"
          value={formData.state}
          onChange={handleChange}
          required
          style={{ ...inputStyle, backgroundColor: "#fff" }}
        >
          <option value="">Select State</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          name="preferredZip"
          placeholder="ZIP Code"
          value={formData.preferredZip}
          onChange={handleChange}
          required
          style={inputStyle}
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
            marginTop: "1rem",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
};
