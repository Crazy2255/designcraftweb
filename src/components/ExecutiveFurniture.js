import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import '../assets/css/ExecutiveFurniture.css';
import '../assets/css/LoadingStyles.css';

// Import banner image
import bannerImage from '../assets/images/banner/head-ban.png';

const ExecutiveFurniture = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExecutiveProducts();
  }, []);

  const fetchExecutiveProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://design.elitedigitals.ae/admin/api/products.php?subcategory=Executive Desk');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching executive products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="executive-section">
        <div className="loading-container"></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="executive-section">
        <div className="error-message">{error}</div>
      </section>
    );
  }

  return (
    <section className="executive-section">
      <div className="executive-header">
        <h2 className="executive-title">Executive Desk</h2>
        <Link to="/collection/executive-furniture" className="see-all-link">
          See All Collection 
          <FaChevronRight />
        </Link>
      </div>
      
      <div className="banner-container">
        <img 
          src={bannerImage} 
          alt="Executive Desk" 
          className="banner-image" 
        />
        <div className="banner-content">
          <h3 className="banner-title">Executive Desk</h3>
          <p className="banner-subtitle">
            Be together in the moment<br />
            with Design Craft calling
          </p>
          {/* <Link to="/contact" className="enquiry-button">
            ENQUIRY NOW
          </Link> */}
        </div>
      </div>
      
      <div className="product-gallery">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <div className="product-image-container">
                  <img 
                    src={`https://design.elitedigitals.ae/admin/uploads/products/${product.images[0]}`}
                    alt={product.name} 
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <h4 className="product-name">{product.name}</h4>
              </Link>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No executive desk products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExecutiveFurniture; 