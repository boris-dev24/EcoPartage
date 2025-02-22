
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Inscription.css';
import axios from 'axios';

function Inscription() {
  const [adresse, setAdresse] = useState('');
  // const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);  // Pour savoir si l'inscription est en cours
  const [error, setError] = useState(''); // Pour afficher un message d'erreur si l'inscription échoue

  // Utilisation de useNavigate pour la redirection après inscription
  const navigate = useNavigate();

  // Fonction pour gérer l'envoi du formulaire d'inscription
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);  // Indiquer que la requête est en cours
    
    try {
      // Validation basique (facultatif mais recommandé)
      if (!email.includes('@')) {
        setError('L\'email doit être valide.');
        setLoading(false);
        return;
      }

      if (motDePasse.length < 7) {
        setError('Le mot de passe doit contenir au moins 7 caractères.');
        setLoading(false);
        return;
      }

      // Appel à l'API pour enregistrer l'utilisateur
      const response = await axios.post('http://localhost/ecopartage/backend/api/inscription.php', {
        nom,
        email,
        adresse,
        motDePasse,
      });
      console.log(response.data);

      // Rediriger l'utilisateur après l'inscription
      if (response.data.success) {
        // Enregistrer les données utilisateur dans le localStorage
        //    
        navigate('/connexion'); // Redirige l'utilisateur vers la page de connexion
      } else {
        // Gérer l'erreur spécifique renvoyée par l'API
        setError(response.data.message || 'Erreur d\'inscription');
        // console.error('Erreur d\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription', error);
      setError('Une erreur est survenue lors de l\'inscription.');
    }finally {
      setLoading(false); // Arrêter l'indicateur de chargement une fois la requête terminée
    }
    console.log('Inscription:', { adresse, nom, email, motDePasse });
  };

  return (
    <div className="inscription-page">
      <h1>Rejoindre EcoPartage</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            type="text" 
            id="adresse"
            placeholder="Ville, rue"
            value={adresse} 
            onChange={(e) => setAdresse(e.target.value)} 
            required 
          />
          <FaMapMarkerAlt className="location-icon" />
        </div>
        {/* <div className="form-group">
          <input 
            type="text" 
            id="prenom"
            placeholder="Prénom"
            value={prenom} 
            onChange={(e) => setPrenom(e.target.value)} 
            required 
          />
        </div> */}
        <div className="form-group">
          <input 
            type="text" 
            id="nom"
            placeholder="Nom"
            value={nom} 
            onChange={(e) => setNom(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            id="email"
            placeholder="Email"
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="motDePasse" 
            id="motDePasse"
            placeholder="Mot de passe (7 car. min)"
            value={motDePasse} 
            onChange={(e) => setMotDePasse(e.target.value)} 
            minLength="7"
            required 
          />
        </div>
        <div className="form-group">
          <button type="submit">S'inscrire</button>
        </div>
        <div className="form-group terms">
          <p>
            En cliquant sur le bouton "S'inscrire" j'accepte les <Link to="/conditions">conditions générales d'utilisation</Link> et certifie habiter à l'adresse indiquée.
          </p>
        </div>
      </form>
      <div className="privacy-notice">
        <p>Données personnelles: seul votre prénom sera affiché sur le site, vos adresses restent confidentielles et ne sont jamais diffusées.</p>
      </div>
      <div className="login-link">
        <Link to="/connexion">Déjà inscrit ? Me connecter</Link>
      </div>
      <div className="help-section">
        <h3>Bienvenue dans un monde de partage</h3>
        <h4>Aide sur l'inscription</h4>
        <ul>
          <li>Votre adresse postale est nécessaire pour vous proposer les services les plus proches de vous. Elle n'est jamais affichée sur le site ni transmise. Confidentialité garantie.</li>
          <li>Votre adresse Email n'est jamais communiquée. Veillez à utiliser une adresse valide pour être sûr de recevoir les réponses de vos voisins.</li>
        </ul>
        <h4>Données protégées</h4>
        <p>Les informations communiquées, telles que adresse postale ou adresse email ne sont jamais diffusées sur le site, ni aux membres ni communiquées à l'extérieur du site. Votre adresse postale sert exclusivement à vous délivrer les annonces les plus proches de vous, elle n'est jamais exploitée autrement.</p>
      </div>
    </div>
  );
}

export default Inscription;

