import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignInAlt } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {
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
            <li className="dropdown">
              <Link to="/annonces">Annonces</Link>
              <div className="dropdown-content">
                <Link to="/annonces/creer">Créer une annonce</Link>
                <Link to="/annonces/voir">Voir les annonces</Link>
              </div>
            </li>
            <li className="dropdown">
              <Link to="/evenements">Événements</Link>
              <div className="dropdown-content">
                <Link to="/evenements/creer">Créer un événement</Link>
                <Link to="/evenements/voir">Voir les événements</Link>
              </div>
            </li>
            <li><Link to="/localisation">Localisation</Link></li>
            <li><Link to="/contactez-nous">Contactez-nous</Link></li>
          </ul>
        </nav>
        <div className="auth-nav">
          <Link to="/inscription"><FaUser /> Inscription</Link>
          <Link to="/connexion"><FaSignInAlt /> Connexion</Link>
        </div>
      </header>
    </>
  );
}

export default Header; 

