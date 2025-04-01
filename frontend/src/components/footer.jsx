import React from 'react';
import './footer.css'; // Import your custom CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faFacebook, faTwitter } from '@fortawesome/free-brands-svg-icons'; // Import brand icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2025 Kodused retseptid. Kõik õigused kaitstud.</p>
        <p>Kontakt: info@kodusedretseptid.ee</p>
        
        <div className="social-icons">
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" className="social-icon" />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" className="social-icon" />
          </a>
          <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} size="2x" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
