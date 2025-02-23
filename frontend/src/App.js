import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Localisation from './pages/Localisation';
import ContactezNous from './pages/ContactezNous';
import CreerAnnonce from './pages/CreerAnnonce';
import CreerEvenement from './pages/CreerEvenement';
import VoirAnnonce from './pages/VoirAnnonce';
import VoirEvenement from './pages/VoirEvenement';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/localisation" element={<Localisation />} />
            <Route path="/contactez-nous" element={<ContactezNous />} />
            <Route path="/annonces/creerAnnonce" element={<CreerAnnonce />} />
            <Route path="/evenements/creerEvenement" element={<CreerEvenement />} />
            <Route path="/annonces/voirAnnonce" element={<VoirAnnonce />} />
            <Route path="/evenements/voirEvenement" element={<VoirEvenement />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
