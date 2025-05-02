import React from "react";
import "../App.css";

export default function PetCard({ pet }) {
  const name = pet.Name || "Unknown Name";
  const breed = pet.Breed || pet.Breed1 || "Unknown Breed";
  const gender = pet.Gender || "Unknown";
  const age = pet.Age || "";
  const image = pet.coverImagePath || "https://via.placeholder.com/400x300?text=No+Image";
  const location = pet["Located at"] || `${pet.City || ""}, ${pet.State || ""}`;

  const handleAdoptClick = () => {
    const subject = `Inquiry about adopting ${name}`;
    window.location.href = `mailto:adopt@your-shelter.org?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="pet-card">
      <img src={image} alt={name} />
      <div className="pet-card-content">
        <h2>{name}</h2>
        <p>{breed}</p>
        <p>{gender} · {age}</p>
        <p>{location}</p>
        <button onClick={handleAdoptClick}>Adopt me</button>
      </div>
    </div>
  );
}
