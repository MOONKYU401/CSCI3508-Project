import React, { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm";
import PetCard from "../components/PetCard";

export default function HomePage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const zip = user?.preferredZip || "80202";
  const type = user?.preferredAnimalType || "Dog";
  const breed = user?.preferredBreed || "";

  useEffect(() => {
    const fetchPets = async () => {
      localStorage.setItem("searchZip", zip);
      localStorage.setItem("animalType", type);
      setLoading(true);

      try {
        // ✅ 1차 검색: zip + type + breed
        const primaryRes = await fetch("https://api.petplace.com/animal", {
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

        const primaryData = await primaryRes.json();
        let results = primaryData.animal || [];

        // ✅ 2차 백업 검색: zip + type only (if no results)
        if (results.length === 0 && breed) {
          const backupRes = await fetch("https://api.petplace.com/animal", {
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
                filterBreed: [], // breed 생략
                filterGender: "",
                filterAge: null,
                filterSize: null,
              },
            }),
          });

          const backupData = await backupRes.json();
          results = backupData.animal || [];
        }

        setPets(results.slice(0, 10)); // 최대 10개
      } catch (err) {
        console.error("Error fetching pets:", err);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [zip, type, breed]);

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
