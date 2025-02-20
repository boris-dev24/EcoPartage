import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaChevronDown } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownHover = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <div className="slogan-bar">
        Partageons aujourd'hui, préservons demain
      </div>
      <header className="header">
        <div className="logo">EcoPartage</div>
        <nav className="main-nav">
          <ul>
            <li><Link to="/">Accueil</Link></li>
            <li 
              className="dropdown"
              onMouseEnter={() => handleDropdownHover('annonces')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link to="/annonces">Annonces <FaChevronDown className="dropdown-arrow" /></Link>
              <div className={`dropdown-content ${activeDropdown === 'annonces' ? 'active' : ''}`}>
                <Link to="/annonces/creerAnnonce">Créer une annonce</Link>
                <Link to="/annonces/voirAnnonce">Voir les annonces</Link>
              </div>
            </li>
            <li 
              className="dropdown"
              onMouseEnter={() => handleDropdownHover('evenements')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link to="/evenements">Événements <FaChevronDown className="dropdown-arrow" /></Link>
              <div className={`dropdown-content ${activeDropdown === 'evenements' ? 'active' : ''}`}>
                <Link to="/evenements/creerEvenement">Créer un événement</Link>
                <Link to="/evenements/voirEvenement">Voir les événements</Link>
              </div>
            </li>
            <li><Link to="/localisation">Localisation</Link></li>
            <li><Link to="/contactez-nous">Contactez-nous</Link></li>
          </ul>
        </nav>
        <div className="auth-nav">
          <Link to="/inscription" className="auth-button"><FaUser /> Inscription</Link>
          <Link to="/connexion" className="auth-button"><FaSignInAlt /> Connexion</Link>
        </div>
      </header>
    </>
  );
}

export default Header;

