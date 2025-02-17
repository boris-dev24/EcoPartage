
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignInAlt, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import '../styles/Header.css';

function Header() {

  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownHover = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  // Etat pour savoir si l'utilisateur est connecté
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Pour gérer le chargement des données utilisateur

  useEffect(() => {
    // Vérifier si les données utilisateur existent dans le localStorage
    const userData = localStorage.getItem('user');
    
    // Si les données existent et sont valides, on les parse
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser); // Si réussi, on met à jour l'état
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur depuis le localStorage', error);
      }
    }

    // Fin de la récupération des données utilisateur, on indique que le chargement est terminé
    setLoading(false);
  }, []);

  const handleLogout = () => {
    // Logique de déconnexion
    localStorage.removeItem('user'); // Retirer les données utilisateur du localStorage
    setUser(null); // Réinitialiser l'état
  };

  if (loading) {
    // Afficher un indicateur de chargement ou rien pendant que les données sont en cours de récupération
    return <div>Chargement...</div>;
  }

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
         {!user ?(
          <>
          <Link to="/inscription"><FaUser /> Inscription</Link>
          <Link to="/connexion"><FaSignInAlt /> Connexion</Link>
          </>
         ):(
          <>
              <span className="user-name">{user.nom}</span> {/* Afficher le nom de l'utilisateur */}
              <button onClick={handleLogout}><FaSignOutAlt /> Déconnexion</button> {/* Bouton de déconnexion */}
          </>
         )} 
          <Link to="/inscription" className="auth-button"><FaUser /> Inscription</Link>
          <Link to="/connexion" className="auth-button"><FaSignInAlt /> Connexion</Link>
        </div>
      </header>
    </>
  );
}

export default Header;

