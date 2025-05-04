import React from "react";

export default function AuthForm({ type, formData, setFormData, handleSubmit }) {
  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>{type === "signup" ? "Sign Up" : "Log In"}</h2>

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <button type="submit">{type === "signup" ? "Create Account" : "Log In"}</button>
    </form>
  );
}
