import React from "react";
import "../App.css";

export default function PetCard({ pet }) {
  const handleAdoptClick = () => {
    if (pet.shelter && pet.shelter.contactEmail) {
      window.location.href = `mailto:${pet.shelter.contactEmail}?subject=Inquiry about adopting ${pet.name}`;
    } else {
      alert("No contact information available for this shelter.");
    }
  };

  return (
    <div className="pet-card">
      <img src={pet.imageUrl} alt={pet.name} />
      <div className="pet-card-content">
        <h2>{pet.name}</h2>
        <p>{pet.breed}</p>
        <p>{pet.shelter?.location}</p>
        <button onClick={handleAdoptClick}>Adopt me</button>
      </div>
    </div>
  );
}
