import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function PetDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pet = location.state?.pet;

  if (!pet) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>Pet not found</h2>
        <button onClick={() => navigate(-1)} style={buttonStyle}>
          ⬅ Back
        </button>
      </div>
    );
  }

  const image = pet.coverImagePath || "https://via.placeholder.com/400x400?text=No+Image";
  const breed = pet.Breed || `${pet.Breed1 || ""} ${pet.Breed2 || ""}`.trim();

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={buttonStyle}>
        ⬅ Back
      </button>

      <h1 style={{ marginTop: "1rem" }}>{pet.Name}</h1>

      <div style={imageWrapperStyle}>
        <img src={image} alt={pet.Name} style={imageStyle} />
      </div>

      <div style={infoBoxStyle}>
        <p><strong>Breed:</strong> {breed}</p>
        <p><strong>Gender:</strong> {pet.Gender}</p>
        <p><strong>Age:</strong> {pet.Age}</p>
        <p><strong>Animal Type:</strong> {pet["Animal type"] || pet.filterAnimalType}</p>
        <p><strong>Shelter:</strong> {pet["Located at"]}</p>
        <p><strong>City/State:</strong> {pet.City}, {pet.State}</p>
        <p><strong>Arrived:</strong> {pet["Brought to the shelter"]}</p>
        <p><strong>Birth Date:</strong> {pet.filterDOB?.split("T")[0]}</p>
        <p><strong>Size:</strong> {pet.filterSize}</p>
        <p><strong>Breed Group:</strong> {pet.filterBreedGroup}</p>
        <p><strong>Pet ID:</strong> {pet.animalId}</p>
      </div>
    </div>
  );
}

const containerStyle = {
  maxWidth: "700px",
  margin: "2rem auto",
  padding: "1.5rem",
  background: "#fff",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const imageWrapperStyle = {
  width: "100%",
  aspectRatio: "1 / 1",
  overflow: "hidden",
  borderRadius: "10px",
  marginBottom: "1rem",
  backgroundColor: "#f9f9f9",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const infoBoxStyle = {
  lineHeight: "1.7",
  fontSize: "1rem",
};

const buttonStyle = {
  padding: "10px 16px",
  backgroundColor: "#eee",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};
