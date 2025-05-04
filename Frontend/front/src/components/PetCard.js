import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function PetCard({ pet }) {
  const navigate = useNavigate();

  const Name = pet.Name;
  const breed = pet.Breed || pet.Breed1;
  const gender = pet.Gender;
  const age = pet.Age;
  const image = pet.coverImagePath || "https://via.placeholder.com/400x300?text=No+Image";
  const location = pet["Located at"] || `${pet.City || ""}, ${pet.State || ""}`;
  const animalId = pet.animalId;

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  const zip = localStorage.getItem("searchZip");
  const animalType = localStorage.getItem("animalType");

  const handleSave = async () => {
    if (!token) {
      alert("You must be logged in to save pets.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/auth/user/save-pet`,
        {
          animalId,
          Name,
          zipPostal: zip || "",
          breed,
          animalType: animalType || ""
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Pet saved successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save pet.";
      alert(msg);
      console.error("Save pet error:", err);
    }
  };

  const handleAdoptClick = () => {
    navigate(`/pet/${animalId}`, { state: { pet } });
  };

  return (
    <div className="pet-card">
      <img src={image} alt={Name} />
      <div className="pet-card-content">
        <h2>{Name}</h2>
        <p>{breed}</p>
        <p>{gender} · {age}</p>
        <p>{location}</p>
        <button onClick={handleAdoptClick}>Adopt Me</button>
        {token && (
          <button onClick={handleSave} style={{ marginTop: "0.5rem" }}>
            ❤️ Save Pet
          </button>
        )}
      </div>
    </div>
  );
}
