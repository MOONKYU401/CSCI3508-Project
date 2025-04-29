import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function SignUpPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const API_URL = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(`${API_URL}/api/signup`, {
        email: formData.email,
        password: formData.password,
      });

      //Stores user info (or token) after successful signup
      localStorage.setItem("user", JSON.stringify(response.data));

      navigate("/profile");

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Could not create account. Please try again.");

    }
  };

  return (
    <div className="page-center">
      <AuthForm type="signup" formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} />
    </div>
  );
}
