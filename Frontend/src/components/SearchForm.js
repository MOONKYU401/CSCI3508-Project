import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SearchForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get("type") || "Dog";

  const [type, setType] = useState(initialType);
  const [breed, setBreed] = useState("");
  const [zip, setZip] = useState("");
  const [allBreeds, setAllBreeds] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(""); 

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetch(`https://api.petplace.com/breed/${type}`);
        const data = await res.json();
        setAllBreeds(data || []);
      } catch (err) {
        console.error("Failed to load breeds:", err);
      }
    };

    fetchBreeds();
    setSuggestions([]);
    setBreed("");
  }, [type]);

  const handleBreedChange = (e) => {
    const input = e.target.value;
    setBreed(input);

    if (input.length > 0) {
      const matches = allBreeds.filter((b) =>
        b.breedValue.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    setBreed(value);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zip.trim()) {
      setError("Please enter a ZIP code.");
      return;
    }

    setError(""); 
    localStorage.setItem("searchZip", zip);
    localStorage.setItem("animalType", type);
    navigate(`/search?type=${type}&breed=${breed}&zip=${zip}`);
  };

  return (
    <form className="search-hero" onSubmit={handleSubmit}>
      <h1>Find your new best friend</h1>
      <div className="search-filters">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>

        <div style={{ position: "relative", minWidth: "160px" }}>
          <input
            type="text"
            placeholder="Breed"
            value={breed}
            onChange={handleBreedChange}
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                background: "white",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "0.5rem",
                listStyle: "none",
                marginTop: "2px",
                zIndex: 1000,
                width: "100%",
              }}
            >
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  style={{ padding: "0.3rem", cursor: "pointer" }}
                  onClick={() => handleSuggestionClick(s.breedValue)}
                >
                  {s.breedValue}
                </li>
              ))}
            </ul>
          )}
        </div>

        <input
          type="text"
          placeholder="ZIP code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          style={{ borderColor: error ? "red" : "" }}
        />
        <button type="submit">Search</button>
      </div>
      {error && (
        <p style={{ color: "red", marginTop: "0.5rem", fontSize: "0.9rem" }}>
          {error}
        </p>
      )}
    </form>
  );
}
