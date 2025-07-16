import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/DesignFitOut.css';
import heroImage from '../assets/images/banner/design-fitout.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import ContactForm from '../components/ContactForm';  
import HomeCaseStudy from '../components/HomeCaseStudy';
import ClientSlider from '../components/ClientSlider';
import { FaBuilding, FaChartLine, FaPencilRuler, FaLayerGroup, FaTools, FaUsers, FaDesktop, FaIndustry, FaTools as FaInstall, FaHandshake, FaRegObjectUngroup, FaRegBuilding, FaCube } from 'react-icons/fa';

import axios from 'axios';
import product1 from '../assets/images/products/1.JPG';
import product2 from '../assets/images/products/2.JPG';
import product3 from '../assets/images/products/3.JPG';
import product4 from '../assets/images/products/1.png';

const DesignFitOut = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      phone: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios({
        method: 'post',
        url: 'https://design.elitedigitals.ae/admin/api/submit-contact.php',
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message. We will get back to you soon!'
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to submit form. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbLinks = [
    { text: 'Home', url: '/' },
    { text: 'DesignFitOut', url: '/design-fitout' }
  ];

  const fitoutProjects = [
    {
      id: 1,
      title: "OFFICE SPACE PLANNING",
      description: "Office space planning is essential in arranging a workspace to maximize efficiency, productivity, and functionality. It involves carefully considering factors such as the available space, the needs of the employees, workflow patterns, and ergonomic principles.",
      icon: <FaBuilding />
    },
    {
      id: 2,
      title: "OFFICE FIT-OUT WORKS",
      description: "Transforming your office space into a functional, aesthetically pleasing, and productive environment tailored to your needs.",
      icon: <FaTools />
    },
    {
      id: 3,
      title: "OFFICE INTERIOR DESIGN",
      description: "From concept development to final implementation, we manage every aspect of the design process, ensuring seamless execution and stunning results.",
      icon: <FaPencilRuler />
    }
  ];

  const services = [
    {
      id: 1,
      title: "Interior Design & Fitout",
      description: "Elevate your living space with unparalleled comfort and style.",
      image: product1
    },
    {
      id: 2,
      title: "Interior Design & Fitout",
      description: "Elevate your living space with unparalleled comfort and style.",
      image: product2
    },
    {
      id: 3,
      title: "Interior Design & Fitout",
      description: "Elevate your living space with unparalleled comfort and style.",
      image: product3
    },
    {
      id: 4,
      title: "Interior Design & Fitout",
      description: "Elevate your living space with unparalleled comfort and style.",
      image: product4
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const visibleServices = currentSlide === 0 
    ? services.slice(0, 3) 
    : services.slice(1, 4);

  return (
    <div className="design-fitout-page">
      {/* Hero Section */}
      <div className="hero-section1">
        <div className="hero-image">
          <img src={heroImage} alt="Design Fitout" />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <h1>OFFICE FIT-OUT, DESIGN & REFURBISHMENT</h1>
          <p>Browse. Pick. Procure.</p>
        </div>
      </div>

      {/* Workspace Transformation Section */}
      <div className="workspace-transform-section">
        <div className="transform-content">
          <div className="transform-left">
            <img src={heroImage} alt="Workspace Design" className="transform-image" />
          </div>
          <div className="transform-right">
            <h2>Transforming Your Workspace in Dubai</h2>
            <p>Design Craft is one of the most trusted companies in Dubai for office interiors and furniture. We offer office space planning, office interior design, and office refurbishment services.</p>
            
            <div className="services-list">
              <div className="service-item">
                <FaLayerGroup className="service-icon" />
                <span>Office Space Planning</span>
              </div>
              <div className="service-item">
                <FaTools className="service-icon" />
                <span>Office Fit-Out Works</span>
              </div>
              <div className="service-item">
                <FaPencilRuler className="service-icon" />
                <span>Office Interior Design</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="design-fitout-container">
        <h1 className="main-title">Transforming Your Workspace in Dubai</h1>

        <div className="design-fitout-grid">
          {fitoutProjects.map((fitout) => (
            <div key={fitout.id} className="fitout-card">
              <div className="icon-container">
                {fitout.icon}
              </div>
              <h3>{fitout.title}</h3>
              <p>{fitout.description}</p>
            </div>
          ))}
        </div>
      </div>

      <HomeCaseStudy />
      <ContactForm />

      {/* Workflow Section */}
      <div className="workflow-section">
        <div className="workflow-container">
          <h2 className="workflow-title">Our Process</h2>
          <div className="workflow-ladder">
            <div className="workflow-step">
              <div className="workflow-content left">
                <div className="workflow-icon">
                  <FaUsers className="icon" />
                </div>
                <div className="workflow-text">
                  <h3>Consultation</h3>
                  <p>Understanding your vision and goals to use the complete potential of available space.</p>
                </div>
              </div>
              <div className="workflow-line"></div>
            </div>

            <div className="workflow-step">
              <div className="workflow-content right">
                <div className="workflow-icon">
                  <FaCube className="icon" />
                </div>
                <div className="workflow-text">
                  <h3>Space Planning</h3>
                  <p>We present you with a 3D design to understand how finished project will look.</p>
                </div>
              </div>
              <div className="workflow-line"></div>
            </div>

            <div className="workflow-step">
              <div className="workflow-content left">
                <div className="workflow-icon">
                  <FaIndustry className="icon" />
                </div>
                <div className="workflow-text">
                  <h3>Manufacturing</h3>
                  <p>We will start manufacturing the furniture and fixtures asper the design approved.</p>
                </div>
              </div>
              <div className="workflow-line"></div>
            </div>

            <div className="workflow-step">
              <div className="workflow-content right">
                <div className="workflow-icon">
                  <FaTools className="icon" />
                </div>
                <div className="workflow-text">
                  <h3>Installation</h3>
                  <p>With our inhouse expertise, you can trust us with the delivery & installation to be very quick.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section">
        <h2 className="services-title">Services</h2>
        <div className="services-container">
          <div className="services-grid">
            {visibleServices.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="slider-dots">
            {[0, 1].map((index) => (
              <button
                key={index}
                className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <ClientSlider />
    </div>
  );
};

export default DesignFitOut; 