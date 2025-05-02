import React, { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm";
import PetCard from "../components/PetCard";

export default function HomePage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const zip = user?.preferences?.location || "80202";
  const breed = user?.preferences?.breed || "";
  const type = "Dog";

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://api.petplace.com/animal", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locationInformation: {
              clientId: null,
              zipPostal: zip,
              milesRadius: "25",
            },
            animalFilters: {
              startIndex: 0,
              filterAnimalType: type,
              filterBreed: breed ? [breed] : [],
              filterGender: "",
              filterAge: null,
              filterSize: null,
            },
          }),
        });

        const data = await res.json();
        const results = data.animal || []; 
        setPets(results.slice(0, 10));     
      } catch (err) {
        console.error("Error fetching pets:", err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [zip, breed]);

  return (
    <>
      <SearchForm />
      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>
        {user
          ? `Recommended for You (${zip})`
          : "Recommended Pets Near Denver"}
      </h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : pets.length > 0 ? (
        <div className="pet-grid">
          {pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>No pets found.</p>
      )}
    </>
  );
}
