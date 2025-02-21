import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Deconnexion() {
  const navigate = useNavigate();

  const handleDeconnexion = async () => {
    try {
      // Appel à l'API de déconnexion
      const response = await axios.post('http://localhost/ecopartage/backend/api/deconnexion.php');
      console.log(response.data);

      // Supprime les données de l'utilisateur du localStorage
      localStorage.removeItem('user');

      // Redirige l'utilisateur vers la page de connexion
      navigate('/connexion');
    } catch (error) {
      console.error('Erreur lors de la déconnexion', error);
    }
  };

  return (
    <button onClick={handleDeconnexion}>Déconnexion</button>
  );
}

export default Deconnexion;