import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PetCard from "../components/PetCard";
import SearchForm from "../components/SearchForm";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const type = query.get("type") || "";
  const breed = query.get("breed") || "";
  const zip = query.get("zip") || "";

  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${API_URL}/search`, {
          params: {
            type,
            breed,
            zip,
          },
        });
        console.log("Fetched filtered pets:", response.data);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, [type, breed, zip]);

  return (
    <div>
      <SearchForm />
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Search Results</h2>
      <div className="pet-grid">
        {pets.length > 0 ? (
          pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No pets found.</p>
        )}
      </div>
    </div>
  );
}
