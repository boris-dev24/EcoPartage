import React, { useState } from 'react'; 
import '../styles/CreerAnnonce.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';

function CreerAnnonce() {
  const [typeDemande, setTypeDemande] = useState('offre');
  const [titre, setTitre] = useState('');
  const [categorie, setCategorie] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]); 

  const handleTypeDemandeChange = (event) => {
    setTypeDemande(event.target.value);
  };

  const handleTitreChange = (event) => {
    setTitre(event.target.value);
  };

  const handleCategorieChange = (event) => {
    setCategorie(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImages([...images, ...files]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Ajoutez ici la logique pour enregistrer l'annonce
    console.log('Annonce soumise:', {
      typeDemande,
      titre,
      categorie,
      description,
      images, 
    });
  };

  return (
    <div className="creer-annonce-container">
      <h1>Créer une annonce</h1>

      <form onSubmit={handleSubmit} className="annonce-form">
        <div className="form-group">
          <label>Type de demande:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="offre"
                checked={typeDemande === 'offre'}
                onChange={handleTypeDemandeChange}
              />
              Je propose
            </label>
            <label>
              <input
                type="radio"
                value="recherche"
                checked={typeDemande === 'recherche'}
                onChange={handleTypeDemandeChange}
              />
              Je cherche
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="titre">Titre de l'annonce:</label>
          <input
            type="text"
            id="titre"
            value={titre}
            onChange={handleTitreChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categorie">Catégorie:</label>
          <select
            id="categorie"
            value={categorie}
            onChange={handleCategorieChange}
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="meuble">Meuble</option>
            <option value="appareil">Appareil</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="lieu">Lieu de l'annonce</label>
          <input 
            type="text" 
            id="lieu" 
            placeholder="Lieu, adresse de l'annonce" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            placeholder="ex. besoin d'un canapé, je donne mon canapé vintage..."
          />
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

        <p className="note">
          Ne diffusez ni votre téléphone ni votre email. Les personnes vous
          contacteront par la messagerie privée du site.
        </p>

        <button type="submit" className="btn-enregistrer">
          Publier
        </button>
      </form>
    </div>
  );
}

export default CreerAnnonce;


