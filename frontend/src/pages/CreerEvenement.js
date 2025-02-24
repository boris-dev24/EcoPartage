import React, { useState } from 'react';
import '../styles/Creerevenement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function CreerEvenement() {
const [images, setImages] = useState([]);

const handleImageChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    setImages([...images, ...files]);
  }
};

  return (
    <div className="creer-evenement">
      <header>
        <h1>Événements</h1>
      </header>
      <form>
        <div className="form-group">
          <label htmlFor="titre">Titre de l'événement</label>
          <input 
            type="text" 
            id="titre" 
            placeholder="ex. Vente de garage..." 
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="lieu">Lieu de l'événement</label>
          <input 
            type="text" 
            id="lieu" 
            placeholder="Lieu, adresse de l'événement" 
          />
        </div>
        
        <div className="form-group date-group">
          <div>
            <label htmlFor="dateDebut">Date (Le, ou Du)</label>
            <input type="date" id="dateDebut" />
          </div>
          <div>
            <label htmlFor="dateFin">Jusqu'au</label>
            <input type="date" id="dateFin" />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="infos">Infos sur l'événement</label>
          <textarea 
            id="infos" 
            placeholder="Infos pratiques, description, horaires, etc."
          ></textarea>
        </div>
        
        <div className="form-group">
                  <label>Vous pouvez ajouter 3 images à votre annonce:</label>
                  <div className="image-upload-container">
                    <div className="image-upload">
                      <label htmlFor="image-upload">
                        <FontAwesomeIcon icon={faCamera} size="3x" />
                      </label>
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <div className="image-preview">
                      {images.length > 0 && (
                        <ul>
                          {Array.from(images).map((image, index) => (
                            <li key={index}>{image.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
        
        <p className="info-text">
          Ne diffusez ni votre téléphone ni votre email. Les voisins vous contacteront par la messagerie privée du site.
        </p>
        
        <button type="submit" className="submit-button">Publier</button>
      </form>
    </div>
  );
}

export default CreerEvenement;   
