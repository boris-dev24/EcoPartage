
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Accueil.css';

function Accueil() {
  return (
    <div className="accueil-page">
      <section className="hero">
        <h1>Partagez, échangez, économisez :-)</h1>
        <div className="search-bar">
          <input type="text" placeholder="Ville, rue" />
        </div>
        <h2>Le réseau d'entraide et d'échange 100% collaboratif et positif</h2>
      </section>

      <section className="how-it-works">
        <h2>S'entraider entre communauté n'a jamais été aussi simple</h2>
        <div className="steps">
          <div className="step">
            <h3>Je publie une annonce, une information, une demande de coup de main, un événement...</h3>
          </div>
          <div className="step">
            <h3>Mes voisins me contactent en messagerie privée</h3>
          </div>
          <div className="step">
            <h3>On fait connaissance et on s'arrange entre nous, tout simplement, sans intermédiaire :-)</h3>
          </div>
        </div>
      </section>

      <section className="inspirations">
        <h2>Inspirez-vous :-)</h2>
        <div className="inspiration-grid">
          {/* Autres annonces */}
          <div className="inspiration-item">
            <p>En informatique, je crois pouvoir dire que j'assure :) Par contre pour planter un clou c'est une autre histoire... On est peut être fait pour s'entendre</p>
          </div>
          <div className="inspiration-item">
            <p>Je partage mon wifi pendant la semaine, si ça vous dit</p>
          </div>
          {/* Autres annonces */}
        </div>
      </section>

      <section className="services">
        <h2>Découvrez une étendue infinie d'échange de proximité et de partages entre communauté</h2>
        <div className="service-categories">
          <div className="category">ANNONCES</div>
          <div className="category">EVENEMENTS</div>
        </div>
      </section>

      <section className="benefits">
        <h2>Entraide, partage et vie de communauté</h2>
        <div className="benefit-items">
          <div className="benefit-item">
            <h3>S'entraider, partager, s'informer</h3>
            <p>Les voisins s'entraident, échangent, partagent, font du troc, covoiturent, s'informent... Et s'engagent durablement en faveur d'une économie solidaire et collaborative différente.</p>
          </div>
          <div className="benefit-item">
            <h3>Faire des économies</h3>
            <p>En partageant objets et services à côté de chez soi, en favorisant les services de proximité, les voisins consomment différemment. C'est bon pour l'environnement et nos porte-monnaies.</p>
          </div>
          <div className="benefit-item">
            <h3>Dynamiser la vie de communauté</h3>
            <p>Grâce au événements des communautés, les associations et les acteurs locaux bénéficient d'une exposition locale et efficace pour diffuser leurs actions.</p>
          </div>
        </div>
      </section>

      <section className="join-movement">
        <h2>Rejoignez le mouvement :-)</h2>
        <p>Notre plateforme propulse le réseau indépendant d'entraide et d'échange au Canada notamment. Plus de 300 000 membres l'utilisent chaque jour.</p>
        <Link to="/register" className="cta-button">Participer</Link>
      </section>
    </div>
  );
}

export default Accueil;

