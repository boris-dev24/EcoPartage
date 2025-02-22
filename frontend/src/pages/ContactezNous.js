import React, { useState } from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa'; 
import '../styles/ContactezNous.css';

function ContactezNous() {
  const [motif, setMotif] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis', { motif, nom, email, message }); 
  };

  return (
    <div className="contactez-nous">
      <div className="contact-header">
        <h1>Réseau d'économie circulaire et de partage</h1>
        <p>Réseau social de proximité d'échange et partage</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="motif">Merci de choisir le motif de votre demande</label>
            <select id="motif" value={motif} onChange={(e) => setMotif(e.target.value)} required>
              <option value="">Sélectionnez un motif</option>
              {/* You can keep the options or adjust them to match your needs */}
              <option value="ambassadeur">Devenir ambassadeur</option>
              <option value="partenariat">Partenariat</option>
              <option value="collectivite">Collectivité</option>
              <option value="entreprise">Entreprise</option>
              <option value="bug">Rapporter un bug</option>
              <option value="evolution">Soumettre une évolution</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaUser />
              <input
                type="text"
                id="nom"
                placeholder="      Votre nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="input-icon">
              <FaEnvelope />
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <textarea
              id="message"
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
  );
}

export default ContactezNous;

