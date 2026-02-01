import React, { useState } from 'react';
import './Navbar.css';

function Navbar({ scrollToChat }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMenuOpen(false);
    if (scrollToChat) {
      scrollToChat();
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-logo">Iron Lady</span>
        </div>
        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <a href="#home" className="navbar-link" onClick={handleHomeClick}>
              Home
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="https://iamironlady.com/contactUs"
              className="navbar-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              Contact Us
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="https://iamironlady.com/resources/video-resources"
              className="navbar-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              Demo Videos
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="https://workshops.iamironlady.com/masterclass_app"
              className="navbar-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              Book Masterclass
            </a>
          </li>
          <li className="navbar-item">
            <a
              href="https://iamironlady.com/programs"
              className="navbar-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
            >
              Available Programs
            </a>
          </li>
        </ul>
        <button 
          className="navbar-toggle" 
          aria-label="Toggle menu"
          onClick={handleMenuToggle}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

