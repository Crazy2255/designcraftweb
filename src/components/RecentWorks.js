import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/RecentWorks.css';

const RecentWorks = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add responsive state management
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [retryCount, setRetryCount] = useState(0);

  // Handle responsive behavior
  const handleResize = useCallback(() => {
    const width = window.innerWidth;
    setScreenWidth(width);
    setIsMobile(width <= 767);
    setIsTablet(width >= 768 && width <= 992);
    setIsDesktop(width > 992);
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

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Handle image loading errors
  const handleImageError = (index, itemName) => {
    setImageErrors(prev => ({
      ...prev,
      [`${index}-${itemName}`]: true
    }));
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    if (e.currentTarget) {
      e.currentTarget.style.transform = 'scale(0.98) translateY(-2px)';
      e.currentTarget.style.transition = 'transform 0.1s ease';
    }
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    if (e.currentTarget) {
      setTimeout(() => {
        e.currentTarget.style.transform = isMobile ? 'translateY(0)' : 'translateY(-5px)';
        e.currentTarget.style.transition = 'transform 0.3s ease';
      }, 100);
    }
  };

  const fetchGalleryItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://design.elitedigitals.ae/admin/api/gallery.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setGalleryItems(data.slice(0, 3)); // Get only the first 3 items
        setRetryCount(0);
      } else {
        throw new Error('No gallery data available');
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      setError(error.message);
      // Set empty array on error
      setGalleryItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry function for error handling
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchGalleryItems();
  };

  // Render gallery item with responsive behavior
  const renderGalleryItem = (item, index) => {
    const errorKey = `${index}-${item.name}`;
    const hasError = imageErrors[errorKey];
    
    return (
      <Link 
        to="/gallery" 
        key={item.id} 
        className={`recent-work-item item-${index + 1}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isMobile ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
          ...(isMobile && {
            height: screenWidth <= 480 ? '200px' : '250px',
            marginBottom: '15px'
          }),
          ...(isTablet && {
            height: '280px'
          })
        }}
      >
        {!hasError ? (
          <img 
            src={`https://design.elitedigitals.ae/admin/uploads/gallery/${item.image}`} 
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.3s ease'
            }}
            loading={index === 0 ? 'eager' : 'lazy'}
            onError={() => handleImageError(index, item.name)}
            onLoad={(e) => {
              // Add subtle fade-in effect when image loads
              e.target.style.opacity = '1';
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.transform = 'scale(1)';
              }
            }}
          />
        ) : (
          <div 
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6c757d',
              fontSize: isMobile ? '14px' : '16px',
              textAlign: 'center',
              padding: '20px'
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🖼️</div>
            <div style={{ fontWeight: '500' }}>{item.name}</div>
            <div style={{ fontSize: '0.85em', opacity: '0.7', marginTop: '5px' }}>
              Image not available
            </div>
          </div>
        )}
      </Link>
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="recent-works">
        <div className="container">
          <div className="loading-container">
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error && galleryItems.length === 0) {
    return (
      <div 
        className="recent-works-section"
        style={{
          padding: isMobile 
            ? '40px 0' 
            : isTablet 
            ? '60px 0' 
            : '80px 0',
          minHeight: isMobile ? '300px' : '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          style={{
            textAlign: 'center',
            color: '#666',
            maxWidth: '400px',
            padding: '0 20px'
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⚠️</div>
          <h3 style={{ marginBottom: '10px', fontSize: isMobile ? '18px' : '20px' }}>
            Unable to Load Recent Works
          </h3>
          <p style={{ marginBottom: '20px', fontSize: isMobile ? '14px' : '16px' }}>
            {error}
          </p>
          {retryCount < 3 && (
            <button 
              className="retry-btn"
              onClick={() => {
                setRetryCount(prev => prev + 1);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
            >
              Retry ({retryCount + 1}/3)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="recent-works-section"
      style={{
        padding: isMobile 
          ? '40px 0' 
          : isTablet 
          ? '60px 0' 
          : '80px 0'
      }}
    >
      <div 
        className="recent-works-container"
        style={{
          maxWidth: isMobile ? '95%' : isTablet ? '85%' : '80%',
          padding: isMobile ? '0 10px' : '0'
        }}
      >
        <div 
          className="recent-works-titles"
          style={{
            ...(isMobile && {
              position: 'static',
              transform: 'none',
              marginBottom: '30px',
              zIndex: 'auto'
            }),
            ...(isTablet && {
              marginBottom: '40px'
            })
          }}
        >
          <h3 
            className="recent-works-title-small"
            style={{
              fontSize: isMobile 
                ? '1.5rem' 
                : isTablet 
                ? '2rem' 
                : screenWidth >= 1440 
                ? '2.8rem' 
                : '2.5rem',
              marginBottom: isMobile ? '5px' : '0'
            }}
          >
            Discover Our
          </h3>
          <Link 
            to="/gallery" 
            className="recent-works-title-link"
            style={{
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            <h2 
              className="recent-works-title-large"
              style={{
                fontSize: isMobile 
                  ? '2.8rem' 
                  : isTablet 
                  ? '4rem' 
                  : screenWidth >= 1440 
                  ? '10rem' 
                  : screenWidth >= 1200 
                  ? '9rem' 
                  : '7rem',
                lineHeight: isMobile ? '1.1' : '1.1',
                marginTop: isMobile ? '0' : '0'
              }}
            >
              Recent works
            </h2>
          </Link>
        </div>
        
        <div 
          className="recent-works-grid"
          style={{
            ...(isMobile && {
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              gridTemplateColumns: 'none',
              gridTemplateRows: 'none'
            }),
            ...(isTablet && {
              gridTemplateRows: 'repeat(15, 35px)',
              gap: '15px'
            }),
            position: 'relative'
          }}
        >
          {galleryItems.length > 0 ? (
            galleryItems.map((item, index) => renderGalleryItem(item, index))
          ) : (
            <div 
              style={{
                gridColumn: '1 / -1',
                gridRow: '1 / -1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '300px',
                color: '#666',
                textAlign: 'center',
                fontSize: isMobile ? '16px' : '18px'
              }}
            >
              No recent works available
            </div>
          )}
        </div>

        {/* Mobile-specific enhancement: Works count indicator */}
        {isMobile && galleryItems.length > 0 && (
          <div 
            style={{
              textAlign: 'center',
              marginTop: '30px',
              padding: '10px 20px',
              fontSize: '0.85rem',
              color: '#666',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '20px',
              display: 'inline-block',
              marginLeft: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            Showing {galleryItems.length} Recent Works
          </div>
        )}

        {/* Link to view all works */}
        {!isMobile && galleryItems.length > 0 && (
          <div 
            style={{
              textAlign: 'center',
              marginTop: isTablet ? '40px' : '60px'
            }}
          >
            <Link 
              to="/gallery"
              style={{
                display: 'inline-block',
                padding: isTablet ? '12px 30px' : '15px 40px',
                backgroundColor: 'transparent',
                color: 'var(--primary-color)',
                border: '2px solid var(--primary-color)',
                borderRadius: '30px',
                textDecoration: 'none',
                fontSize: isTablet ? '14px' : '16px',
                fontWeight: '500',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--primary-color)';
              }}
            >
              View All Works
            </Link>
          </div>
        )}
      </div>
      
      {/* Add CSS animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RecentWorks; 