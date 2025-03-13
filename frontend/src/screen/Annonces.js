import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../components/firebase";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom"; 
import "../style/listeAnnonces.css";


const ListeAnnonces = () => {
 // État pour stocker les annonces (toutes les annonces non filtrées)
 const [allAnnonces, setAllAnnonces] = useState([]);
 // État pour stocker les annonces filtrées à afficher
 const [filteredAnnonces, setFilteredAnnonces] = useState([]);
 // État pour stocker le filtre de catégorie
 const [categorieFilter, setCategorieFilter] = useState('Toutes');
 // État pour stocker le tri
 const [sortBy, setSortBy] = useState('dateCreation');
 // État pour le chargement
 const [loading, setLoading] = useState(true);
 // État pour la recherche
 const [searchTerm, setSearchTerm] = useState('');
 // État pour afficher l'annonce sélectionnée
 const [selectedAnnonce, setSelectedAnnonce] = useState(null);
 // État pour l'image active dans la modal
 const [activeImage, setActiveImage] = useState(0);
 const [user, setUser] = useState(null);  // État pour l'utilisateur connecté
 const Navigate =  useNavigate();  


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


 // Fonction pour récupérer les annonces depuis Firestore
 const fetchAnnonces = async () => {
   setLoading(true);
   try {
     // Base de la collection à interroger
     const annoncesRef = collection(db, "Annonces");
    
     // Déterminer le champ et la direction de tri par défaut
     let sortField = "dateCreation";
     let sortDirection = "desc";
    
     // Créer la requête avec tri par défaut
     const q = query(annoncesRef, orderBy(sortField, sortDirection));
    
     // Exécuter la requête
     const querySnapshot = await getDocs(q);
    
     // Traiter les résultats
     const annoncesList = [];
     querySnapshot.forEach((doc) => {
       const data = doc.data();
       annoncesList.push({
         id: doc.id,
         ...data,
         // Convertir la date Firestore en objet Date JavaScript
         dateCreation: data.dateCreation ? data.dateCreation.toDate() : new Date(),
       });
     });
    
     setAllAnnonces(annoncesList);
     // Appliquer les filtres et tri initiaux
     applyFiltersAndSort(annoncesList);
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


 // Fonction pour appliquer les filtres et tri aux annonces
 const applyFiltersAndSort = (annonces = allAnnonces) => {
   // 1. Filtrer par catégorie
   let result = annonces;
   if (categorieFilter !== 'Toutes') {
     result = result.filter(annonce => annonce.categorie === categorieFilter);
   }
  
   // 2. Filtrer par terme de recherche
   if (searchTerm.trim() !== '') {
     const searchLower = searchTerm.toLowerCase();
     result = result.filter(annonce =>
       annonce.titre.toLowerCase().includes(searchLower) ||
       annonce.description.toLowerCase().includes(searchLower)
     );
   }
  
   // 3. Appliquer le tri
   result = [...result].sort((a, b) => {
     switch (sortBy) {
       case 'dateCreationAsc':
         return a.dateCreation - b.dateCreation;
       case 'dateCreation': // desc par défaut
         return b.dateCreation - a.dateCreation;
       case 'prixAsc':
         return (a.gratuit ? 0 : a.prix) - (b.gratuit ? 0 : b.prix);
       case 'prixDesc':
         return (b.gratuit ? 0 : b.prix) - (a.gratuit ? 0 : a.prix);
       default:
         return 0;
     }
   });
  
   setFilteredAnnonces(result);
 };


 // Effet pour charger les annonces au chargement de la page
 useEffect(() => {
   fetchAnnonces();
 }, []);


 // Effet pour appliquer les filtres et le tri quand ils changent
 useEffect(() => {
   applyFiltersAndSort();
 }, [categorieFilter, sortBy, searchTerm]);


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
   setActiveImage(0); // Réinitialiser l'image active
 };


 // Fermer la modal d'annonce
 const closeModal = () => {
   setSelectedAnnonce(null);
 };

// Naviguer vers la page de création d'annonce
  const handleCreateAnnonceClick = () => {
    if (user) {
      Navigate('/CreerAnnonce');  // Rediriger vers la page de création d'annonce
    } else {
      toast.error("Vous devez être connecté pour créer une annonce", { position: "top-center" });
    }
  };

 // Changer l'image active dans la modal
 const changeActiveImage = (index) => {
   setActiveImage(index);
 };


 // Fonction pour obtenir l'image à afficher
 const getImageSrc = (annonce, index = 0) => {
   // Si l'annonce a des images, utiliser la première, sinon utiliser une image placeholder
   if (annonce.images && annonce.images.length > index) {
     return annonce.images[index];
   }
   return getPlaceholderImage(index);
 };


 // Fonction pour afficher des images de placeholder
 const getPlaceholderImage = (index) => {
   const placeholders = [
     'https://via.placeholder.com/300x200?text=Image+non+disponible',
     'https://via.placeholder.com/300x200?text=Image+2',
     'https://via.placeholder.com/300x200?text=Image+3',
     'https://via.placeholder.com/300x200?text=Image+4'
   ];
   return placeholders[index % placeholders.length];
 };


 // Gérer la recherche avec debounce
 const handleSearchChange = (e) => {
   setSearchTerm(e.target.value);
 };


 return (
   <div className="annonces-page">
     <div className="annonces-header">
       <h1>Annonces disponibles</h1>
       <p>Découvrez toutes les annonces publiées par notre communauté</p>
     </div>

     {/* Bouton pour créer une annonce, visible uniquement si l'utilisateur est connecté */}
     {user && (
        <div className="create-annonce-container">
          <button className="create-annonce-button" onClick={handleCreateAnnonceClick}>
            Créer une Annonce
          </button>
        </div>
      )}

     <div className="search-filters-container">
       <div className="search-bar">
         <input
           type="text"
           placeholder="Rechercher..."
           value={searchTerm}
           onChange={handleSearchChange}
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
     ) : filteredAnnonces.length === 0 ? (
       <div className="no-annonces">
         <h3>Aucune annonce ne correspond à votre recherche</h3>
         <p>Essayez de modifier vos filtres ou votre recherche</p>
       </div>
     ) : (
       <div className="annonces-grid">
         {filteredAnnonces.map((annonce) => (
           <div
             key={annonce.id}
             className="annonce-card"
             onClick={() => handleAnnonceClick(annonce)}
           >
             <div className="annonce-img">
               <img src={getImageSrc(annonce)} alt={annonce.titre} />
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
               <img
                 src={selectedAnnonce.images && selectedAnnonce.images.length > 0
                   ? selectedAnnonce.images[activeImage]
                   : getPlaceholderImage(0)}
                 alt={selectedAnnonce.titre}
               />
             </div>
             {selectedAnnonce.images && selectedAnnonce.images.length > 1 && (
               <div className="thumbnail-images">
                 {selectedAnnonce.images.map((img, i) => (
                   <div
                     key={i}
                     className={`thumbnail ${activeImage === i ? 'active' : ''}`}
                     onClick={(e) => {
                       e.stopPropagation();
                       changeActiveImage(i);
                     }}
                   >
                     <img src={img} alt={`Thumbnail ${i+1}`} />
                   </div>
                 ))}
               </div>
             )}
             {(!selectedAnnonce.images || selectedAnnonce.images.length === 0) && (
               <div className="thumbnail-images">
                 {[...Array(Math.min(selectedAnnonce.nombreImages || 1, 4))].map((_, i) => (
                   <div key={i} className="thumbnail">
                     <img src={getPlaceholderImage(i)} alt={`Thumbnail ${i+1}`} />
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


export default ListeAnnonces;

