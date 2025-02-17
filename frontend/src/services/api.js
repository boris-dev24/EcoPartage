import axios from 'axios';

// Fonction pour récupérer les informations de l'utilisateur
const fetchUserData = async () => {
  try {
    // Récupérer le token JWT du localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Faire une requête au backend pour obtenir les informations de l'utilisateur
      const response = await axios.get('http://localhost/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,  // Ajouter le token dans l'en-tête de la requête
        }
      });
      
      return response.data;  // Contient les données utilisateur
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération des données utilisateur', error);
    return null;
  }
};
