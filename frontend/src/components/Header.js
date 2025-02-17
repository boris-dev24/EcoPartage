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
                <Link to="/annonces/creer">Créer une annonce</Link>
                <Link to="/annonces/voir">Voir les annonces</Link>
              </div>
            </li>
            <li 
              className="dropdown"
              onMouseEnter={() => handleDropdownHover('evenements')}
              onMouseLeave={handleDropdownLeave}
            >
              <Link to="/evenements">Événements <FaChevronDown className="dropdown-arrow" /></Link>
              <div className={`dropdown-content ${activeDropdown === 'evenements' ? 'active' : ''}`}>
                <Link to="/evenements/creer">Créer un événement</Link>
                <Link to="/evenements/voir">Voir les événements</Link>
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

