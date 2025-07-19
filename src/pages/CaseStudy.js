import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import '../assets/css/CaseStudy.css';
import { FaCalendar, FaBuilding, FaMapMarkerAlt, FaTasks } from 'react-icons/fa';

const iconMap = {
  sqft: <FaCalendar />,
  type: <FaBuilding />,
  location: <FaMapMarkerAlt />,
  scope: <FaTasks />,
};

const CaseStudy = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const res = await fetch('http://157.175.147.228/admin/api/case_studies.php');
        
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

        if (data.success) {
          if (!Array.isArray(data.data)) {
            throw new Error('Data is not in the expected format');
          }
          setCaseStudies(data.data);
          if (data.data.length === 0) {
            setError('No case studies found');
          }
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
      <main className="main-content">
        <div className="loading-container"></div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="case-study-section">
        <div style={{ textAlign: 'center', color: 'red', padding: '40px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumbs
        title="Case Study"
        links={[
          { text: 'Home', url: '/' },
          { text: 'Case Study', url: '/case-study' },
        ]}
      />
      <div className="case-study-section">
        <h2 className="case-study-heading">Case Study</h2>
        <div className="case-study-cards">
          {caseStudies.map((item, idx) => (
            <div className="case-study-card" key={item.id || idx}>
              <img
                src={item.images && item.images.length > 0 
                  ? `http://157.175.147.228/admin/uploads/case-studies/${item.images[0]}`
                  : require('../assets/images/products/desks/1.png')}
                alt={item.name}
                className="case-study-img"
                onError={(e) => {
                  e.target.src = require('../assets/images/products/desks/1.png');
                }}
              />
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
                <Link to={`/case-study/${item.id}`} className="case-study-btn">
                  View Project
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CaseStudy;
