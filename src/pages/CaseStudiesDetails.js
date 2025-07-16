import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import '../assets/css/CaseStudiesDetails.css';

const CaseStudiesDetails = () => {
  const { id } = useParams();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchCaseStudyDetails = async () => {
      try {
        const res = await fetch(`https://design.elitedigitals.ae/admin/api/case_studies.php?id=${id}`);
        
        // First check if the response is ok
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        // Try to parse the response as JSON
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Invalid JSON response from server');
        }

        // Check if the response has the expected structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }

        if (data.success && data.data.length > 0) {
          const studyData = data.data[0];
          // Ensure images is an array
          studyData.images = Array.isArray(studyData.images) ? studyData.images : [];
          setCaseStudy(studyData);
        } else {
          throw new Error(data.error || 'Case study not found');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudyDetails();
  }, [id]);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="loading"></div>
    );
  }

  if (error) {
    return (
      <div className="case-studies-details-wrapper">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="case-studies-details-wrapper">
        <div className="error">Case study not found</div>
      </div>
    );
  }

  const slides = caseStudy.images.map(image => ({
    src: `https://design.elitedigitals.ae/admin/uploads/case-studies/${image}`,
    alt: `${caseStudy.name} Project Image`
  }));

  const heroImage = caseStudy.images[0];
  const galleryImages = caseStudy.images.slice(1) || [];

  return (
    <div className="case-studies-details-wrapper">
      {/* <div className="breadcrumb-container">
        <div className="container">
          <div className="breadcrumb-wrapper">
            <Link to="/" className="breadcrumb-link">Home</Link>
            <FaChevronRight className="breadcrumb-separator" />
            <Link to="/case-study" className="breadcrumb-link">Case Studies</Link>
            <FaChevronRight className="breadcrumb-separator" />
            <span className="breadcrumb-current">{caseStudy?.name}</span>
          </div>
        </div>
      </div> */}
      
      <div className="case-study-details">
        <div className="hero-section">
          {heroImage && (
            <div className="hero-image">
              <img
                src={`https://design.elitedigitals.ae/admin/uploads/case-studies/${heroImage}`}
                alt={`${caseStudy.name} Hero`}
                onError={(e) => {
                  console.error('Hero image failed to load:', e.target.src);
                  e.target.src = require('../assets/images/products/desks/1.png');
                }}
              />
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1 className="hero-title">{caseStudy.name}</h1>
                  <p className="hero-subtitle">Modern Office Design & Fit Out</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="container">
          <div className="case-study-content">
            <div className="main-content">
              <div className="project-description">
                <p>{caseStudy.description}</p>
              </div>

              <div className="section-title">LIFTING OFF: A VISION WITH ALTITUDE</div>
              <div className="section-content">
                <p>When {caseStudy.name} approached us, they were not simply looking to build an office. They were building the future of their industry. As a rising innovator in their space, their work demanded a facility that would reflect the same level of precision and bold thinking that defines their products.</p>
              </div>

              <div className="section-title">GROUND CONTROL: REIMAGINING THE SPACE</div>
              <div className="section-content">
                <p>The facility we inherited was minimal. It was a bare shell with only the most basic finishes. Our task was to completely refit both the ground floor and mezzanine, transforming the space into a high-performance environment from the ground up.</p>
              </div>

              <div className="section-title">DESIGN IN MOTION: AESTHETIC WITH PURPOSE</div>
              <div className="section-content">
                <p>The design intent from the beginning was futuristic. We wanted something that did more than support their work. We wanted a visual expression of their brand, something that captured the precision, speed, and intelligence at the core of their identity.</p>
              </div>
            </div>

            <div className="project-info">
              <div className="info-title">PROJECT INFO</div>
              
              <div className="info-section">
                <div className="info-label">AREA:</div>
                <div className="info-value">{caseStudy.sqft} sq ft</div>
              </div>

              <div className="info-section">
                <div className="info-label">LOCATION:</div>
                <div className="info-value">{caseStudy.location}</div>
              </div>

              <div className="info-section">
                <div className="info-label">TIMESCALE:</div>
                <div className="info-value">{caseStudy.timescale || '12 weeks'}</div>
              </div>

              <div className="info-section">
                <div className="info-label">PROJECT SCOPE:</div>
                <div className="info-value">{caseStudy.scope}</div>
              </div>
            </div>
          </div>

          <div className="gallery-section">
            <h2 className="gallery-title">PROJECT GALLERY</h2>
            <div className="gallery-grid">
              {galleryImages.length > 0 ? (
                galleryImages.map((image, index) => (
                  <div 
                    key={index} 
                    className="gallery-item"
                    onClick={() => openLightbox(index + 1)}
                  >
                    <img
                      src={`https://design.elitedigitals.ae/admin/uploads/case-studies/${image}`}
                      alt={`${caseStudy.name} Project Image ${index + 1}`}
                      onError={(e) => {
                        console.error('Gallery image failed to load:', e.target.src);
                        e.target.src = require('../assets/images/products/desks/1.png');
                      }}
                    />
                    <div className="gallery-item-overlay">
                      <span>View Image</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-images">No gallery images available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </div>
  );
};

export default CaseStudiesDetails; 