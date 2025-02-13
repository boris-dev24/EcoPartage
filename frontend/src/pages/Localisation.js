
import React from 'react';
import '../styles/Localisation.css';

function Localisation() {
  return (
    <div className="localisation">
      <h1>Localisation</h1>
      <div className="map-container">
        {/*  carte interactive */}
        <p>Carte interactive à intégrer ici</p>
      </div>
      <div className="location-selector">
        <h2>Choisissez votre lieu</h2>
        {/*  barre de recherche */}
        <input type="text" placeholder="Entrez votre localisation" />
      </div>
    </div>
  );
}

export default Localisation;

