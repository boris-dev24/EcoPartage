import React, { useState } from "react";
import "../style/contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formDataToSend = new FormData(event.target);
    formDataToSend.append("access_key", "5370d28f-78b9-4a82-aa83-ea75785f87a8");
    
    const object = Object.fromEntries(formDataToSend);
    const json = JSON.stringify(object);
    
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      }).then((res) => res.json());
      
      if (res.success) {
        console.log("Success", res);
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-section">
      <div className="contact-container">
        <div className="contact-left">
          {/* Emplacement pour votre image */}
          <div className="image-container">
            <img src="/images/aider.jpeg" alt="EcoPartage" className="eco-image" />
          </div>
        </div>
        
        <div className="contact-right">
          <h2 className="contact-title">Contactez-nous</h2>
          <p className="contact-subtitle">Envoyez-nous un message pour toute question sur EcoPartage</p>
          
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Sujet"
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Envoi en cours..." : "Envoyer"}
            </button>
            
            {isSuccess && (
              <div className="success-message">
                Votre message a été envoyé avec succès! Nous vous répondrons bientôt.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;