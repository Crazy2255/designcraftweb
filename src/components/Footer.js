import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp, FaTelegram, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import '../assets/css/Footer.css';
import footerLogo from '../assets/images/footer-logo.png';

const Footer = () => {
  // Add responsive state management
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle responsive behavior
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setScreenWidth(width);
    setIsMobile(width <= 767);
    setIsTablet(width >= 768 && width <= 991);
    setIsDesktop(width > 991);
  }, []);

  useEffect(() => {
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [handleResize]);

  const handleOrientationChange = () => {
    setTimeout(handleResize, 100);
  };

  // Handle image loading
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    if (e.currentTarget && e.currentTarget.classList) {
      e.currentTarget.classList.add('touching');
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    if (e.currentTarget && e.currentTarget.classList) {
      setTimeout(() => {
        e.currentTarget.classList.remove('touching');
      }, 100);
    }
  };

  // Social media links with responsive behavior
  const socialLinks = [
    { icon: FaInstagram, url: 'https://instagram.com', name: 'Instagram', class: 'instagram' },
    { icon: FaFacebook, url: 'https://facebook.com', name: 'Facebook', class: 'facebook' },
    { icon: FaTwitter, url: 'https://twitter.com', name: 'Twitter', class: 'twitter' },
    { icon: FaLinkedin, url: 'https://linkedin.com', name: 'LinkedIn', class: 'linkedin' },
    { icon: FaTelegram, url: 'https://t.me/designcraft', name: 'Telegram', class: 'telegram' },
    { icon: FaWhatsapp, url: 'https://wa.me/971501989883', name: 'WhatsApp', class: 'whatsapp' }
  ];

  // Quick links data
  const quickLinks = [
    { to: '/about-us', label: 'About Us' },
    { to: '/blog', label: 'Blog' },
    { to: '/design-space', label: 'Design Space' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/contact', label: 'Contact' }
  ];

  // Customer service links
  const customerServiceLinks = [
    { to: '/faq', label: 'FAQ' },
    { to: '/terms', label: 'Terms & Condition' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/return', label: 'Return Policy' }
  ];

  // Contact information
  const contactInfo = {
    emails: ['info@designcraft.ae', 'sales@designcraft.ae'],
    phones: ['04 337 34 46', '+971 50 198 9883', '+971 50 198 9883'],
    address: {
      line1: 'Abdul Razzaq Mohiddin Abdulla',
      line2: 'Warehouse Shed No-1 Opp. Pedal Art',
      line3: 'Al Quoz Industrial Area – 1, Dubai'
    }
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Description Section */}
        <div className="footer-section">
          {!imageError ? (
            <img 
              src={footerLogo} 
              alt="Design Craft Logo" 
              className="footer-logo"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="footer-logo-fallback">
              DesignCraft
            </div>
          )}
          
          <p>
            {isMobile 
              ? 'DesignCraft Company - crafting excellence in furniture design with passion and style.'
              : 'At DesignCraft Company, our story is one of passion, craftsmanship, and a relentless pursuit of excellence. It all began with a vision to redefine the way people experience furniture – not just as functional pieces, but as expressions of personal style and comfort.'
            }
          </p>
          
          <div className="social-icons">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a 
                  key={index}
                  href={social.url} 
                  className={`social-icon ${social.class}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  title={social.name}
                >
                  <IconComponent />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {quickLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  to={link.to}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul className="footer-links">
            {customerServiceLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  to={link.to}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Information Section */}
        <div className="footer-section">
          <h3>Contact Info</h3>
          
          <div className="contact-info">
            {/* Email Items */}
            {contactInfo.emails.map((email, index) => (
              <div key={`email-${index}`} className="contact-item">
                <FaEnvelope className="contact-icon" />
                <a href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            ))}

            {/* Phone Items */}
            {contactInfo.phones.map((phone, index) => (
              <div key={`phone-${index}`} className="contact-item">
                <FaPhone className="contact-icon" />
                <a href={`tel:${phone.replace(/\s/g, '')}`}>
                  {phone}
                </a>
              </div>
            ))}

            {/* Address */}
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                {contactInfo.address.line1}<br />
                {contactInfo.address.line2}<br />
                {contactInfo.address.line3}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>
          © 2025-2026 Designcraft. All Rights Reserved | 
          <Link to="/privacy">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer; 