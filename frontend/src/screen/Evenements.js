import React, { useState } from 'react';
import { auth, db, imageDb } from "../components/firebase";
import { setDoc, doc, collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "../style/creerAnnonce.css";

const Evenements = () => {
  // État initial du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: '',
    etat: '',
    prix: '',
    prixNegociable: false,
    gratuit: false,
    ville: '',
    codePostal: '',
    adresse: '',
    images: [],
    location: {
      latitude: null,
      longitude: null
    },
    termsAccepted: false
  });

  // État pour indiquer si le formulaire est en cours de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État des erreurs
  const [errors, setErrors] = useState({});

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
      
      // Si "Gratuit" est coché, on vide le prix
      if (name === 'gratuit' && checked) {
        setFormData({
          ...formData,
          [name]: checked,
          prix: ''
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Gestion du téléchargement des images
  const handleImageUpload = (e) => {
    const fileList = Array.from(e.target.files);
    
    // Limiter à 4 images maximum
    if (formData.images.length + fileList.length > 4) {
      setErrors({
        ...errors,
        images: 'Vous ne pouvez pas télécharger plus de 4 images.'
      });
      return;
    }
    
    // Traitement pour preview des images
    const newImages = fileList.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
    
    // Supprimer l'erreur si elle existait
    if (errors.images) {
      const newErrors = {...errors};
      delete newErrors.images;
      setErrors(newErrors);
    }
  };

  // Supprimer une image
  const removeImage = (index) => {
    const newImages = [...formData.images];
    // Libérer l'URL de l'objet pour éviter les fuites de mémoire
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setFormData({
      ...formData,
      images: newImages
    });
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titre.trim()) newErrors.titre = 'Le titre est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.categorie) newErrors.categorie = 'La catégorie est obligatoire';
    if (!formData.etat) newErrors.etat = 'L\'état du produit est obligatoire';
    if (!formData.gratuit && !formData.prix) newErrors.prix = 'Le prix est obligatoire sauf pour les dons';
    if (!formData.ville.trim()) newErrors.ville = 'La ville/région est obligatoire';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est obligatoire';
    
    // Vérification du code postal obligatoire
    if (!formData.codePostal.trim()) {
        newErrors.codePostal = 'Le code postal est obligatoire';
    } else {
        // Vérification du format et de la région (Québec : G, H, J)
        const codePostalRegex = /^[GHJ][0-9][A-Z] [0-9][A-Z][0-9]$/i;
        if (!codePostalRegex.test(formData.codePostal.trim())) {
            newErrors.codePostal = "Entrez un code postal québécois valide (ex: H3A 1B1)";
        }
    }

    if (formData.images.length === 0) newErrors.images = 'Au moins une image est obligatoire';
    
    // Vérification de l'acceptation des conditions d'utilisation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Vous devez accepter les conditions d\'utilisation';
    }

    return newErrors;
  };

  // Obtenir la géolocalisation
  const getGeolocation = () => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            };
            resolve(locationData);
          },
          (error) => {
            console.warn("Impossible d'obtenir la géolocalisation:", error.message);
            resolve({ latitude: null, longitude: null }); // Continuer même en cas d'erreur
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.warn("La géolocalisation n'est pas supportée par votre navigateur");
        resolve({ latitude: null, longitude: null });
      }
    });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Vérifier si l'utilisateur est connecté
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        toast.error("Vous devez être connecté pour créer une annonce", { position: "bottom-center" });
        return;
      }
      
      // Tenter d'obtenir les coordonnées géographiques
      let locationData = { latitude: null, longitude: null };
      
      try {
        locationData = await getGeolocation();
      } catch (error) {
        console.warn("Erreur lors de la géolocalisation:", error);
        // Continuer sans les coordonnées
      }
      
      // Préparation des données pour Firestore (sans les objets File)
      const annonceData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        titre: formData.titre,
        description: formData.description,
        categorie: formData.categorie,
        etat: formData.etat,
        prix: formData.gratuit ? 0 : Number(formData.prix),
        prixNegociable: formData.prixNegociable,
        gratuit: formData.gratuit,
        ville: formData.ville,
        codePostal: formData.codePostal,
        adresse: formData.adresse,
        location: {
          latitude: locationData.latitude,
          longitude: locationData.longitude
        },
        termsAccepted: true, // On enregistre que l'utilisateur a accepté les conditions
        dateCreation: new Date(),
        nombreImages: formData.images.length
      };
      
      // Ajout du document à la collection "Annonces"
      const docRef = await addDoc(collection(db, "Annonces"), annonceData);
      
      console.log("Annonce créée avec ID:", docRef.id);
      
      // Afficher un message de succès
      toast.success("Annonce publiée avec succès!", { position: "top-center" });
      
      // Réinitialiser le formulaire après soumission réussie
      setFormData({
        titre: '',
        description: '',
        categorie: '',
        etat: '',
        prix: '',
        prixNegociable: false,
        gratuit: false,
        ville: '',
        codePostal: '',
        adresse: '',
        images: [],
        location: {
          latitude: null,
          longitude: null
        },
        termsAccepted: false
      });
      setErrors({});
      
    } catch (error) {
      console.error("Erreur lors de la création de l'annonce:", error.message);
      toast.error("Erreur lors de la création de l'annonce: " + error.message, { position: "bottom-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options pour les catégories et états
  const categories = [
    'Électronique', 'Meubles', 'Vêtements', 'Véhicules', 'Immobilier',
    'Loisirs', 'Sports', 'Bricolage', 'Jardinage', 'Livres', 'Multimédia',
    'Animaux', 'Services', 'Emploi', 'Autres'
  ];
  
  const etats = [
    'Neuf', 'Comme neuf', 'Bon état', 'Usé mais fonctionnel', 'Pour pièces'
  ];

  return (
    <div className="form-container">
      <h1>Créer une annonce</h1>
      <p className="form-intro">Complétez tous les champs obligatoires pour publier votre annonce</p>
      
      <form onSubmit={handleSubmit}>
        {/* Section Titre */}
        <div className="form-group">
          <label htmlFor="titre">Titre de l'annonce *</label>
          <input
            type="text"
            id="titre"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Ex: Vélo de route en bon état"
            className={errors.titre ? 'error' : ''}
          />
          {errors.titre && <span className="error-message">{errors.titre}</span>}
        </div>
        
        {/* Section Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Détails sur l'objet (état, marque, modèle, défauts, etc.)"
            rows="6"
            className={errors.description ? 'error' : ''}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        
        {/* Section Catégorie */}
        <div className="form-group">
          <label htmlFor="categorie">Catégorie *</label>
          <select
            id="categorie"
            name="categorie"
            value={formData.categorie}
            onChange={handleChange}
            className={errors.categorie ? 'error' : ''}
          >
            <option value="">Sélectionnez une catégorie</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.categorie && <span className="error-message">{errors.categorie}</span>}
        </div>
        
        {/* Section État */}
        <div className="form-group">
          <label htmlFor="etat">État du produit *</label>
          <select
            id="etat"
            name="etat"
            value={formData.etat}
            onChange={handleChange}
            className={errors.etat ? 'error' : ''}
          >
            <option value="">Sélectionnez l'état</option>
            {etats.map((etat, index) => (
              <option key={index} value={etat}>{etat}</option>
            ))}
          </select>
          {errors.etat && <span className="error-message">{errors.etat}</span>}
        </div>
        
        {/* Section Prix */}
        <div className="form-group">
          <label htmlFor="prix">Prix *</label>
          <div className="prix-container">
            <input
              type="number"
              id="prix"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              placeholder="Prix en $"
              disabled={formData.gratuit}
              className={errors.prix ? 'error' : ''}
            />
            <div className="price-options">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="prixNegociable"
                  name="prixNegociable"
                  checked={formData.prixNegociable}
                  onChange={handleChange}
                  disabled={formData.gratuit}
                />
                <label htmlFor="prixNegociable">Prix négociable</label>
              </div>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="gratuit"
                  name="gratuit"
                  checked={formData.gratuit}
                  onChange={handleChange}
                />
                <label htmlFor="gratuit">Gratuit</label>
              </div>
            </div>
          </div>
          {errors.prix && <span className="error-message">{errors.prix}</span>}
        </div>
        
        {/* Section Localisation */}
        <div className="form-group">
          <label htmlFor="adresse">Adresse *</label>
          <input
            type="text"
            id="adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="Numéro et nom de rue"
            className={errors.adresse ? 'error' : ''}
          />
          {errors.adresse && <span className="error-message">{errors.adresse}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="ville">Ville/Région *</label>
            <input
              type="text"
              id="ville"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Votre ville ou région"
              className={errors.ville ? 'error' : ''}
            />
            {errors.ville && <span className="error-message">{errors.ville}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="codePostal">Code postal *</label>
            <input
              type="text"
              id="codePostal"
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              placeholder="Code postal"
              className={errors.codePostal ? 'error' : ''}
            />
            {errors.codePostal && <span className="error-message">{errors.codePostal}</span>}
          </div>
        </div>
        
        {/* Section Images */}
        <div className="form-group">
          <label htmlFor="images">Ajouter des images * (min 1 - max 4)</label>
          <div className="image-upload-container">
            <div className="image-upload">
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageUpload}
                accept="image/*"
                multiple
                className={errors.images ? 'error' : ''}
              />
              <div className="upload-button">
                <span>+ Ajouter des images</span>
                <small>{formData.images.length}/4 images</small>
              </div>
            </div>
            
            {formData.images.length > 0 && (
              <div className="image-previews">
                {formData.images.map((img, index) => (
                  <div key={index} className="image-preview">
                    <img src={img.preview} alt={`Aperçu ${index}`} />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.images && <span className="error-message">{errors.images}</span>}
        </div>
        
        {/* Section Conditions d'utilisation */}
        <div className="form-group terms-container">
          <div className="checkbox-group terms-checkbox">
            <input
              type="checkbox"
              id="termsAccepted"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className={errors.termsAccepted ? 'error' : ''}
            />
            <label htmlFor="termsAccepted">
              J'accepte les conditions d'utilisation et je consens à la collecte de ma position géographique *
            </label>
          </div>
          {errors.termsAccepted && <span className="error-message">{errors.termsAccepted}</span>}
        </div>
        
        {/* Bouton de soumission */}
        <div className="form-group submit-group">
          <button type="submit" className="submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Publication en cours..." : "Publier l'annonce"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Evenements;