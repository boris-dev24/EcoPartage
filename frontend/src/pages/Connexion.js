
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Connexion.css';
import axios from 'axios';

function Connexion() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [message, setMessage] = useState('');  // Pour afficher l'erreur de connexion
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Utilisation du hook useNavigate pour la redirection après la connexion réussie
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Fonction de soumission de connexion
  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateEmail(email)) {
      setMessage('Veuillez entrer un email valide.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost/ecopartage/backend/api/connexion.php', {
        email,
        motDePasse,
      });
      console.log(response.data);

      // Rediriger l'utilisateur après la connexion
      if (response.data.success) {
        // Sauvegarder les informations de l'utilisateur dans le localStorage ou autre
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Exemple de sauvegarde du user dans le localStorage
        navigate('/'); // Redirige vers la page d'accueil 
      } else {
        setMessage('Erreur de connexion. Vérifiez vos informations.');
      }
    } catch (error) {
      console.error('Erreur de connexion', error);
      setMessage('Erreur lors de la connexion. Veuillez réessayer.');
    }finally {
      setIsLoading(false);
    }
  };

  // Fonction de réinitialisation du mot de passe
  const handlePasswordReset = async(e) => {
    e.preventDefault();
    try {
      // Envoi de l'email pour réinitialiser le mot de passe
      const response = await axios.post('http://localhost/ecopartage/backend/api/resetPassword.php', {
        email: resetEmail, // Email pour la réinitialisation
      });
      console.log(response.data);
      setResetMessage('Un lien de réinitialisation a été envoyé à votre email.');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
      setResetMessage('Erreur lors de l\'envoi du lien de réinitialisation.');
    }
  };

  return (
    <div className="connexion-page">
      <h1>Connexion EcoPartage</h1>
      {!showPasswordReset ? (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                placeholder="Email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <input 
                type="password" 
                placeholder="Mot de passe"
                value={motDePasse} 
                onChange={(e) => setMotDePasse(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>
            </div>
          </form>
          {message && <p className="error-message">{message}</p>}
          <div className="links">
            <a href="#" onClick={() => setShowPasswordReset(true)}>Mot de passe oublié ?</a>
            <Link to="/inscription">Pas encore inscrit.e ? Cliquez ici</Link>
          </div>
        </>
      ) : (
        <form onSubmit={handlePasswordReset}>
          <h2>Mot de passe perdu ?</h2>
          <p>Merci d'indiquer votre adresse email. Vous recevrez un message avec un lien pour modifier votre mot de passe.</p>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email"
              value={resetEmail} 
              onChange={(e) => setResetEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <button type="submit">Réinitialiser le mot de passe</button>
          </div>
          <div className="links">
            <a href="#" onClick={() => setShowPasswordReset(false)}>Revenir à la connexion</a>
          </div>
        </form>
      )}
      <div className="help-section">
        <h3>Aide sur la connexion</h3>
        <p>Si vous avez perdu votre mot de passe, cliquez sur le lien "Mot de passe oublié". Vous recevrez un email vous indiquant le lien pour pouvoir modifier votre mot de passe.</p>
        <p>Avis Facebook: si vous vous êtes enregistré via votre compte Facebook, cette fonctionnalité étant pour l'instant suspendue, cliquez sur "Mot de passe oublié". Vous recevrez alors un Email à votre adresse d'inscription avec les instructions pour choisir un mot de passe.</p>
      </div>
    </div>
  );
}

export default Connexion;

