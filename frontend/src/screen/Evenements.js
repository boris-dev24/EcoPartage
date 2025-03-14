import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../components/firebase";
import { collection, getDocs, query, orderBy, where, limit } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import {  useNavigate } from "react-router-dom"; 
import "../style/listeAnnonces.css";


const Evenements = () => {
 // État pour stocker les annonces (toutes les annonces non filtrées)
 const [allEvenement, setAllEvenement] = useState([]);
 // État pour stocker les annonces filtrées à afficher
 const [filteredEvenement, setFilteredEvenement] = useState([]);
 // État pour stocker le filtre de catégorie
 const [categorieFilter, setCategorieFilter] = useState('Toutes');
 // État pour stocker le tri
 const [sortBy, setSortBy] = useState('dateCreation');
 // État pour le chargement
 const [loading, setLoading] = useState(true);
 // État pour la recherche
 const [searchTerm, setSearchTerm] = useState('');
 // État pour afficher l'annonce sélectionnée
 const [selectedEvenement, setSelectedEvenement] = useState(null);
 // État pour l'image active dans la modal
 const [activeImage, setActiveImage] = useState(0);
 const [user, setUser] = useState(null);  // État pour l'utilisateur connecté
 const Navigate =  useNavigate();  


 // Options pour les catégories
 const categories = [
   'Toutes', 'Concert', 'Conférence', 'Atelier', 'Sport', 'Festival', 'Exposition',
   'Loisirs', 'Services', 'Emploi', 'Autres'
 ];


 // Options de tri
 const sortOptions = [
   { value: 'dateCreation', label: 'Date (récent → ancien)' },
   { value: 'dateCreationAsc', label: 'Date (ancien → récent)' },
   { value: 'prixAsc', label: 'Prix (croissant)' },
   { value: 'prixDesc', label: 'Prix (décroissant)' },
 ];


 // Fonction pour récupérer les annonces depuis Firestore
 const fetchEvenements = async () => {
   setLoading(true);
   try {
     // Base de la collection à interroger
     const evenementRef = collection(db, "Evenement");
    
     // Déterminer le champ et la direction de tri par défaut
     let sortField = "dateCreation";
     let sortDirection = "desc";
    
     // Créer la requête avec tri par défaut
     const q = query(evenementRef, orderBy(sortField, sortDirection));
    
     // Exécuter la requête
     const querySnapshot = await getDocs(q);
    
     // Traiter les résultats
     const evenementList = [];
     querySnapshot.forEach((doc) => {
       const data = doc.data();
       evenementList.push({
         id: doc.id,
         ...data,
         // Convertir la date Firestore en objet Date JavaScript
         dateCreation: data.dateCreation ? data.dateCreation.toDate() : new Date(),
       });
     });
    
     setAllEvenement(evenementList);
     // Appliquer les filtres et tri initiaux
     applyFiltersAndSort(evenementList);
   } catch (error) {
     console.error("Erreur lors de la récupération des evenements:", error);
     toast.error("Impossible de charger les evenements", { position: "bottom-center" });
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
 const applyFiltersAndSort = (evenements = allEvenement) => {
   // 1. Filtrer par catégorie
   let result = evenements;
   if (categorieFilter !== 'Toutes') {
     result = result.filter(evenement => evenement.categorie === categorieFilter);
   }
  
   // 2. Filtrer par terme de recherche
   if (searchTerm.trim() !== '') {
     const searchLower = searchTerm.toLowerCase();
     result = result.filter(evenement =>
       evenement.titre.toLowerCase().includes(searchLower) ||
       evenement.description.toLowerCase().includes(searchLower)
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
  
   setFilteredEvenement(result);
 };


 // Effet pour charger les annonces au chargement de la page
 useEffect(() => {
   fetchEvenements();
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
 const handleAnnonceClick = (evenement) => {
   setSelectedEvenement(evenement);
   setActiveImage(0); // Réinitialiser l'image active
 };


 // Fermer la modal d'annonce
 const closeModal = () => {
   setSelectedEvenement(null);
 };

// Naviguer vers la page de création d'annonce
  const handleCreateEvenementClick = () => {
    if (user) {
      Navigate('/CreerEvenement');  // Rediriger vers la page de création d'annonce
    } else {
      toast.error("Vous devez être connecté pour créer un evenement", { position: "top-center" });
    }
  };

 // Changer l'image active dans la modal
 const changeActiveImage = (index) => {
   setActiveImage(index);
 };


 // Fonction pour obtenir l'image à afficher
 const getImageSrc = (evenement, index = 0) => {
   // Si l'annonce a des images, utiliser la première, sinon utiliser une image placeholder
   if (evenement.images && evenement.images.length > index) {
     return evenement.images[index];
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
       <h1>Evenements disponibles</h1>
       <p>Découvrez toutes les Evenements publiées par notre communauté</p>
     </div>

     {/* Bouton pour créer une annonce, visible uniquement si l'utilisateur est connecté */}
     {user && (
        <div className="create-annonce-container">
          <button className="create-annonce-button" onClick={handleCreateEvenementClick}>
            Créer un evenement
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
         <p>Chargement des evenements...</p>
       </div>
     ) : filteredEvenement.length === 0 ? (
       <div className="no-annonces">
         <h3>Aucune annonce ne correspond à votre recherche</h3>
         <p>Essayez de modifier vos filtres ou votre recherche</p>
       </div>
     ) : (
       <div className="annonces-grid">
         {filteredEvenement.map((annonce) => (
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
     {selectedEvenement && (
       <div className="annonce-modal">
         <div className="modal-content">
           <button className="close-modal" onClick={closeModal}>×</button>
          
           <div className="modal-gallery">
             <div className="main-image">
               <img
                 src={selectedEvenement.images && selectedEvenement.images.length > 0
                   ? selectedEvenement.images[activeImage]
                   : getPlaceholderImage(0)}
                 alt={selectedEvenement.titre}
               />
             </div>
             {selectedEvenement.images && selectedEvenement.images.length > 1 && (
               <div className="thumbnail-images">
                 {selectedEvenement.images.map((img, i) => (
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
             {(!selectedEvenement.images || selectedEvenement.images.length === 0) && (
               <div className="thumbnail-images">
                 {[...Array(Math.min(selectedEvenement.nombreImages || 1, 4))].map((_, i) => (
                   <div key={i} className="thumbnail">
                     <img src={getPlaceholderImage(i)} alt={`Thumbnail ${i+1}`} />
                   </div>
                 ))}
               </div>
             )}
           </div>
          
           <div className="modal-details">
             <div className="modal-header">
               <h2>{selectedEvenement.titre}</h2>
               <div className="price-tag">
                 {selectedEvenement.gratuit ? 'Gratuit' : `${selectedEvenement.prix} $`}
                 {!selectedEvenement.gratuit && selectedEvenement.prixNegociable && (
                   <span className="negociable-tag">Prix négociable</span>
                 )}
               </div>
             </div>
            
             <div className="modal-info">
               <div className="info-row">
                 <span className="info-label">Catégorie:</span>
                 <span className="info-value">{selectedEvenement.categorie}</span>
               </div>
               <div className="info-row">
                 <span className="info-label">État:</span>
                 <span className="info-value">{selectedEvenement.etat}</span>
               </div>
               <div className="info-row">
                 <span className="info-label">Localisation:</span>
                 <span className="info-value">{selectedEvenement.ville} {selectedEvenement.codePostal && `(${selectedEvenement.codePostal})`}</span>
               </div>
               <div className="info-row">
                 <span className="info-label">Date de publication:</span>
                 <span className="info-value">{formatDate(selectedEvenement.dateCreation)}</span>
               </div>
             </div>
            
             <div className="modal-description">
               <h3>Description</h3>
               <p>{selectedEvenement.description}</p>
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

