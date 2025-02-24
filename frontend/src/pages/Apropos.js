import React from 'react';
import '../styles/Apropos.css';

function Apropos() {
  return (
    <div className="apropos-container">
      <div className="header">
        <h1>Réseau des voisins</h1>
        <p>Aide & conseils</p>
      </div>

      <div className="content-container">
        <div className="sidebar">
          <ul>
            <li>Premiers pas</li>
            <li>Disponibilité</li>
            <li>Les annonces</li>
            <li>Associations</li>
            <li>Ma mairie</li>
            <li>Professionnels</li>
            <li>Données personnelles</li>
          </ul>
        </div>

        <div className="main-content">
          <h2>PROXIIGEN (GÉNÉRATIONS DE PROXIMITÉ)</h2>
          <h3>En quoi PROXiiGEN est-il différent ?</h3>
          <p>
            Nous sommes aujourd'hui le seul réseau à proposer à la fois des services bénévoles, des dons ou
            des trocs d'objets tout en acceptant les services rémunérés mais sans aucune cagnotte ni
            contrepartie financière. Les valeurs de PROXIIGEN ne sont pas de vous inciter à des revenus
            complémentaires à tout prix. Vous pouvez vendre un service ou un objet, mais gardez en tête que
            les valeurs sont avant tout l'entraide, le partage et le renforcement du lien social pour mieux vivre
            ensemble.
          </p>
          <p>
            De par notre positionnement de proximité, nous sommes également un relais privilégié pour les
            acteurs locaux, qu'ils soient associatifs, producteurs, AMAP... Ou comme nous acteurs d'une société
            collaborative différente. Cela nous permet notamment de leur faire bénéficier de notre visibilité
            pour organiser leurs initiatives locales, comme les groupements de parents d'élèves, les appels à
          </p>
        </div>
      </div>
    </div>
  );
}

export default Apropos;

