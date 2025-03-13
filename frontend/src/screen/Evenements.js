import React, { useState, useEffect } from 'react';
import { db, auth } from "../components/firebase";
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import {  useNavigate } from "react-router-dom"; 
import "../style/listeAnnonces.css";

const Evenements = () => {
  // État pour stocker les annonces
  const [annonces, setAnnonces] = useState([]);
  // État pour stocker le filtre de catégorie
  const [categorieFilter, setCategorieFilter] = useState('');
  // État pour stocker le tri
  const [sortBy, setSortBy] = useState('dateCreation');
  const [sortDirection, setSortDirection] = useState('desc');
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour la recherche
  const [searchTerm, setSearchTerm] = useState('');
  // État pour afficher l'annonce sélectionnée
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  // État pour l'image principale dans la modal
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [user, setUser] = useState(null);  // État pour l'utilisateur connecté
  const Navigate =  useNavigate();  // Utilisation de useHistory pour la navigation

  // Options pour les catégories
  const categories = [
    'Toutes', 'Électronique', 'Meubles', 'Vêtements', 'Véhicules', 'Immobilier',
    'Loisirs', 'Sports', 'Bricolage', 'Jardinage', 'Livres', 'Multimédia',
    'Animaux', 'Services', 'Emploi', 'Autres'
  ];

  // Options de tri
  const sortOptions = [
    { value: 'dateCreation', label: 'Date (récent → ancien)' },
    { value: 'dateCreationAsc', label: 'Date (ancien → récent)' },
    { value: 'prixAsc', label: 'Prix (croissant)' },
    { value: 'prixDesc', label: 'Prix (décroissant)' },
  ];

  // Fonction pour récupérer les annonces
  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      let q;
      
      // Construction de la requête de base
      if (sortBy === 'dateCreation') {
        q = query(collection(db, "Annonces"), orderBy("dateCreation", "desc"));
      } else if (sortBy === 'dateCreationAsc') {
        q = query(collection(db, "Annonces"), orderBy("dateCreation", "asc"));
      } else if (sortBy === 'prixAsc') {
        q = query(collection(db, "Annonces"), orderBy("prix", "asc"));
      } else if (sortBy === 'prixDesc') {
        q = query(collection(db, "Annonces"), orderBy("prix", "desc"));
      }
      
      // Ajouter un filtre de catégorie si nécessaire
      if (categorieFilter && categorieFilter !== 'Toutes') {
        q = query(collection(db, "Annonces"), 
          where("categorie", "==", categorieFilter),
          orderBy(sortBy === 'dateCreationAsc' ? "dateCreation" : sortBy === 'prixAsc' ? "prix" : sortBy === 'prixDesc' ? "prix" : "dateCreation", 
                 sortBy === 'dateCreationAsc' ? "asc" : sortBy === 'prixAsc' ? "asc" : sortBy === 'prixDesc' ? "desc" : "desc"));
      }
      
      const querySnapshot = await getDocs(q);
      
      const annoncesList = [];
      querySnapshot.forEach((doc) => {
        annoncesList.push({
          id: doc.id,
          ...doc.data(),
          // Convertir la date Firestore en objet Date JavaScript
          dateCreation: doc.data().dateCreation ? new Date(doc.data().dateCreation.toDate()) : new Date(),
        });
      });
      
      // Filtrer par terme de recherche si nécessaire
      let filteredAnnonces = annoncesList;
      if (searchTerm.trim() !== '') {
        const searchLower = searchTerm.toLowerCase();
        filteredAnnonces = annoncesList.filter(annonce => 
          annonce.titre.toLowerCase().includes(searchLower) || 
          annonce.description.toLowerCase().includes(searchLower)
        );
      }
      
      setAnnonces(filteredAnnonces);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
      toast.error("Impossible de charger les annonces", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si un utilisateur est connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // L'utilisateur est connecté
      } else {
        setUser(null);  // Aucun utilisateur connecté
      }
    });

    return unsubscribe;  // Nettoyage du listener lorsque le composant est démonté
  }, []);

  // Effet pour charger les annonces au chargement de la page et lorsque les filtres changent
  useEffect(() => {
    fetchAnnonces();
  }, [categorieFilter, sortBy, sortDirection]);

  // Effet pour rechercher lorsque le terme de recherche change
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchAnnonces();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Réinitialiser l'image principale lors du changement d'annonce
  useEffect(() => {
    if (selectedAnnonce) {
      setMainImageIndex(0);
    }
  }, [selectedAnnonce]);

  // Formater la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Gérer le clic sur une annonce
  const handleAnnonceClick = (annonce) => {
    setSelectedAnnonce(annonce);
  };

  // Fermer la modal d'annonce
  const closeModal = () => {
    setSelectedAnnonce(null);
  };

  // Changer l'image principale dans la modal
  const changeMainImage = (index) => {
    setMainImageIndex(index);
  };

  // Naviguer vers la page de création d'annonce
  const handleCreateEvenementClick = () => {
    if (user) {
      Navigate('/CreerEvenement');  // Rediriger vers la page de création d'annonce
    } else {
      toast.error("Vous devez être connecté pour créer une annonce", { position: "top-center" });
    }
  };

  // Fonction pour obtenir l'image principale d'une annonce (pour l'affichage en grille)
  const getMainImage = (annonce) => {
    // Vérifier si l'annonce a des images
    if (annonce.imageURLs && annonce.imageURLs.length > 0) {
      return annonce.imageURLs[0];
    }
    // Sinon retourner une image par défaut
    return '/images/dons-vetements.jpg';
  };

  return (
    <div className="annonces-page">
      <div className="annonces-header">
        <h1>Evenements disponibles</h1>
        <p>Découvrez tout les Evenements publiées par notre communauté</p>
      </div>

      {/* Bouton pour créer une annonce, visible uniquement si l'utilisateur est connecté */}
      {user && (
        <div className="create-annonce-container">
          <button className="create-annonce-button" onClick={handleCreateEvenementClick}>
            Créer un Evenement
          </button>
        </div>
      )}

      <div className="search-filters-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="categorie">Catégorie:</label>
            <select 
              id="categorie" 
              value={categorieFilter} 
              onChange={(e) => setCategorieFilter(e.target.value)}
            >
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Trier par:</label>
            <select 
              id="sort" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option, index) => (
                <option key={index} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des annonces...</p>
        </div>
      ) : annonces.length === 0 ? (
        <div className="no-annonces">
          <h3>Aucune annonce ne correspond à votre recherche</h3>
          <p>Essayez de modifier vos filtres ou votre recherche</p>
        </div>
      ) : (
        <div className="annonces-grid">
          {annonces.map((annonce) => (
            <div 
              key={annonce.id} 
              className="annonce-card"
              onClick={() => handleAnnonceClick(annonce)}
            >
              <div className="annonce-img">
                <img 
                  src={getMainImage(annonce)} 
                  alt={"   "+annonce.titre} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=Image+non+disponible';
                  }}
                />
                {annonce.gratuit && <span className="tag gratuit">Gratuit</span>}
                {!annonce.gratuit && annonce.prixNegociable && <span className="tag negociable">Négociable</span>}
              </div>
              <div className="annonce-content">
                <h3 className="annonce-title">{annonce.titre}</h3>
                <p className="annonce-price">
                  {annonce.gratuit ? 'Gratuit' : `${annonce.prix} $`}
                </p>
                <p className="annonce-location">{annonce.ville} {annonce.codePostal && `(${annonce.codePostal})`}</p>
                <div className="annonce-details">
                  <span className="annonce-category">{annonce.categorie}</span>
                  <span className="annonce-date">{formatDate(annonce.dateCreation)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail d'annonce */}
      {selectedAnnonce && (
        <div className="annonce-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            
            <div className="modal-gallery">
              <div className="main-image">
                {selectedAnnonce.imageURLs && selectedAnnonce.imageURLs.length > 0 ? (
                  <img 
                    src={selectedAnnonce.imageURLs[mainImageIndex]} 
                    alt={selectedAnnonce.titre}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/600x400?text=Image+non+disponible';
                    }}
                  />
                ) : (
                  <img 
                    src="https://via.placeholder.com/600x400?text=Image+non+disponible" 
                    alt={selectedAnnonce.titre} 
                  />
                )}
              </div>
              {selectedAnnonce.imageURLs && selectedAnnonce.imageURLs.length > 1 && (
                <div className="thumbnail-images">
                  {selectedAnnonce.imageURLs.map((url, i) => (
                    <div 
                      key={i} 
                      className={`thumbnail ${mainImageIndex === i ? 'active' : ''}`}
                      onClick={() => changeMainImage(i)}
                    >
                      <img 
                        src={url} 
                        alt={`Thumbnail ${i+1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x100?text=Erreur';
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="modal-details">
              <div className="modal-header">
                <h2>{selectedAnnonce.titre}</h2>
                <div className="price-tag">
                  {selectedAnnonce.gratuit ? 'Gratuit' : `${selectedAnnonce.prix} $`}
                  {!selectedAnnonce.gratuit && selectedAnnonce.prixNegociable && (
                    <span className="negociable-tag">Prix négociable</span>
                  )}
                </div>
              </div>
              
              <div className="modal-info">
                <div className="info-row">
                  <span className="info-label">Catégorie:</span>
                  <span className="info-value">{selectedAnnonce.categorie}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">État:</span>
                  <span className="info-value">{selectedAnnonce.etat}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Localisation:</span>
                  <span className="info-value">{selectedAnnonce.ville} {selectedAnnonce.codePostal && `(${selectedAnnonce.codePostal})`}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date de publication:</span>
                  <span className="info-value">{formatDate(selectedAnnonce.dateCreation)}</span>
                </div>
              </div>
              
              <div className="modal-description">
                <h3>Description</h3>
                <p>{selectedAnnonce.description}</p>
              </div>
              
              <div className="modal-contact">
                <button className="contact-button">Contacter le vendeur</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Evenements;