import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email: formData.email,
        password: formData.password,
      });

      // Save user info (or token) after successful login
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/profile");

    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="page-center">
      <AuthForm
        type="login"
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
