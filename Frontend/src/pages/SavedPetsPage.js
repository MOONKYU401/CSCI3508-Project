import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SavedPetsPage() {
  const [savedPets, setSavedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchSavedPets = async () => {
      try {
        const res = await axios.get(`${API_BASE}/auth/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedPets(res.data.savedPets || []);
      } catch (err) {
        console.error("Failed to load saved pets", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPets();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Your Saved Pets</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading saved pets...</p>
      ) : savedPets.length === 0 ? (
        <div style={emptyCardStyle}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
            alt="No pets"
            style={{ width: "100px", marginBottom: "1rem" }}
          />
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            No pets saved yet. Start exploring!
          </p>
        </div>
      ) : (
        <div className="pet-grid">
          {savedPets.map((pet, index) => (
            <SavedPetCard
              key={index}
              pet={pet}
              onRemove={() =>
                setSavedPets((prev) => prev.filter((p) => p.animalId !== pet.animalId))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SavedPetCard({ pet, onRemove }) {
  const [petData, setPetData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [removing, setRemoving] = useState(false);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const res = await axios.post("https://api.petplace.com/animal", {
          locationInformation: {
            zipPostal: pet.zipPostal,
            milesRadius: "10",
            clientId: null,
          },
          animalFilters: {
            startIndex: 0,
            filterAnimalType: pet.animalType,
            filterBreed: [],
            filterGender: "",
            filterAge: null,
            filterSize: null,
          },
        });

        const match = res.data.animal?.find(
          (a) => String(a.animalId) === String(pet.animalId)
        );

        if (match) {
          setPetData(match);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error("Error fetching pet data", err);
        setNotFound(true);
      }
    };

    fetchPetData();
  }, [pet.animalId, pet.zipPostal, pet.animalType]);

  const handleRemove = async () => {
    if (!window.confirm(`Remove ${pet.Name}?`)) return;
    setRemoving(true);
    try {
      await axios.delete(`${API_BASE}/auth/user/saved-pet/${pet.animalId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onRemove();
    } catch (err) {
      console.error("Failed to remove pet", err);
      alert("Failed to remove pet.");
    } finally {
      setRemoving(false);
    }
  };

  const handleViewDetails = () => {
    if (!petData) return;
    navigate(`/pet/${petData.animalId}`, {
      state: {
        pet: petData,
        extra: {
          zipPostal: pet.zipPostal,
          animalType: pet.animalType,
        },
      },
    });
  };

  if (notFound) {
    return (
      <div className="pet-card not-found">
        <p><strong>{pet.Name}</strong> has found a new home 🏠</p>
        <button onClick={handleRemove} disabled={removing}>
          💔 Remove
        </button>
      </div>
    );
  }

  if (!petData) return <p>Loading...</p>;

  return (
    <div className="pet-card">
      <img
        src={petData.coverImagePath || "https://via.placeholder.com/400x300"}
        alt={petData.Name}
        style={{
          objectFit: "cover",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "8px",
        }}
      />
      <div style={{ padding: "1rem" }}>
        <h3>{petData.Name}</h3>
        <p>{petData.Breed1} {petData.Breed2 ? `• ${petData.Breed2}` : ""}</p>
        <p>Located at: {petData.City}, {petData.State}</p>
        <div style={{ marginTop: "0.8rem", display: "flex", gap: "0.5rem" }}>
          <button
            onClick={handleViewDetails}
            style={{
              padding: "6px 12px",
              backgroundColor: "#eef",
              border: "1px solid #99c",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              color: "#000",
            }}
          >
            🔍 View Details
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            style={{
              padding: "6px 12px",
              backgroundColor: "#ffdddd",
              color: "#c00",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            💔 Remove
          </button>
        </div>
      </div>
    </div>
  );
}

const emptyCardStyle = {
  background: "#fffbe6",
  maxWidth: "400px",
  margin: "3rem auto",
  padding: "2rem",
  borderRadius: "12px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  textAlign: "center",
};
