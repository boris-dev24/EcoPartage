import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./components/login";
import SignUp from "./components/register";
import Home from "./screen/Home";
import Annonces from "./screen/Annonces";
import CreerAnnonce from './screen/CreerAnnonce';
import Localisation from "./screen/Localisation";
import Evenements from "./screen/Evenements";
import Contact from "./screen/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { ToastContainer } from "react-toastify";
import Profile from "./components/profile";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { auth } from "./components/firebase";

function App() {
  const [user, setUser] = useState();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  });
  return (
  <Router>
    <Navbar />
    <div className="container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Annonces" element={<Annonces />} />
        <Route path="/CreerAnnonce" element={<CreerAnnonce />} />
        <Route path="/Evenements" element={<Evenements />} />
        <Route path="/Localisation" element={<Localisation />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
    </div>
    <Footer />
  </Router>
  );
}

export default App;
