import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setProfile(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: value,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(profile));
    alert("Preferences Saved!");
  };

  return (
    <div style={{ backgroundColor: "#fffbe6", minHeight: "100vh", paddingTop: "60px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Profile Settings
      </h1>
      <p style={{ textAlign: "center", marginBottom: "2rem", color: "#555" }}>
        Update your preferences and contact information
      </p>

      <form
        style={{
          background: "#fff",
          maxWidth: "500px",
          margin: "0 auto",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          name="location"
          placeholder="Preferred Location (ZIP)"
          value={profile.preferences?.location || ""}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="breed"
          placeholder="Preferred Breed"
          value={profile.preferences?.breed || ""}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="animalType"
          value={profile.preferences?.animalType || ""}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Preferred Animal Type</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={profile.preferences?.contact || ""}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email || ""}
          readOnly
          style={inputStyle}
        />

        <button
          type="button"
          onClick={handleSave}
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
          Save Preferences
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
