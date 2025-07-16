import React from 'react';
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import '../assets/css/ContactDetail.css';
import Breadcrumbs from '../components/Breadcrumbs';

const ContactDetail = () => {
  const breadcrumbLinks = [
    { text: 'Home', url: '/' },
    { text: 'Contact', url: '/contact' }
  ];

  return (
    <div className="contact-detail-page">
      {/* Breadcrumbs */}
      <Breadcrumbs title="Contact" links={breadcrumbLinks} />

      {/* Contact Information Section */}
      <div className="contact-info-section">
        <div className="contact-info-container">
          <div className="contact-info-item">
            <div className="icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Our Location</h3>
            <p>Dubai, United Arab Emirates</p>
          </div>

          <div className="contact-info-item">
            <div className="icon">
              <FaPhone />
            </div>
            <h3>Phone Number</h3>
            <p>+971 50 123 4567</p>
          </div>

          <div className="contact-info-item">
            <div className="icon">
              <FaEnvelope />
            </div>
            <h3>Email Address</h3>
            <p>info@designcraft.com</p>
          </div>

          <div className="contact-info-item">
            <div className="icon">
              <FaClock />
            </div>
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <ContactForm />

      {/* Map Section */}
      <div className="map-section">
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d139058.64253694616!2d55.095068316406234!3d25.138638999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d42772bc79d%3A0x205976ceee17c31!2sDESIGNCRAFT%20OFFICE%20FURNITURE!5e1!3m2!1sen!2sae!4v1752078226129!5m2!1sen!2sae"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DESIGNCRAFT OFFICE FURNITURE Location"
          ></iframe>
          <div className="map-overlay">
            <a 
              href="https://maps.app.goo.gl/R9UyqG159ySvfuEf7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="open-in-maps-btn"
            >
              <FaMapMarkerAlt />
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail; 