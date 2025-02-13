
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Connexion.css';

function Connexion() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion à implémenter
    console.log('Connexion:', { email, password });
  };

  const handlePasswordReset = (e) => {
    e.preventDefault();
    // Logique de réinitialisation du mot de passe à implémenter
    console.log('Réinitialisation du mot de passe pour:', resetEmail);
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
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <button type="submit">Se connecter</button>
            </div>
          </form>
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

