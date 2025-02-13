
import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/ContactezNous.css';

function ContactezNous() {
  const [motif, setMotif] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire soumis', { motif, nom, email, telephone, message });
  };

  return (
    <div className="contactez-nous">
      <div className="contact-header">
        <h1>Contactez-nous</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="motif">Merci de choisir le motif de votre demande</label>
          <select id="motif" value={motif} onChange={(e) => setMotif(e.target.value)} required>
            <option value="">Sélectionnez un motif</option>
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
              placeholder="Votre nom"
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
          <div className="input-icon">
            <FaPhone />
            <input 
              type="tel" 
              id="telephone"
              placeholder="N° de Téléphone"
              value={telephone} 
              onChange={(e) => setTelephone(e.target.value)} 
            />
          </div>
        </div>

        <div className="form-group">
          <textarea
            id="message"
            placeholder="Votre message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default ContactezNous;

