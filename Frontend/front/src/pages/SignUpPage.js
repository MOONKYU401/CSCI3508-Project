import React, { useState } from "react";
import AuthForm from "../components/AuthForm";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./SignUpPage.css"; 

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

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/profile");

    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert("Could not create account. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create your account</h2>
        <p>Start your adoption journey by creating a free account.</p>

        <AuthForm
          type="signup"
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
