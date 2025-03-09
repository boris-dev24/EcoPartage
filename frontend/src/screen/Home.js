

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaCommentDots, FaHandshake } from 'react-icons/fa';
import '../style/home.css';


function InspirationCarousel() {
  const [currentInspiration, setCurrentInspiration] = useState(0);
  const inspirations = [
    {
        text: "Je partage mon wifi pendant la semaine, si ça vous dit",
        backgroundImage: "/images/amelioration.jpg",
      },
      {
        text: "J'aurais besoin d'un coup de main pour transporter 2 canapés à la déchetterie... J'offre l'apéro au retour",
        backgroundImage: "/images/partage.jpeg",
      },
      {
        text: "J'aurais besoin d'un coup de main pour transporter 2 canapés à la déchetterie... J'offre l'apéro au retour",
        backgroundImage: "/images/aider.jpeg",
      },
      {
        text: "J'aurais besoin d'un coup de main pour transporter 2 canapés à la déchetterie... J'offre l'apéro au retour",
        backgroundImage: "/images/dons-vetements.jpg",
      }
  ];


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentInspiration((prevIndex) => (prevIndex + 1) % inspirations.length);
    }, 5000);


    return () => clearInterval(timer);
  }, []);


  return (
    <div className="inspiration-carousel">
      {inspirations.map((inspiration, index) => (
        <div
          key={index}
          className={`inspiration-item ${index === currentInspiration ? 'active' : ''}`}
          style={{ backgroundImage: `url(${inspiration.backgroundImage})` }} // Applique l'image de fond
        >
          <p>"{inspiration.text}"</p>
        </div>
      ))}
    </div>
  );
}


