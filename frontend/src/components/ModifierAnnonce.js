import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage, auth } from "../components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { FaImage, FaTimes, FaCheck } from 'react-icons/fa';
import "../style/ModifierAnnonce.css";


const ModifierAnnonce = () => {
 const { id } = useParams();
 const navigate = useNavigate();
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
 });
 const [errors, setErrors] = useState({});
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [loading, setLoading] = useState(true);


 useEffect(() => {
   const fetchAnnonce = async () => {
     try {
       setLoading(true);
       const annonceRef = doc(db, "Annonces", id);
       const annonceSnap = await getDoc(annonceRef);
      
       if (annonceSnap.exists()) {
         const data = annonceSnap.data();
         setFormData({
           ...data,
           prix: data.prix !== undefined ? String(data.prix) : '',
           images: data.images ? data.images.map(img =>
             typeof img === 'string' ? img : { preview: URL.createObjectURL(img.file), file: img.file }
           ) : [],
         });
       } else {
         toast.error("Annonce introuvable");
         navigate("/profile");
       }
     } catch (error) {
       console.error(error);
       toast.error("Erreur lors du chargement de l'annonce");
     } finally {
       setLoading(false);
     }
   };
  
   fetchAnnonce();
 }, [id, navigate]);
  const handleChange = (e) => {
   const { name, value, type, checked } = e.target;
   setFormData((prevData) => ({
     ...prevData,
     [name]: type === 'checkbox' ? checked : value
   }));
  
   // Réinitialiser l'erreur pour ce champ
   if (errors[name]) {
     setErrors(prev => ({ ...prev, [name]: undefined }));
   }
 };


 const handleImageUpload = (e) => {
   const fileList = Array.from(e.target.files);
   const maxImages = 4 - formData.images.length;
  
   if (fileList.length > maxImages) {
     toast.warning(`Vous pouvez ajouter seulement ${maxImages} images supplémentaires`);
     return;
   }
  
   const newImages = fileList.map((file) => ({
     file,
     preview: URL.createObjectURL(file)
   }));
  
   setFormData((prev) => ({
     ...prev,
     images: [...prev.images, ...newImages]
   }));
 };


 const removeImage = (index) => {
   const newImages = [...formData.images];
   if (newImages[index].preview) {
     URL.revokeObjectURL(newImages[index].preview);
   }
   newImages.splice(index, 1);
   setFormData({ ...formData, images: newImages });
 };


 const validateForm = () => {
   const newErrors = {};
   if (!formData.titre.trim()) newErrors.titre = 'Le titre est obligatoire';
   if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
   if (!formData.categorie) newErrors.categorie = 'La catégorie est obligatoire';
   if (!formData.etat) newErrors.etat = 'L\'état est obligatoire';
   if (!formData.gratuit && !formData.prix) newErrors.prix = 'Le prix est obligatoire sauf pour les dons';
   if (!formData.ville.trim()) newErrors.ville = 'Ville obligatoire';
   if (!formData.adresse.trim()) newErrors.adresse = 'Adresse obligatoire';
   if (!formData.codePostal.trim()) newErrors.codePostal = 'Code postal obligatoire';
   return newErrors;
 };


 const handleSubmit = async (e) => {
   e.preventDefault();
   const newErrors = validateForm();
  
   if (Object.keys(newErrors).length > 0) {
     setErrors(newErrors);
     toast.error("Veuillez corriger les erreurs dans le formulaire");
     return;
   }
  
   setIsSubmitting(true);


   try {
     const currentUser = auth.currentUser;
     if (!currentUser) {
       toast.error("Vous devez être connecté");
       return;
     }


     // Upload images if new ones are added
     const uploadedImages = await Promise.all(
       formData.images.map(async (img) => {
         if (img.file) {
           const fileName = `${new Date().getTime()}-${img.file.name}`;
           const imageRef = ref(storage, `images/${currentUser.uid}/${fileName}`);
           const snapshot = await uploadBytes(imageRef, img.file);
           return await getDownloadURL(snapshot.ref);
         }
         return img; // already a URL
       })
     );


     // Update annonce in Firestore
     await updateDoc(doc(db, "Annonces", id), {
       ...formData,
       prix: formData.gratuit ? 0 : Number(formData.prix),
       images: uploadedImages,
       updatedAt: new Date()
     });


     toast.success("Annonce modifiée avec succès !");
     navigate("/profile");
   } catch (error) {
     console.error(error);
     toast.error("Erreur lors de la modification de l'annonce");
   } finally {
     setIsSubmitting(false);
   }
 };


 const categorieOptions = [
   "Électronique", "Vêtements", "Mobilier", "Décoration",
   "Loisirs", "Sports", "Livres", "Jardin", "Véhicules", "Autre"
 ];


 const etatOptions = [
   "Neuf", "Comme neuf", "Bon état", "État moyen", "À rénover"
 ];


 if (loading) {
   return (
     <div className="loading-container">
       <div className="spinner"></div>
       <p>Chargement de l'annonce...</p>
     </div>
   );
 }


 return (
   <div className="form-container">
     <h1>Modifier l'annonce</h1>
    
     <form onSubmit={handleSubmit}>
       <div className="form-group">
         <label htmlFor="titre">Titre *</label>
         <input
           type="text"
           id="titre"
           name="titre"
           value={formData.titre}
           onChange={handleChange}
           placeholder="Titre de votre annonce"
         />
         {errors.titre && <span className="error-message">{errors.titre}</span>}
       </div>
      
       <div className="form-group">
         <label htmlFor="description">Description *</label>
         <textarea
           id="description"
           name="description"
           value={formData.description}
           onChange={handleChange}
           placeholder="Décrivez votre article : caractéristiques, état, histoire..."
         />
         {errors.description && <span className="error-message">{errors.description}</span>}
       </div>
      
       <div className="form-row">
         <div className="form-group">
           <label htmlFor="categorie">Catégorie *</label>
           <select
             id="categorie"
             name="categorie"
             value={formData.categorie}
             onChange={handleChange}
           >
             <option value="">Sélectionnez une catégorie</option>
             {categorieOptions.map((option) => (
               <option key={option} value={option}>{option}</option>
             ))}
           </select>
           {errors.categorie && <span className="error-message">{errors.categorie}</span>}
         </div>
        
         <div className="form-group">
           <label htmlFor="etat">État *</label>
           <select
             id="etat"
             name="etat"
             value={formData.etat}
             onChange={handleChange}
           >
             <option value="">Sélectionnez l'état</option>
             {etatOptions.map((option) => (
               <option key={option} value={option}>{option}</option>
             ))}
           </select>
           {errors.etat && <span className="error-message">{errors.etat}</span>}
         </div>
       </div>
      
       <div className="form-group price-group">
 <label htmlFor="prix">Prix *</label>
 <div className="price-input-group">
   <input
     type="number"
     id="prix"
     name="prix"
     value={formData.prix}
     onChange={handleChange}
     disabled={formData.gratuit}
     placeholder="0.00"
   />
   <span className="currency"></span>
 </div>
  <div className="checkbox-options">
   <div className="checkbox-group">
     <input
       type="checkbox"
       id="gratuit"
       name="gratuit"
       checked={formData.gratuit}
       onChange={handleChange}
     />
     <label htmlFor="gratuit">Gratuit (don)</label>
   </div>
   <div div className="checkbox-group">
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
 </div>
  {errors.prix && <span className="error-message">{errors.prix}</span>}
</div>
      
       <div className="section-title">
         <h2>Localisation</h2>
       </div>
      
       <div className="form-row">
         <div className="form-group">
           <label htmlFor="ville">Ville *</label>
           <input
             type="text"
             id="ville"
             name="ville"
             value={formData.ville}
             onChange={handleChange}
             placeholder="Ville"
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
           />
           {errors.codePostal && <span className="error-message">{errors.codePostal}</span>}
         </div>
       </div>
      
       <div className="form-group">
         <label htmlFor="adresse">Adresse *</label>
         <input
           type="text"
           id="adresse"
           name="adresse"
           value={formData.adresse}
           onChange={handleChange}
           placeholder="Adresse"
         />
         {errors.adresse && <span className="error-message">{errors.adresse}</span>}
       </div>
      
       <div className="section-title">
         <h2>Photos</h2>
         <p className="section-subtitle">Ajoutez jusqu'à 4 photos pour illustrer votre annonce</p>
       </div>
      
       <div className="form-group">
         <div className="image-upload">
           <label className="custom-file-upload" htmlFor="image-upload">
             <FaImage /> Ajouter des photos
             <input
               type="file"
               id="image-upload"
               multiple
               accept="image/*"
               onChange={handleImageUpload}
               disabled={formData.images.length >= 4}
             />
           </label>
           <span className="image-count">
             {formData.images.length}/4 photos
           </span>
         </div>
        
         {formData.images.length > 0 ? (
           <div className="image-previews">
             {formData.images.map((img, idx) => (
               <div key={idx} className="image-preview">
                 <img src={img.preview || img} alt={`Photo ${idx + 1}`} />
                 <button
                   type="button"
                   className="remove-image"
                   onClick={() => removeImage(idx)}
                   aria-label="Supprimer l'image"
                 >
                   <FaTimes />
                 </button>
               </div>
             ))}
           </div>
         ) : (
           <div className="no-images">
             <p>Aucune image ajoutée</p>
           </div>
         )}
       </div>
      
       <div className="form-actions">
         <button
           type="button"
           className="btn-secondary"
           onClick={() => navigate("/profile")}
           disabled={isSubmitting}
         >
           Annuler
         </button>
         <button
           type="submit"
           className="btn-primary"
           disabled={isSubmitting}
         >
           {isSubmitting ? (
             <>
               <div className="spinner-small"></div>
               Modification en cours...
             </>
           ) : (
             <>
               <FaCheck /> Modifier l'annonce
             </>
           )}
         </button>
       </div>
     </form>
   </div>
 );
};


export default ModifierAnnonce;



