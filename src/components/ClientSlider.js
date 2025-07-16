import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/ClientSlider.css';

// Keep the default images as fallback
import client1 from '../assets/images/clients/1.png';
import client2 from '../assets/images/clients/2.png';
import client3 from '../assets/images/clients/3.png';
import client4 from '../assets/images/clients/4.png';
import client5 from '../assets/images/clients/5.png';
import client6 from '../assets/images/clients/6.jpg';

const defaultClients = [
  { img: client1, name: 'Dubai Ports' },
  { img: client2, name: 'Majid Al Futtaim' },
  { img: client3, name: 'DIFC' },
  { img: client4, name: 'Johnson & Johnson' },
  { img: client5, name: 'RTA' },
  { img: client6, name: 'Sony' }
];

const ClientSlider = () => {
  const [clients, setClients] = useState(defaultClients);
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
    fetchClients();
  }, []);

  // Handle image loading errors
  const handleImageError = (index, clientName) => {
    setImageErrors(prev => ({
      ...prev,
      [`${index}-${clientName}`]: true
    }));
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    e.currentTarget.style.transform = 'scale(0.95)';
    e.currentTarget.style.transition = 'transform 0.1s ease';
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    setTimeout(() => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.transition = 'transform 0.3s ease';
    }, 100);
  };

  // Get responsive grid columns
  const getGridColumns = () => {
    if (screenWidth <= 480) return 2; // Mobile small
    if (screenWidth <= 767) return 2; // Mobile
    if (screenWidth <= 992) return 3; // Tablet
    if (screenWidth <= 1200) return 4; // Small desktop
    return 5; // Desktop
  };

  // Get responsive grid gap
  const getGridGap = () => {
    if (screenWidth <= 480) return '20px 10px';
    if (screenWidth <= 767) return '25px 15px';
    if (screenWidth <= 992) return '30px 20px';
    if (screenWidth <= 1200) return '35px 25px';
    return '40px 30px';
  };

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('https://design.elitedigitals.ae/admin/api/clients.php');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const formattedClients = data.map(client => ({
          img: `https://design.elitedigitals.ae/admin/uploads/clients/${client.image}`,
          name: client.name
        }));
        setClients(formattedClients);
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setError(error.message);
      // Keep using default clients on error
      setClients(defaultClients);
    } finally {
      setIsLoading(false);
    }
  };

  // Retry function for error handling
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    fetchClients();
  };

  // Render client logo with responsive behavior
  const renderClientLogo = (client, index) => {
    const errorKey = `${index}-${client.name}`;
    const hasError = imageErrors[errorKey];
    
    return (
      <div 
        key={`${client.name}-${index}`}
        className="client-logo"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          cursor: isMobile ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
          padding: isMobile ? '8px' : isTablet ? '10px' : '12px',
          minHeight: isMobile ? '60px' : isTablet ? '70px' : '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!hasError ? (
          <img 
            src={client.img} 
            alt={client.name}
            style={{
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain',
              filter: 'grayscale(100%)',
              opacity: '0.7',
              transition: 'all 0.3s ease',
              maxHeight: '100%'
            }}
            loading={index < 4 ? 'eager' : 'lazy'}
            onError={(e) => {
              // If image fails to load, try to use the corresponding default image
              const defaultClient = defaultClients[index];
              if (defaultClient && e.target.src !== defaultClient.img) {
                e.target.src = defaultClient.img;
              } else {
                handleImageError(index, client.name);
              }
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.target.style.filter = 'grayscale(0%)';
                e.target.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.target.style.filter = 'grayscale(100%)';
                e.target.style.opacity = '0.7';
              }
            }}
          />
        ) : (
          <div 
            style={{
              width: isMobile ? '60px' : isTablet ? '70px' : '80px',
              height: isMobile ? '40px' : isTablet ? '50px' : '60px',
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: isMobile ? '12px' : '14px',
              color: '#666',
              fontWeight: '500',
              textAlign: 'center',
              padding: '5px'
            }}
          >
            {client.name}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="client-slider">
        <div className="container">
          <div className="loading-container">
          </div>
        </div>
      </section>
    );
  }

  return (
    <div 
      className="clients-section"
      style={{
        padding: isMobile 
          ? '40px 0' 
          : isTablet 
          ? '60px 0' 
          : '80px 0'
      }}
    >
      <div 
        className="clients-container"
        style={{
          padding: isMobile ? '0 15px' : '0 20px',
          maxWidth: isMobile ? '100%' : isTablet ? '1000px' : '1200px'
        }}
      >
        <div 
          className="section-header"
          style={{
            marginBottom: isMobile ? '30px' : isTablet ? '40px' : '60px',
            maxWidth: isMobile ? '100%' : isTablet ? '600px' : '800px'
          }}
        >
          <h2 
            className="clients-title"
            style={{
              fontSize: isMobile 
                ? '2rem' 
                : isTablet 
                ? '3rem' 
                : screenWidth >= 1440 
                ? '4.5rem' 
                : '4rem',
              marginBottom: isMobile ? '15px' : '20px',
              lineHeight: '1.1'
            }}
          >
            Our Clients
          </h2>
          <p 
            className="section-subtitle"
            style={{
              fontSize: isMobile ? '14px' : isTablet ? '15px' : '16px',
              padding: isMobile ? '0 10px' : '0'
            }}
          >
            {isMobile 
              ? 'Discover what our customers are saying. Real stories, real experiences.'
              : 'Discover what our customers are saying about us. Real stories, real experiences – find out why they choose us.'
            }
          </p>
          {error && retryCount < 3 && (
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
        
        <div 
          className="clients-grid"
          style={{
            gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
            gap: getGridGap(),
            maxWidth: isMobile ? '100%' : isTablet ? '900px' : '1100px'
          }}
        >
          {clients.map((client, index) => renderClientLogo(client, index))}
        </div>

        {/* Mobile-specific enhancement: Client count indicator */}
        {isMobile && clients.length > 0 && (
          <div 
            style={{
              textAlign: 'center',
              marginTop: '30px',
              padding: '10px',
              fontSize: '0.85rem',
              color: '#666',
              background: 'rgba(0,0,0,0.05)',
              borderRadius: '20px',
              display: 'inline-block',
              marginLeft: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            {clients.length} Trusted Partners
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

export default ClientSlider; 