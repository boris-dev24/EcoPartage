import React, { useState, useEffect } from 'react';
import { db } from "../components/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "../style/annoncesCarte.css";

// Corriger le problème des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Composant pour centrer la carte sur la position de l'utilisateur
const LocationMarker = ({ setUserPosition }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 10 });
    
    map.on('locationfound', (e) => {
      setUserPosition(e.latlng);
    });
    
    map.on('locationerror', (e) => {
      toast.warning("Impossible d'accéder à votre position. Affichage de la carte par défaut.", { position: "bottom-center" });
    });
  }, [map, setUserPosition]);
  
  return null;
};

const Localisation = () => {
  // État pour stocker les annonces
  const [annonces, setAnnonces] = useState([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour la position de l'utilisateur
  const [userPosition, setUserPosition] = useState(null);
  // État pour l'annonce sélectionnée
  const [selectedAnnonce, setSelectedAnnonce] = useState(null);
  // Position par défaut pour la carte (centre de la France)
  const defaultPosition = [46.603354, 1.888334];
  // État pour la recherche par distance
  const [searchRadius, setSearchRadius] = useState(50); // en km
  // État pour filtrer par catégorie
  const [categorieFilter, setCategorieFilter] = useState('');

  // Options pour les catégories (les mêmes que dans votre composant Annonces)
  const categories = [
    'Toutes', 'Électronique', 'Meubles', 'Vêtements', 'Véhicules', 'Immobilier',
    'Loisirs', 'Sports', 'Bricolage', 'Jardinage', 'Livres', 'Multimédia',
    'Animaux', 'Services', 'Emploi', 'Autres'
  ];

  // Fonction pour récupérer les annonces
  const fetchAnnonces = async () => {
    setLoading(true);
    try {
      console.log("Récupération des annonces en cours...");
      const q = query(collection(db, "Annonces"), orderBy("dateCreation", "desc"));
      const querySnapshot = await getDocs(q);
      
      const annoncesList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Annonce trouvée :", data);
        annoncesList.push({
          id: doc.id,
          ...data,
          dateCreation: data.dateCreation ? new Date(data.dateCreation.toDate()) : new Date(),
        });
      });
  
      console.log("Annonces récupérées :", annoncesList);
      setAnnonces(annoncesList);
    } catch (error) {
      console.error("Erreur lors de la récupération des annonces:", error);
      toast.error("Impossible de charger les annonces", { position: "bottom-center" });
    } finally {
      setLoading(false);
    }
  };

  // Effet pour charger les annonces au chargement de la page
  useEffect(() => {
    fetchAnnonces();
  }, []);

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

  // Calculer la distance entre deux points (formule de Haversine)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance en km
    return distance;
  };

  // Filtrer les annonces en fonction de la position de l'utilisateur et du rayon de recherche
  const getFilteredAnnonces = () => {
    if (!userPosition) return annonces;
    
    let filtered = annonces.filter(annonce => {
      // Vérifier si l'annonce a des coordonnées de localisation
      if (!annonce.location || (annonce.location.latitude === null || annonce.location.longitude === null)) {
        return false;
      }
      
      // Calculer la distance entre l'utilisateur et l'annonce
      const distance = calculateDistance(
        userPosition.lat, 
        userPosition.lng, 
        annonce.location.latitude, 
        annonce.location.longitude
      );
      
      // Ajouter la distance à l'annonce pour l'affichage
      annonce.distance = Math.round(distance * 10) / 10;
      
      // Filtrer par distance
      return distance <= searchRadius;
    });
    
    // Filtrer par catégorie si nécessaire
    if (categorieFilter && categorieFilter !== 'Toutes') {
      filtered = filtered.filter(annonce => annonce.categorie === categorieFilter);
    }
    
    return filtered;
  };

  // Obtenir l'image principale d'une annonce
  const getMainImage = (annonce) => {
    if (annonce.imageURLs && annonce.imageURLs.length > 0) {
      return annonce.imageURLs[0];
    }
    return '/images/dons-vetements.jpg';
  };

  // Ouvrir la modal d'une annonce
  const openModal = (annonce) => {
    setSelectedAnnonce(annonce);
  };

  // Fermer la modal
  const closeModal = () => {
    setSelectedAnnonce(null);
  };

  // Annonces filtrées selon les critères
  const filteredAnnonces = getFilteredAnnonces();

  // Vérifier si une annonce a des coordonnées valides
  const hasValidCoordinates = (annonce) => {
    return annonce.location && 
           annonce.location.latitude !== null && 
           annonce.location.longitude !== null;
  };

  return (
    <div className="annonces-carte-page">
      <div className="annonces-carte-header">
       
        <p>Découvrez les annonces près de chez vous</p>
      </div>

      <div className="carte-filters">
        <div className="filter-group">
          <label htmlFor="searchRadius">Distance maximale:</label>
          <select 
            id="searchRadius" 
            value={searchRadius} 
            onChange={(e) => setSearchRadius(parseInt(e.target.value))}
          >
            <option value="5">5 km</option>
            <option value="10">10 km</option>
            <option value="25">25 km</option>
            <option value="50">50 km</option>
            <option value="100">100 km</option>
            <option value="9999">Toutes distances</option>
          </select>
        </div>

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
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement de la carte...</p>
        </div>
      ) : (
        <div className="carte-container">
          <MapContainer 
            center={defaultPosition} 
            zoom={6} 
            style={{ height: "600px", width: "100%" }}
            className="carte-leaflet"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker setUserPosition={setUserPosition} />
            
            {/* Marqueur de la position de l'utilisateur */}
            {userPosition && (
              <Marker 
                position={[userPosition.lat, userPosition.lng]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <div>
                    <b>Votre position</b>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Marqueurs des annonces avec coordonnées valides */}
            {filteredAnnonces
              .filter(annonce => hasValidCoordinates(annonce))
              .map((annonce) => (
                <Marker 
                  key={annonce.id} 
                  position={[annonce.location.latitude, annonce.location.longitude]}
                  icon={new L.Icon({
                    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                  })}
                >
                  <Popup>
                    <div className="carte-popup">
                      <div className="popup-image">
                        <img 
                          src={getMainImage(annonce)} 
                          alt={annonce.titre}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
                          }}
                        />
                      </div>
                      <div className="popup-content">
                        <h3>{annonce.titre}</h3>
                        <p className="popup-price">
                          {annonce.gratuit ? 'Gratuit' : `${annonce.prix} $`}
                        </p>
                        <p className="popup-location">{annonce.ville} ({annonce.codePostal})</p>
                        {annonce.distance && (
                          <p className="popup-distance">Distance: {annonce.distance} km</p>
                        )}
                        <button 
                          className="popup-button"
                          onClick={() => openModal(annonce)}
                        >
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
          
          <div className="annonces-liste-carte">
            <h2>Annonces {userPosition ? `à proximité (${filteredAnnonces.length})` : `disponibles (${filteredAnnonces.length})`}</h2>
            {filteredAnnonces.length === 0 ? (
              <div className="no-annonces">
                <p>Aucune annonce trouvée dans cette zone</p>
                <p>Essayez d'augmenter la distance de recherche ou de changer de catégorie</p>
              </div>
            ) : (
              <div className="annonces-scroll">
                {filteredAnnonces.map((annonce) => (
                  <div 
                    key={annonce.id} 
                    className="annonce-card-mini"
                    onClick={() => openModal(annonce)}
                  >
                    <div className="annonce-mini-img">
                      <img 
                        src={getMainImage(annonce)} 
                        alt={annonce.titre}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
                        }}
                      />
                    </div>
                    <div className="annonce-mini-content">
                      <h3>{annonce.titre}</h3>
                      <p className="annonce-mini-price">
                        {annonce.gratuit ? 'Gratuit' : `${annonce.prix} $`}
                      </p>
                      <p className="annonce-mini-location">{annonce.ville}</p>
                      {annonce.distance && (
                        <p className="annonce-mini-distance">Distance: {annonce.distance} km</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de détail d'annonce (même que dans votre composant Annonces) */}
      {selectedAnnonce && (
        <div className="annonce-modal">
          <div className="modal-content">
            <button className="close-modal" onClick={closeModal}>×</button>
            
            <div className="modal-gallery">
              <div className="main-image">
                {selectedAnnonce.imageURLs && selectedAnnonce.imageURLs.length > 0 ? (
                  <img 
                    src={selectedAnnonce.imageURLs[0]} 
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
                      className={`thumbnail ${i === 0 ? 'active' : ''}`}
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
                  <span className="info-value">
                    {selectedAnnonce.ville} {selectedAnnonce.codePostal && `(${selectedAnnonce.codePostal})`}
                    {selectedAnnonce.distance && ` - ${selectedAnnonce.distance} km de vous`}
                  </span>
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

export default Localisation;