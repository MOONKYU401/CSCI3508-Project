import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SearchForm from "./components/SearchForm";
import PetCard from "./components/PetCard";
import SearchPage from "./pages/SearchPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import axios from "axios";
import "./App.css";

function App() {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await axios.get(`${API_URL}/api/pets`);
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };

    fetchPets();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchForm />
              <div className="pet-grid">
                {pets.map((pet, index ) => (
                  <PetCard key={index} pet={pet} />
                ))}
              </div>
              {/* You can later add real pets here dynamically if you want */}
            </>
          }
        />
        <Route path="/search" element={<SearchPage pets={pets} />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
