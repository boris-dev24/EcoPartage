import React, { useState, useEffect } from 'react';
import { auth, db, storage } from "../components/firebase";
import { updateDoc, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { updatePassword, signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "../style/profile.css";


const UserProfile = () => {
 // États pour les données de l'utilisateur
 const [userData, setUserData] = useState({
   firstName: '',
   lastName: '',
   email: '',
   phoneNumber: '',
   city: '',
   profilePicture: null
 });


 // État pour les statistiques
 const [stats, setStats] = useState({
   totalAnnonces: 0,
   activeAnnonces: 0,
   expiredAnnonces: 0,
   favorites: 0
 });


 // État pour la liste des annonces
 const [annonces, setAnnonces] = useState([]);


 // État pour le mode édition
 const [isEditing, setIsEditing] = useState(false);


 // État pour le changement de mot de passe
 const [passwordData, setPasswordData] = useState({
   currentPassword: '',
   newPassword: '',
   confirmPassword: ''
 });


 // État pour afficher le formulaire de changement de mot de passe
 const [showPasswordForm, setShowPasswordForm] = useState(false);


 // État pour le chargement
 const [isLoading, setIsLoading] = useState(true);
 const [isSubmitting, setIsSubmitting] = useState(false);


 // État pour le téléchargement de la photo de profil
 const [profileImageFile, setProfileImageFile] = useState(null);
 const [imagePreview, setImagePreview] = useState(null);


 // Effet pour charger les données utilisateur au montage du composant
 useEffect(() => {
   const fetchUserData = async () => {
     try {
       const currentUser = auth.currentUser;


       if (!currentUser) {
         toast.error("Vous devez être connecté pour accéder à votre profil", { position: "bottom-center" });
         window.location.href = "/login";
         return;
       }


       // Récupérer les données de l'utilisateur
       const userDocRef = doc(db, "Users", currentUser.uid);
       const userDoc = await getDoc(userDocRef);


       if (userDoc.exists()) {
         const data = userDoc.data();
         setUserData({
           firstName: data.firstName || '',
           lastName: data.lastName || '',
           email: currentUser.email,
           phoneNumber: data.phoneNumber || '',
           city: data.city || '',
           profilePicture: data.profilePicture || null
         });
       }


       // Récupérer les annonces de l'utilisateur
       const annoncesQuery = query(
         collection(db, "Annonces"),
         where("userId", "==", currentUser.uid)
       );
       const annoncesSnapshot = await getDocs(annoncesQuery);
      
       const annoncesData = [];
       let active = 0;
       let expired = 0;
      
       annoncesSnapshot.forEach((doc) => {
         const annonce = {
           id: doc.id,
           ...doc.data()
         };
        
         // Déterminer si l'annonce est expirée (plus de 30 jours)
         const dateCreation = annonce.dateCreation.toDate();
         const now = new Date();
         const diffTime = Math.abs(now - dateCreation);
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
         annonce.isExpired = diffDays > 30;
        
         if (annonce.isExpired) {
           expired++;
         } else {
           active++;
         }
        
         annoncesData.push(annonce);
       });
      
       setAnnonces(annoncesData);
      
       // Mettre à jour les statistiques
       setStats({
         totalAnnonces: annoncesData.length,
         activeAnnonces: active,
         expiredAnnonces: expired,
         favorites: 0 // À récupérer si vous avez un système de favoris
       });
      
     } catch (error) {
       console.error("Erreur lors du chargement des données utilisateur:", error);
       toast.error("Erreur lors du chargement de votre profil", { position: "bottom-center" });
     } finally {
       setIsLoading(false);
     }
   };


   fetchUserData();
 }, []);


 // Gestion des changements dans les champs du formulaire
 const handleChange = (e) => {
   const { name, value } = e.target;
   setUserData({
     ...userData,
     [name]: value
   });
 };


 // Gestion du changement de photo de profil
 const handleProfilePictureChange = (e) => {
   const file = e.target.files[0];
   if (file) {
     setProfileImageFile(file);
     setImagePreview(URL.createObjectURL(file));
   }
 };


 // Télécharger la photo de profil vers Firebase Storage
 const uploadProfilePicture = async (userId) => {
   if (!profileImageFile) return null;


   try {
     const storageRef = ref(storage, `profilePictures/${userId}/${profileImageFile.name}`);
     await uploadBytes(storageRef, profileImageFile);
     const downloadURL = await getDownloadURL(storageRef);
     return downloadURL;
   } catch (error) {
     console.error("Erreur lors du téléchargement de l'image:", error);
     toast.error("Erreur lors du téléchargement de l'image", { position: "bottom-center" });
     return null;
   }
 };


 // Mise à jour du profil
 const handleUpdateProfile = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);


   try {
     const currentUser = auth.currentUser;
    
     if (!currentUser) {
       toast.error("Vous n'êtes plus connecté", { position: "bottom-center" });
       return;
     }


     let profilePictureURL = userData.profilePicture;
    
     // Si l'utilisateur a choisi une nouvelle photo de profil
     if (profileImageFile) {
       profilePictureURL = await uploadProfilePicture(currentUser.uid);
     }


     // Mettre à jour les données utilisateur dans Firestore
     const userDocRef = doc(db, "Users", currentUser.uid);
     await updateDoc(userDocRef, {
       firstName: userData.firstName,
       lastName: userData.lastName,
       phoneNumber: userData.phoneNumber,
       city: userData.city,
       profilePicture: profilePictureURL
     });


     // Mettre à jour l'état local
     setUserData({
       ...userData,
       profilePicture: profilePictureURL
     });


     // Si une image a été prévisualisée, libérer l'URL
     if (imagePreview) {
       URL.revokeObjectURL(imagePreview);
       setImagePreview(null);
     }
    
     setProfileImageFile(null);
     setIsEditing(false);
    
     toast.success("Profil mis à jour avec succès!", { position: "top-center" });
   } catch (error) {
     console.error("Erreur lors de la mise à jour du profil:", error);
     toast.error("Erreur lors de la mise à jour du profil", { position: "bottom-center" });
   } finally {
     setIsSubmitting(false);
   }
 };


 // Gestion des changements dans les champs du formulaire de mot de passe
 const handlePasswordChange = (e) => {
   const { name, value } = e.target;
   setPasswordData({
     ...passwordData,
     [name]: value
   });
 };


 // Mise à jour du mot de passe
 const handleUpdatePassword = async (e) => {
   e.preventDefault();
   setIsSubmitting(true);


   try {
     // Validation des mots de passe
     if (passwordData.newPassword !== passwordData.confirmPassword) {
       toast.error("Les mots de passe ne correspondent pas", { position: "bottom-center" });
       return;
     }


     if (passwordData.newPassword.length < 6) {
       toast.error("Le mot de passe doit contenir au moins 6 caractères", { position: "bottom-center" });
       return;
     }


     const currentUser = auth.currentUser;
    
     if (!currentUser) {
       toast.error("Vous n'êtes plus connecté", { position: "bottom-center" });
       return;
     }


     // Mettre à jour le mot de passe
     await updatePassword(currentUser, passwordData.newPassword);
    
     // Réinitialiser le formulaire
     setPasswordData({
       currentPassword: '',
       newPassword: '',
       confirmPassword: ''
     });
    
     setShowPasswordForm(false);
    
     toast.success("Mot de passe mis à jour avec succès!", { position: "top-center" });
   } catch (error) {
     console.error("Erreur lors de la mise à jour du mot de passe:", error);
     toast.error("Erreur lors de la mise à jour du mot de passe. Essayez de vous reconnecter.", { position: "bottom-center" });
   } finally {
     setIsSubmitting(false);
   }
 };


 // Supprimer une annonce
 const handleDeleteAnnonce = async (annonceId) => {
   if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) {
     try {
       // Supprimer l'annonce de Firestore
       await updateDoc(doc(db, "Annonces", annonceId), {
         isDeleted: true,
         dateDeleted: new Date()
       });
      
       // Mettre à jour l'état local
       setAnnonces(annonces.filter(annonce => annonce.id !== annonceId));
      
       // Mettre à jour les statistiques
       setStats({
         ...stats,
         totalAnnonces: stats.totalAnnonces - 1,
         activeAnnonces: stats.activeAnnonces - 1
       });
      
       toast.success("Annonce supprimée avec succès!", { position: "top-center" });
     } catch (error) {
       console.error("Erreur lors de la suppression de l'annonce:", error);
       toast.error("Erreur lors de la suppression de l'annonce", { position: "bottom-center" });
     }
   }
 };


 // Marquer une annonce comme vendue
 const handleMarkAsSold = async (annonceId) => {
   try {
     // Mettre à jour l'annonce dans Firestore
     await updateDoc(doc(db, "Annonces", annonceId), {
       isSold: true,
       dateSold: new Date()
     });
    
     // Mettre à jour l'état local
     const updatedAnnonces = annonces.map(annonce => {
       if (annonce.id === annonceId) {
         return { ...annonce, isSold: true };
       }
       return annonce;
     });
    
     setAnnonces(updatedAnnonces);
    
     // Mettre à jour les statistiques
     setStats({
       ...stats,
       activeAnnonces: stats.activeAnnonces - 1,
       expiredAnnonces: stats.expiredAnnonces + 1
     });
    
     toast.success("Annonce marquée comme vendue!", { position: "top-center" });
   } catch (error) {
     console.error("Erreur lors du marquage de l'annonce comme vendue:", error);
     toast.error("Erreur lors de la mise à jour de l'annonce", { position: "bottom-center" });
   }
 };


 // Déconnexion
 const handleLogout = async () => {
   try {
     await signOut(auth);
     window.location.href = "/login";
   } catch (error) {
     console.error("Erreur lors de la déconnexion:", error);
     toast.error("Erreur lors de la déconnexion", { position: "bottom-center" });
   }
 };


 if (isLoading) {
   return <div className="loading-container">Chargement de votre profil...</div>;
 }


 return (
   <div className="profile-container">
     <div className="profile-header">
       <h1>Mon profil</h1>
       <button className="logout-button" onClick={handleLogout}>Déconnexion</button>
     </div>
    
     <div className="profile-content">
       {/* Informations utilisateur */}
       <div className="profile-card">
         <div className="profile-info-header">
           <h2>Informations personnelles</h2>
           {!isEditing ? (
             <button className="edit-button" onClick={() => setIsEditing(true)}>Modifier</button>
           ) : (
             <button className="cancel-button" onClick={() => {
               setIsEditing(false);
               if (imagePreview) {
                 URL.revokeObjectURL(imagePreview);
                 setImagePreview(null);
               }
               setProfileImageFile(null);
             }}>Annuler</button>
           )}
         </div>
        
         {isEditing ? (
           <form onSubmit={handleUpdateProfile}>
             <div className="profile-picture-section">
               <div className="profile-picture-container">
                 <img
                   src={imagePreview || userData.profilePicture || '/default-avatar.png'}
                   alt="Profile"
                   className="profile-picture"
                 />
                 <label htmlFor="profile-picture-input" className="profile-picture-label">
                   <span>Changer la photo</span>
                 </label>
                 <input
                   type="file"
                   id="profile-picture-input"
                   accept="image/*"
                   onChange={handleProfilePictureChange}
                   className="profile-picture-input"
                 />
               </div>
             </div>
            
             <div className="form-row">
               <div className="form-group">
                 <label htmlFor="firstName">Prénom</label>
                 <input
                   type="text"
                   id="firstName"
                   name="firstName"
                   value={userData.firstName}
                   onChange={handleChange}
                   required
                 />
               </div>
              
               <div className="form-group">
                 <label htmlFor="lastName">Nom</label>
                 <input
                   type="text"
                   id="lastName"
                   name="lastName"
                   value={userData.lastName}
                   onChange={handleChange}
                   required
                 />
               </div>
             </div>
            
             <div className="form-group">
               <label htmlFor="email">Email</label>
               <input
                 type="email"
                 id="email"
                 name="email"
                 value={userData.email}
                 disabled
               />
               <p className="field-note">L'adresse e-mail ne peut pas être modifiée directement</p>
             </div>
            
             <div className="form-group">
               <label htmlFor="phoneNumber">Numéro de téléphone</label>
               <input
                 type="tel"
                 id="phoneNumber"
                 name="phoneNumber"
                 value={userData.phoneNumber}
                 onChange={handleChange}
                 placeholder="Optionnel"
               />
             </div>
            
             <div className="form-group">
               <label htmlFor="city">Ville / Région</label>
               <input
                 type="text"
                 id="city"
                 name="city"
                 value={userData.city}
                 onChange={handleChange}
                 required
               />
             </div>
            
             <div className="form-row buttons-row">
               <button
                 type="button"
                 className="password-button"
                 onClick={() => setShowPasswordForm(!showPasswordForm)}
               >
                 Changer le mot de passe
               </button>
              
               <button
                 type="submit"
                 className="save-button"
                 disabled={isSubmitting}
               >
                 {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
               </button>
             </div>
           </form>
         ) : (
           <div className="profile-info">
             <div className="profile-picture-section">
               <img
                 src={userData.profilePicture || '/default-avatar.png'}
                 alt="Profile"
                 className="profile-picture"
               />
             </div>
            
             <div className="profile-details">
               <div className="profile-detail">
                 <span className="detail-label">Nom complet:</span>
                 <span className="detail-value">{userData.firstName} {userData.lastName}</span>
               </div>
              
               <div className="profile-detail">
                 <span className="detail-label">Email:</span>
                 <span className="detail-value">{userData.email}</span>
               </div>
              
               <div className="profile-detail">
                 <span className="detail-label">Téléphone:</span>
                 <span className="detail-value">{userData.phoneNumber || 'Non renseigné'}</span>
               </div>
              
               <div className="profile-detail">
                 <span className="detail-label">Ville / Région:</span>
                 <span className="detail-value">{userData.city || 'Non renseignée'}</span>
               </div>
             </div>
           </div>
         )}
        
         {showPasswordForm && (
           <div className="password-form-container">
             <h3>Changer le mot de passe</h3>
             <form onSubmit={handleUpdatePassword}>
               <div className="form-group">
                 <label htmlFor="currentPassword">Mot de passe actuel</label>
                 <input
                   type="password"
                   id="currentPassword"
                   name="currentPassword"
                   value={passwordData.currentPassword}
                   onChange={handlePasswordChange}
                   required
                 />
               </div>
              
               <div className="form-group">
                 <label htmlFor="newPassword">Nouveau mot de passe</label>
                 <input
                   type="password"
                   id="newPassword"
                   name="newPassword"
                   value={passwordData.newPassword}
                   onChange={handlePasswordChange}
                   required
                 />
               </div>
              
               <div className="form-group">
                 <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                 <input
                   type="password"
                   id="confirmPassword"
                   name="confirmPassword"
                   value={passwordData.confirmPassword}
                   onChange={handlePasswordChange}
                   required
                 />
               </div>
              
               <div className="form-row buttons-row">
                 <button
                   type="button"
                   className="cancel-button"
                   onClick={() => {
                     setShowPasswordForm(false);
                     setPasswordData({
                       currentPassword: '',
                       newPassword: '',
                       confirmPassword: ''
                     });
                   }}
                 >
                   Annuler
                 </button>
                
                 <button
                   type="submit"
                   className="save-button"
                   disabled={isSubmitting}
                 >
                   {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                 </button>
               </div>
             </form>
           </div>
         )}
       </div>
      
       {/* Statistiques */}
       <div className="profile-card stats-card">
         <h2>Statistiques</h2>
        
         <div className="stats-grid">
           <div className="stat-item">
             <span className="stat-number">{stats.totalAnnonces}</span>
             <span className="stat-label">Annonces publiées</span>
           </div>
          
           <div className="stat-item">
             <span className="stat-number">{stats.activeAnnonces}</span>
             <span className="stat-label">Annonces actives</span>
           </div>
          
           <div className="stat-item">
             <span className="stat-number">{stats.expiredAnnonces}</span>
             <span className="stat-label">Annonces expirées/vendues</span>
           </div>
          
           <div className="stat-item">
             <span className="stat-number">{stats.favorites}</span>
             <span className="stat-label">Favoris</span>
           </div>
         </div>
       </div>
      
       {/* Liste des annonces */}
       <div className="profile-card annonces-card">
         <h2>Mes annonces</h2>
        
         {annonces.length === 0 ? (
           <div className="no-annonces">
             <p>Vous n'avez pas encore publié d'annonces.</p>
             <a href="/creer-annonce" className="create-annonce-button">Créer ma première annonce</a>
           </div>
         ) : (
           <div className="annonces-grid">
             {annonces.map((annonce) => (
               <div key={annonce.id} className={`annonce-item ${annonce.isSold ? 'sold' : annonce.isExpired ? 'expired' : ''}`}>
                 <div className="annonce-image">
                   {/* Ici, on pourrait afficher l'image si disponible */}
                   <img src={annonce.imageUrl || '/placeholder-image.png'} alt={annonce.titre} />
                   <div className="annonce-status">
                     {annonce.isSold && <span className="status sold">Vendu</span>}
                     {annonce.isExpired && !annonce.isSold && <span className="status expired">Expiré</span>}
                     {!annonce.isExpired && !annonce.isSold && <span className="status active">Actif</span>}
                   </div>
                 </div>
                
                 <div className="annonce-details">
                   <h3 className="annonce-title">{annonce.titre}</h3>
                   <div className="annonce-price">
                     {annonce.gratuit ? 'Gratuit' : `${annonce.prix} $`}
                     {annonce.prixNegociable && !annonce.gratuit && <span className="negotiable"> (Négociable)</span>}
                   </div>
                   <div className="annonce-location">{annonce.ville}</div>
                   <div className="annonce-date">
                     Publié le {annonce.dateCreation && annonce.dateCreation.toDate().toLocaleDateString()}
                   </div>
                 </div>
                
                 <div className="annonce-actions">
                   <a href={`/modifier-annonce/${annonce.id}`} className="action-button edit">Modifier</a>
                   <button
                     className="action-button delete"
                     onClick={() => handleDeleteAnnonce(annonce.id)}
                   >
                     Supprimer
                   </button>
                   {!annonce.isSold && !annonce.isExpired && (
                     <button
                       className="action-button sold"
                       onClick={() => handleMarkAsSold(annonce.id)}
                     >
                       Marquer comme vendu
                     </button>
                   )}
                   <button className="action-button promote">Mettre en avant</button>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
     </div>
   </div>
 );
};


export default UserProfile;