function Home() {
  const [activeCategory, setActiveCategory] = useState('SERVICES');


  const serviceData = {
    ANNONCES: [
      { image: '/images/Capture_ecopartage.jpg', title: 'PIANO AMEDÉE THIBAUT' },
      { image: '/images/logo.jpeg', title: 'ecopartage' },
      { image: '/images/banner.jpeg', title: 'banner' },
      { image: '/images/amelioration.jpg', title: 'amelioration de la vie' },
      { image: '/images/partage.jpeg', title: 'partage' },
      { image: '/images/social.jpeg', title: 'social' },
      { image: '/images/solidarite.jpeg', title: 'solidarite' },
      { image: '/images/aider.jpeg', title: 'soutien' },
    ],
    SERVICES: [
      { image: '/images/dons-vetements.jpg', title: 'dons' },
      { image: '/images/OIP.jpeg', title: 'aide' },
      { image: '/images/banner.jpeg', title: 'banner' },
      { image: '/images/amelioration.jpg', title: 'amelioration de la vie' },
      { image: '/images/partage.jpeg', title: 'partage' },
      { image: '/images/social.jpeg', title: 'social' },
      { image: '/images/solidarite.jpeg', title: 'solidarite' },
      { image: '/images/aider.jpeg', title: 'soutien' },
    ],
   
  };


  return (
    <div className="accueil-page">
      <section className="hero">
        <h1>Partagez, échangez, économisez</h1>
        <h2>Le réseau d'entraide et d'échange 100% collaboratif et positif</h2>
        <InspirationCarousel />
      </section>


      <section className="how-it-works">
        <h2>S'entraider entre communautés n'a jamais été aussi simple</h2>
        <div className="steps">
          <div className="step">
            <FaBullhorn size={50} color="#48d24c" />
            <p>Je publie une annonce, une information, un événement...</p>
          </div>
          <div className="step">
            <FaCommentDots size={50} color="#48d24c" />
            <p>Des personnes me contactent en messagerie privée</p>
          </div>
          <div className="step">
            <FaHandshake size={50} color="#48d24c" />
            <p>On fait connaissance et on s'arrange entre nous, tout simplement, sans intermédiaire :-)</p>
          </div>
        </div>
        <h2 className="inspiration-title">Inspirez-vous</h2>
        <InspirationCarousel />
      </section>


      <section className="services">
        <h2>Découvrez une étendue infinie d'annonces, de services de proximité et de partages </h2>
        <div className="service-categories">
          {Object.keys(serviceData).map((category) => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="service-examples">
          {serviceData[activeCategory].map((item, index) => (
            <div key={index} className="service-item">
              <img src={item.image} alt={item.title} />
              <div className="service-info">
                <h3>{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>


      <section className="benefits">
        <h2>Entraide, partage et communauté</h2>
        <div className="benefit-items">
          <div className="benefit-item">
            <h3>S'entraider, partager, s'informer</h3>
            <p>Les communautés s'entraident, échangent, partagent, font du troc, s'informent... Et s'engagent durablement en faveur d'une économie solidaire et collaborative différente.</p>
          </div>
          <div className="benefit-item">
            <h3>Faire des économies</h3>
            <p>En partageant objets et services, en favorisant les services de proximité, la communauté consomme différemment. C'est bon pour l'environnement et nos porte-monnaies.</p>
          </div>
          <div className="benefit-item">
            <h3>Dynamiser la vie de communauté</h3>
            <p>Grâce aux événements de la communauté et aux pages de la vie locale, les associations et les acteurs locaux bénéficient d'une exposition locale et efficace pour diffuser leurs actions.</p>
          </div>
        </div>
        <div className="different-section">
          <h3>100% différent</h3>
          <p>Ecopartage n'est pas un simple site d'annonces mais un vrai réseau social qui vous relie à une grande communauté. Les valeurs du réseau sont claires : entraide, lien social et dynamisation de la vie de communauté. Le réseau a pour vocation de créer du lien durable, sans publicité, sans revente de vos données personnelles. Et ça change tout :-)</p>
          <Link to="/register" className="cta-button">PARTICIPER</Link>
        </div>
      </section>


      <section className="network-features">
        <h2>Le réseau social communautaire adapté à ma ville</h2>
        <div className="features-container">
          <div className="features-left">
            <div className="feature">
              <h3>Un réseau adapté aux enjeux de demain</h3>
              <p>Notre réseau engage à une économie plus vertueuse, solidaire et circulaire. En créant plus de lien social, le réseau favorise aussi les échanges de connaissance tout en préservant la confidentialité des informations échangées.</p>
            </div>
            <div className="feature">
              <h3>Simple</h3>
              <p>Il suffit de vous enregistrer et vous voilà connecté(e) à votre communauté. Le réseau vous propose les informations et annonces les plus proches de vous. Envie de partager ? Publiez votre annonce gratuitement.</p>
            </div>
            <div className="feature">
              <h3>Une autre façon de s'entraider</h3>
              <p>Même si certains services peuvent être rémunérés, la communauté est engagée par des valeurs plus durables qu'une simple transaction de service. Sur ECOPARTAGE, on rend des services, on donne des objets mais on partage aussi des connaissances et on se rejoint au sein de groupes thématiques.</p>
            </div>
          </div>
          <div className="features-center">
            <img src="/images/logo.jpeg" alt="Screenshot de l'application" />
          </div>
          <div className="features-right">
            <div className="feature">
              <h3>Local et collaboratif</h3>
              <p>Le numérique c'est bien, mais se rencontrer c'est mieux. C'est pourquoi nous aimons accueillir les ateliers relais, les associations, groupes de communauté et autres points de rencontre sur notre réseau.</p>
            </div>
            <div className="feature">
              <h3>Une énergie partagée avec les acteurs </h3>
              <p>Les associations et acteurs bénéficient d'un relais auprès du plus grand nombre, s'organisent et communiquent sur leurs actions, élargissent le cercle des utilisateurs engagés.</p>
            </div>
            <div className="feature">
              <h3>Rejoignez le mouvement </h3>
              <p>Notre plateforme propulse le réseau indépendant d'entraide et d'échange de services au Canada notamment. Plusieurs membres l'utilisent chaque jour.</p>
              <Link to="/register" className="cta-button">PARTICIPER</Link>
            </div>
          </div>
        </div>
      </section>


      <section className="join-movement">
       
      </section>
    </div>
  );
}


export default Home;





