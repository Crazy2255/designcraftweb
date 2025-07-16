import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/HomeCaseStudy.css';
import { FaCalendar, FaBuilding, FaMapMarkerAlt, FaTasks, FaArrowRight } from 'react-icons/fa';

const iconMap = {
  sqft: <FaCalendar />,
  type: <FaBuilding />,
  location: <FaMapMarkerAlt />,
  scope: <FaTasks />,
};

const HomeCaseStudy = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch('https://design.elitedigitals.ae/admin/api/case_studies.php');
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error('Failed to parse JSON:', text);
          throw new Error('Invalid JSON response from server');
        }

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid response format');
        }

        if (data.success) {
          if (!Array.isArray(data.data)) {
            throw new Error('Data is not in the expected format');
          }
          // Only take the first 3 case studies for homepage display
          setCaseStudies(data.data.slice(0, 3));
        } else {
          throw new Error(data.error || 'Failed to load case studies');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  if (loading) {
    return (
      <div className="loading"></div>
    );
  }

  if (error) {
    return null; // Don't show error state on homepage
  }

  if (caseStudies.length === 0) {
    return null; // Don't show empty state on homepage
  }

  return (
    <div className="home-case-study-section">
      <div className="section-header1">
        <div className="title-container">
          <h2 className="case-title">Recent Projects</h2>
         
        </div>
        <Link to="/case-study" className="view-all-link">
          View All <FaArrowRight className="arrow-icon" />
        </Link>
      </div>
      
      <div className="case-study-grid">
        {caseStudies.map((item, idx) => (
          <div className="case-study-card" key={item.id || idx}>
            <div className="card-image-container">
              <img
                src={item.images && item.images.length > 0 
                  ? `https://design.elitedigitals.ae/admin/uploads/case-studies/${item.images[0]}`
                  : require('../assets/images/products/desks/1.png')}
                alt={item.name}
                className="case-study-img"
                onError={(e) => {
                  e.target.src = require('../assets/images/products/desks/1.png');
                }}
              />
            </div>
            <div className="case-study-info">
              <h3 className="case-study-title">{item.name}</h3>
              <ul className="case-study-details">
                <li className="case-study-detail">
                  <span className="case-study-icon">{iconMap.sqft}</span>
                  {item.sqft} SQFT
                </li>
                <li className="case-study-detail">
                  <span className="case-study-icon">{iconMap.type}</span>
                  {item.type}
                </li>
                <li className="case-study-detail">
                  <span className="case-study-icon">{iconMap.location}</span>
                  {item.location}
                </li>
                <li className="case-study-detail">
                  <span className="case-study-icon">{iconMap.scope}</span>
                  SCOPE - {item.scope}
                </li>
              </ul>
              <Link to={`/case-study/${item.id}`} className="view-project-btn">
                View Project
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeCaseStudy; 