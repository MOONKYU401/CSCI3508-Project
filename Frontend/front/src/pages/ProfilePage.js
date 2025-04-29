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
      //No user? redirects to login page
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, preferences: { ...profile.preferences, [e.target.name]: e.target.value } });
  };

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify(profile));
    alert("Preferences Saved!");
  };

  return (
    <div className="page-center">
      <h2>Profile Settings</h2>

      <input
        type="text"
        name="location"
        placeholder="Preferred Location"
        value={profile.preferences?.location || ""}
        onChange={handleChange}
      />

      <input
        type="text"
        name="breed"
        placeholder="Preferred Breed"
        value={profile.preferences?.breed || ""}
        onChange={handleChange}
      />

      <input
        type="text"
        name="contact"
        placeholder="Contact Number"
        value={profile.preferences?.contact || ""}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={profile.email || ""}
        readOnly
      />

      <button onClick={handleSave}>Save Preferences</button>
    </div>
  );
}
