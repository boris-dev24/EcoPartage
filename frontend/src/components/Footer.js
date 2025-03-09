
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Footer.css';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>À propos de EcoPartage</h3>
          <ul>
            <li><Link to="/mission">Mission</Link></li>
            <li><Link to="/annonces">Annonces</Link></li>
            <li><Link to="/evenements">Événements</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Aide et support</h3>
          <ul>
            <li><Link to="/confidentialite">Confidentialité</Link></li>
            <li><Link to="/conditions-generales">Conditions générales</Link></li>
            <li><Link to="/faqs">FAQs</Link></li>
            <li><Link to="/contactez-nous">Contactez-nous</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Rejoignez-nous</h3>
          <ul>
            <li><Link to="/ecopartage-club">EcoPartage Club</Link></li>
            <li><Link to="/visitez-nous">Visitez-nous</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Rejoignez notre club</h3>
          <form className="newsletter-signup">
            <input type="email" placeholder="Entrez votre adresse e-mail" />
            <button type="submit">S'inscrire</button>
          </form>
          <p className="newsletter-disclaimer">En soumettant votre email, vous acceptez de recevoir des emails publicitaires de EcoPartage.</p>
        </div>
      </div>
      <div className="copyright">
        <p>EcoPartage 2025. Tous droits réservés.</p>
      </div>
    </footer>
  );
}


export default Footer;





