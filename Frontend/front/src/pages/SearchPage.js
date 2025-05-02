import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchForm from "../components/SearchForm";
import PetCard from "../components/PetCard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchPage() {
  const query = useQuery();
  const location = useLocation();
  const navigate = useNavigate();

  const type = query.get("type") || "Dog";
  const breed = query.get("breed") || "";
  const zip = query.get("zip") || "";
  const pageFromURL = parseInt(query.get("page")) || 1;

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(pageFromURL);

  const pageSize = 30;

  useEffect(() => {
    const newParams = new URLSearchParams({ type, breed, zip, page });
    navigate(`/search?${newParams.toString()}`, { replace: true });
  }, [page, type, breed, zip, navigate]);


  useEffect(() => {
    setPage(1);
  }, [type, breed, zip]);


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
              milesRadius: "10",
            },
            animalFilters: {
              startIndex: (page - 1) * pageSize,
              filterAnimalType: type,
              filterBreed: breed ? [breed] : [],
              filterGender: "",
              filterAge: null,
              filterSize: null,
            },
          }),
        });

        const data = await res.json();
        setPets(data.animal || []);
        setTotalCount(data.totalCount || 0);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
        setPets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [type, breed, zip, page]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div>
      <SearchForm />

      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Search Results</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : pets.length > 0 ? (
        <>
          <div className="pet-grid">
            {pets.map((pet, index) => (
              <PetCard key={index} pet={pet} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "1rem",
                background: page === 1 ? "#ccc" : "#eee",
                border: "none",
                borderRadius: "6px",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >
              ⬅ Prev
            </button>

            <span>
              Page <strong>{page}</strong> of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              style={{
                padding: "0.5rem 1rem",
                marginLeft: "1rem",
                background: page >= totalPages ? "#ccc" : "#eee",
                border: "none",
                borderRadius: "6px",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
              }}
            >
              Next ➡
            </button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No pets found for your search.
        </p>
      )}
    </div>
  );
}
