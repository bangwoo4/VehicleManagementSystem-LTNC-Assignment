import React, { useState } from 'react';
import './Footer.css';
import ContactInfomation from './ContactInfomation';


const Footer = () => {
  const [showContact, setShowContact] = useState(false);

  const handleContactClick = (event) => {
    event.preventDefault(); // Prevent the default action
    setShowContact(prevShowContact => !prevShowContact); // Toggle the state
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <h3>Vehicle and Driver Management System</h3>
        <p>Providing efficient management solutions for your vehicles and drivers.</p>
      </div>
      <div className="footer-links">
        <ul>
          <li><a href="/">Log out</a></li>
          <li><a href="/contact" onClick={handleContactClick}>Contact Us</a></li>
        </ul>
      </div>
      {showContact && (
        <div className={`contact-info ${showContact ? 'show' : ''}`}>
            <ContactInfomation /> {/* ContactInfo component */}
        </div>
        )}
      <div className="footer-social">
          <a href="https://facebook.com"><i class="fa-brands fa-facebook"></i></a>
          <a href="https://instagram.com"><i class="fa-brands fa-instagram"></i></a>
          <a href="https://twitter.com"><i class="fa-brands fa-twitter"></i></a>
          <a href="https://youtube.com"><i class="fa-brands fa-youtube"></i></a>
      </div>
      <div className="footer-copyright">
        <p className='CopyRight'>© 2027 Vehicle and Driver Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;