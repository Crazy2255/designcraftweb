import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/BestSeller.css';

// Import banner image only since product images will come from API
import bannerImage from '../assets/images/banner/head-ban.png';
// Import default product image
import defaultProductImage from '../assets/images/no-image.png';

const BestSeller = () => {
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [imageOrientations, setImageOrientations] = useState({});
  
  // Add responsive state management
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

  // Get responsive grid columns based on screen size
  const getGridColumns = () => {
    if (screenWidth >= 1200) return 3;
    if (screenWidth >= 768) return 2;
    return 2; // Changed from 1 to 2 for mobile devices
  };

  // Add image orientation detection function
  const checkImageOrientation = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function() {
        const isLandscape = this.width > this.height;
        resolve(isLandscape);
      };
      img.onerror = function() {
        resolve(true); // Default to landscape on error
      };
      img.src = imageUrl;
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Move fetchProducts to useCallback
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const activeCategoryId = categories.find(
        cat => cat.name.toLowerCase() === activeTab
      )?.id;

      if (!activeCategoryId) {
        setProducts([]);
        return;
      }

      const response = await fetch('http://157.175.147.228/admin/api/products.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (Array.isArray(data)) {
        const categoryProducts = data
          .filter(product => product.category_name?.toLowerCase() === activeTab)
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 6); // Limit to maximum 6 products per category
        setProducts(categoryProducts);
        setRetryCount(0); // Reset retry count on success
      } else if (data.error) {
        throw new Error(data.message || 'Failed to load products');
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Error in fetchProducts:', err);
      setError(`Failed to load products: ${err.message}`);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [categories, activeTab]);

  useEffect(() => {
    if (activeTab) {
      fetchProducts();
    }
  }, [activeTab, fetchProducts]);

  // Add effect to check image orientations when products change
  useEffect(() => {
    const checkOrientations = async () => {
      const orientations = {};
      await Promise.all(
        products.map(async (product) => {
          if (product.images && product.images.length > 0) {
            const imageUrl = `http://157.175.147.228/admin/uploads/products/${product.images[0]}`;
            const isLandscape = await checkImageOrientation(imageUrl);
            orientations[product.id] = isLandscape;
          }
        })
      );
      setImageOrientations(orientations);
    };

    if (products.length > 0) {
      checkOrientations();
    }
  }, [products]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://157.175.147.228/admin/api/categories.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Invalid JSON response:', text);
        throw new Error('Invalid JSON response from server');
      }
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        const sortedCategories = data.data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sortedCategories);
        
        const defaultCategory = sortedCategories.find(cat => cat.id === 1) || sortedCategories[0];
        if (defaultCategory) {
          setActiveTab(defaultCategory.name.toLowerCase());
        }
      } else {
        throw new Error(data.message || 'Invalid data format received from server');
      }
    } catch (err) {
      console.error('Error in fetchCategories:', err);
      setError(`Failed to load categories: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (!isMobile || !e.currentTarget) return;
    try {
      e.currentTarget.classList.add('touching');
    } catch (error) {
      console.warn('Touch start error:', error);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !e.currentTarget) return;
    try {
      setTimeout(() => {
        if (e.currentTarget && e.currentTarget.classList) {
          e.currentTarget.classList.remove('touching');
        }
      }, 150);
    } catch (error) {
      console.warn('Touch end error:', error);
    }
  };

  // Retry function for error handling
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    if (activeTab) {
      fetchProducts();
    } else {
      fetchCategories();
    }
  };
  
  // Split products into responsive rows
  const getProductRows = () => {
    const columnsPerRow = getGridColumns();
    const rows = [];
    for (let i = 0; i < products.length; i += columnsPerRow) {
      rows.push(products.slice(i, i + columnsPerRow));
    }
    return rows;
  };

  if (loading) {
    return (
      <section className="best-seller">
        <div className="container">
          <div className="loading-container">
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="best-seller">
        <div className="container">
          <div className="error-message">
            <h3>Error Loading Products</h3>
            <p>{error}</p>
            {retryCount < 3 && (
              <button onClick={handleRetry} className="retry-btn">
                Retry ({retryCount + 1}/3)
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`best-seller-section ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      <div className="best-seller-header">
        <h2 className="best-seller-title">
          {isMobile ? 'Best Seller' : 'Best Seller'}
        </h2>
        <div className="tabs-container">
          {categories.map((category) => (
            <button 
              key={category.id}
              className={`tab ${activeTab === category.name.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleTabClick(category.name.toLowerCase())}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              aria-label={`Filter by ${category.name}`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="banner-container">
        <img 
          src={bannerImage} 
          alt="Executive Chair" 
          className="banner-image"
          loading="lazy"
        />
        <div className="banner-content">
          <h3 className="banner-title">Executive Chair</h3>
          <p className="banner-subtitle">
            {isMobile ? 
              'Be together in the moment with Design Craft calling' :
              'Be together in the moment\nwith Design Craft calling'
            }
          </p>
          {/* <Link to="/contact" className="enquiry-button">
            {isMobile ? 'ENQUIRY' : 'ENQUIRY NOW'}
          </Link> */}
        </div>
      </div>
      
      {loadingProducts ? (
        <div className="loading-container">
          <p>Loading.....</p>
        </div>
      ) : (
        <>
          {getProductRows().map((row, rowIndex) => (
            <div key={rowIndex} className="product-grid-row">
              {row.map(product => (
                <div key={product.id} className="product-card">
                  <Link 
                    to={`/product/${product.id}`} 
                    className="product-link"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    aria-label={`View ${product.name}`}
                  >
                    <div className={`product-image-container ${imageOrientations[product.id] ? 'landscape' : 'portrait'}`}>
                      <img 
                        src={product.images && product.images.length > 0 
                          ? `http://157.175.147.228/admin/uploads/products/${product.images[0]}`
                          : defaultProductImage} 
                        alt={product.name} 
                        className={`product-image ${imageOrientations[product.id] ? 'landscape' : 'portrait'}`}
                        loading={rowIndex < 2 ? 'eager' : 'lazy'}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultProductImage;
                        }}
                      />
                    </div>
                    <h4 className="product-name">{product.name}</h4>
                  </Link>
                </div>
              ))}
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="no-products">
              {isMobile ? 
                'No products available' : 
                'No products available for this category'
              }
            </div>
          )}
        </>
      )}
      
      {/* Mobile product count indicator */}
      {isMobile && products.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '1rem',
          padding: '0.5rem',
          fontSize: '0.85rem',
          color: '#666',
          background: 'rgba(0,0,0,0.05)',
          borderRadius: '20px',
          display: 'inline-block',
          marginLeft: '50%',
          transform: 'translateX(-50%)'
        }}>
          {products.length} {products.length === 1 ? 'Product' : 'Products'} Found
        </div>
      )}
    </section>
  );
};

export default BestSeller; 