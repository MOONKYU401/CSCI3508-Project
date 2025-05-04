import React, { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <p>Loading saved pets...</p>;

  return (
    <div className="saved-pets-page">
      <h2>Your Saved Pets</h2>
      {savedPets.length === 0 ? (
        <p>No pets saved yet.</p>
      ) : (
        savedPets.map((pet, index) => <SavedPetCard key={index} pet={pet} />)
      )}
    </div>
  );
}

function SavedPetCard({ pet }) {
  const [petData, setPetData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/external-api/pet/${pet.animalId}`);
        setPetData(res.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotFound(true);
        } else {
          console.error("Error fetching pet data", err);
        }
      }
    };

    fetchPetData();
  }, [pet.animalId]);

  if (notFound) {
    return (
      <div className="pet-card not-found">
        <p><strong>{pet.Name}</strong> has found a new home 🏠</p>
      </div>
    );
  }

  if (!petData) return <p>Loading...</p>;

  return (
    <div className="pet-card">
      <img src={petData.coverImagePath || "https://via.placeholder.com/400x300"} alt={petData.Name} />
      <div>
        <h3>{petData.Name}</h3>
        <p>{petData.breed} • {petData.gender}</p>
        <p>Located at: {petData.City}, {petData.State}</p>
      </div>
    </div>
  );
}
