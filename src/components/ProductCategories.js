import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/ProductCategories.css';

// Default placeholder image if category image is not available
import defaultImage from '../assets/images/no-image.png';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Handle responsive behavior
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setScreenWidth(width);
    setIsMobile(width <= 767);
    setIsTablet(width >= 768 && width <= 991);
  }, []);

  useEffect(() => {
    handleResize();
    fetchCategories();
    
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

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching categories...');
      
      const response = await fetch('http://157.175.147.228/admin/api/categories.php');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        console.log('Setting categories:', data.data);
        setCategories(data.data);
        setRetryCount(0);
      } else {
        console.error('Invalid data format:', data);
        throw new Error(data.message || 'Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = (e) => {
    e.target.style.opacity = '1';
  };

  const handleImageError = useCallback((e) => {
    console.warn('Category image failed to load:', e.target.src);
    e.target.onerror = null;
    e.target.src = defaultImage;
  }, []);

  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      fetchCategories();
    }
  };

  // Get grid columns based on screen size
  const getGridColumns = () => {
    if (screenWidth >= 992) return 4; // Desktop: 4 columns
    if (screenWidth >= 768) return 2; // Tablet: 2 columns
    return 1; // Mobile: 1 column
  };

  if (loading) {
    return (
      <div className="loading-container">
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-categories">
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Categories</h3>
            <p>{error}</p>
            {retryCount < 3 && (
              <button 
                onClick={handleRetry}
                className="retry-button"
                style={{
                  padding: isMobile ? '10px 20px' : '12px 24px',
                  fontSize: isMobile ? '14px' : '16px'
                }}
              >
                Retry ({retryCount + 1}/3)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="product-categories">
        <div className="empty-state">
          <h3>No Categories Available</h3>
          <p>Please check back later for available categories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-categories">
      <div className="categories-container">
        <div 
          className={`categories-grid ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}
          style={{
            '--grid-columns': getGridColumns()
          }}
        >
          {categories.map((category, index) => (
            <div 
              key={category.id} 
              className="category-card"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="category-image-wrapper">
                <img 
                  src={category.image ? `http://157.175.147.228/admin/uploads/categories/${category.image}` : defaultImage} 
                  alt={category.name}
                  className="category-image"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  style={{
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                <div className="category-overlay"></div>
                <div className="category-content">
                  <h3 className="category-name">
                    {isMobile && category.name.length > 20 
                      ? `${category.name.substring(0, 18)}...`
                      : category.name
                    }
                  </h3>
                  {!isMobile && category.description && (
                    <p className="category-description">
                      {category.description.length > 60 
                        ? `${category.description.substring(0, 57)}...`
                        : category.description
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Category count for desktop/tablet */}
        {!isMobile && (
          <div className="categories-summary">
            <p>Showing {categories.length} categor{categories.length === 1 ? 'y' : 'ies'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCategories; 