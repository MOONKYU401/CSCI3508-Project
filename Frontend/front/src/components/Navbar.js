import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const currentType = new URLSearchParams(location.search).get("type");

  const handleSearchByType = (type) => {
    const zip = user?.preferences?.location || "80014"; 
    navigate(`/search?type=${type}&zip=${zip}`);
  };

  return (
    <nav>
      <Link to="/" className="logo">🐾 Adopt a Pet</Link>
      <div className="nav-links">
        <span onClick={() => handleSearchByType("Dog")} className={currentType === "Dog" ? "active-tab" : ""}>
          Dogs
        </span>
        <span onClick={() => handleSearchByType("Cat")} className={currentType === "Cat" ? "active-tab" : ""}>
          Cats
        </span>
        <span onClick={() => handleSearchByType("Other")} className={currentType === "Other" ? "active-tab" : ""}>
          Other Pets
        </span>

        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <span onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/";
            }}>
              Logout
            </span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
