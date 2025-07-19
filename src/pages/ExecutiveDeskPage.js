import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaPlus, FaMinus, FaDownload } from 'react-icons/fa';
import '../assets/css/ProductPage.css';
import Breadcrumbs from '../components/Breadcrumbs';

// Import desk images
import desk1 from '../assets/images/products/desks/1.png';
import desk2 from '../assets/images/products/desks/2.png';
import desk3 from '../assets/images/products/desks/3.png';
import desk4 from '../assets/images/products/desks/4.png';
import desk5 from '../assets/images/products/desks/5.png';
import desk6 from '../assets/images/products/desks/6.png';

// Import PDF files
import productCatalogue from '../assets/images/pdf/product-catalogue.pdf';
import companyProfile from '../assets/images/pdf/company-profile.pdf';

const ExecutiveDeskPage = ({ category }) => {
  const { subcategory } = useParams();
  
  // Responsive state management
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Existing state
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageOrientations, setImageOrientations] = useState({});
  const [retryCount, setRetryCount] = useState(0);
  
  // New state for mobile dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Current selected category for display
  const currentCategory = subcategories.find(subcat => 
    subcategory === subcat.name.toLowerCase().replace(/\s+/g, '-')
  );

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
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isDropdownOpen) {
        const dropdown = event.target.closest('.category-dropdown');
        if (!dropdown) {
          setIsDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobile, isDropdownOpen]);

  const handleOrientationChange = () => {
    setTimeout(handleResize, 100);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    try {
      if (e.currentTarget && e.currentTarget.classList) {
        e.currentTarget.classList.add('touching');
      }
    } catch (error) {
      // Silently handle any touch event errors
      console.warn('Touch start error:', error);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    try {
      if (e.currentTarget && e.currentTarget.classList) {
        setTimeout(() => {
          if (e.currentTarget && e.currentTarget.classList) {
            e.currentTarget.classList.remove('touching');
          }
        }, 100);
      }
    } catch (error) {
      // Silently handle any touch event errors
      console.warn('Touch end error:', error);
    }
  };
  
  // Get category ID based on category name
  const getCategoryId = (categoryName) => {
    switch(categoryName) {
      case 'Office Furniture':
        return 1;
      case 'Office Chairs':
        return 2;
      case 'Storage Solutions':
        return 3;
      case 'Sofa in Lounge':
        return 4;
      default:
        return 1;
    }
  };
  
  // Define breadcrumb links
  const breadcrumbLinks = [
    { url: '/', text: 'Home' },
    { url: `/${category.toLowerCase().replace(/\s+/g, '-')}`, text: category },
    { url: `/${category.toLowerCase().replace(/\s+/g, '-')}/${subcategory}`, text: subcategory?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }
  ];
  
  // Fetch subcategories for the current category
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const categoryId = getCategoryId(category);
        const response = await fetch(`http://157.175.147.228/admin/api/subcategories.php?category_id=${categoryId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch subcategories');
        }
        const data = await response.json();
        if (data.success && Array.isArray(data.subcategories)) {
          setSubcategories(data.subcategories);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, [category]);

  // Check image orientation function
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

  // Update useEffect for products to check orientations
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const formattedSubcategory = subcategory
          ?.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const response = await fetch(`http://157.175.147.228/admin/api/products.php?subcategory=${formattedSubcategory}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setProducts(data);
          // Check orientation for each product image
          const orientations = {};
          await Promise.all(
            data.map(async (product) => {
              if (product.images?.[0]) {
                const imageUrl = `http://157.175.147.228/admin/uploads/products/${product.images[0]}`;
                const isLandscape = await checkImageOrientation(imageUrl);
                orientations[product.id] = isLandscape;
              }
            })
          );
          setImageOrientations(orientations);
        } else if (data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
        setRetryCount(0);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (subcategory) {
      fetchProducts();
    }
  }, [subcategory, retryCount]);

  // Get responsive categories display count
  const getCategoriesDisplayCount = () => {
    if (isMobile) return 3;
    if (isTablet) return 4;
    return 5;
  };

  const displayCount = getCategoriesDisplayCount();
  const visibleCategories = showAllCategories ? subcategories : subcategories.slice(0, displayCount);
  
  const toggleCategories = () => {
    setShowAllCategories(!showAllCategories);
  };
  
  // Toggle dropdown for mobile
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDownload = (pdfFile, fileName) => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
  };

  if (loading) {
    return (
      <div className={`loading-container ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`error-container ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
        <div className="error-content">
          <h3>Error Loading Products</h3>
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`product-page ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      {/* Breadcrumbs Section */}
      <Breadcrumbs 
        title={subcategory?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} 
        links={breadcrumbLinks} 
      />

      {/* Product Content Section */}
      <div className="product-content">
        {/* Sidebar */}
        <div className={`categories-sidebar ${isMobile ? 'mobile-sidebar' : ''}`}>
          <h3 className="categories-title">
            {isMobile ? category.split(' ')[0] : category} Categories
          </h3>

          {isMobile ? (
            // Mobile Dropdown
            <div className="category-dropdown">
              <button 
                className="dropdown-toggle"
                onClick={toggleDropdown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <span className="dropdown-current">
                  {currentCategory ? (
                    currentCategory.name.length > 20 
                      ? `${currentCategory.name.substring(0, 20)}...`
                      : currentCategory.name
                  ) : 'Select Category'}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>
              
              <ul className={`category-list dropdown-list ${isDropdownOpen ? 'open' : ''}`}>
                {subcategories.map((subcat) => (
                  <li className="category-item dropdown-item" key={subcat.id}>
                    <Link 
                      to={`/${category.toLowerCase().replace(/\s+/g, '-')}/${subcat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onClick={() => setIsDropdownOpen(false)}
                      className={subcategory === subcat.name.toLowerCase().replace(/\s+/g, '-') ? 'active' : ''}
                    >
                      {subcat.name.length > 25 
                        ? `${subcat.name.substring(0, 25)}...`
                        : subcat.name
                      }
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            // Desktop/Tablet List
            <ul className="category-list">
              {visibleCategories.map((subcat) => (
                <li className="category-item" key={subcat.id}>
                  <input 
                    type="checkbox" 
                    id={subcat.id} 
                    checked={subcategory === subcat.name.toLowerCase().replace(/\s+/g, '-')}
                    readOnly
                  />
                  <label htmlFor={subcat.id}>
                    <Link 
                      to={`/${category.toLowerCase().replace(/\s+/g, '-')}/${subcat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {isMobile && subcat.name.length > 15 
                        ? `${subcat.name.substring(0, 15)}...`
                        : subcat.name
                      }
                    </Link>
                  </label>
                </li>
              ))}
            </ul>
          )}
          
          {!isMobile && subcategories.length > displayCount && (
            <button 
              className="read-more-btn" 
              onClick={toggleCategories}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {showAllCategories ? (
                <>
                  <FaMinus size={10} /> {isMobile ? 'Less' : 'Show Less'}
                </>
              ) : (
                <>
                  <FaPlus size={10} /> {isMobile ? 'More' : 'Show More'}
                </>
              )}
            </button>
          )}

          {/* Download Buttons */}
          <div className="download-buttons">
            <button 
              className="download-btn"
              onClick={() => handleDownload(productCatalogue, 'product-catalogue.pdf')}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <FaDownload /> {isMobile ? 'Catalogue' : 'Product Catalogue'}
            </button>
            <button 
              className="download-btn"
              onClick={() => handleDownload(companyProfile, 'company-profile.pdf')}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <FaDownload /> {isMobile ? 'Profile' : 'Company Profile'}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`products-grid ${isMobile ? 'mobile-grid' : isTablet ? 'tablet-grid' : 'desktop-grid'}`}>
          {products.length === 0 ? (
            <div className="no-products">
              <div className="no-products-content">
                <h3>No Products Found</h3>
                <p>No products available in this category at the moment.</p>
                <button onClick={handleRetry} className="retry-btn">
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            products.map(product => (
              <div 
                key={product.id} 
                className={`product-card ${imageOrientations[product.id] ? 'landscape' : 'portrait'}`}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className={`product-card-image ${imageOrientations[product.id] ? 'landscape' : 'portrait'}`}>
                  <img 
                    src={`http://157.175.147.228/admin/uploads/products/${product.images?.[0] || ''}`}
                    alt={product.name}
                    onError={handleImageError}
                    loading="lazy"
                  />
                  {product.is_new && <span className="new-tag">New</span>}
                </div>
                <div className="product-card-content">
                  <h3 className="product-card-title">
                    <Link 
                      to={`/product/${product.id}`}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      {isMobile && product.name.length > 25
                        ? `${product.name.substring(0, 25)}...`
                        : product.name
                      }
                    </Link>
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDeskPage; 