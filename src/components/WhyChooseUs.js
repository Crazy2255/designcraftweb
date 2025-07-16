import React, { useState, useEffect, useCallback } from 'react';
import '../assets/css/WhyChooseUs.css';

// Import icons
import competitivePricing from '../assets/images/icons/3dvisualization.svg';
import certifiedExperts from '../assets/images/icons/consulting.svg';
import easyFinancing from '../assets/images/icons/customization.svg';
import satisfaction from '../assets/images/icons/warranty.svg';

const WhyChooseUs = () => {
  // Add responsive state management
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

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

  // Handle image loading errors
  const handleImageError = (featureName) => {
    setImageErrors(prev => ({
      ...prev,
      [featureName]: true
    }));
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    e.currentTarget.style.transform = 'scale(0.98)';
    e.currentTarget.style.transition = 'transform 0.1s ease';
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    setTimeout(() => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.transition = 'transform 0.3s ease';
    }, 100);
  };

  // Feature data with responsive content
  const features = [
    {
      id: 'competitive-pricing',
      icon: competitivePricing,
      title: 'Competitive Pricing',
      description: isMobile 
        ? 'Quality without breaking the bank—fair and competitive pricing.'
        : 'Experience quality without breaking the bank—we offer fair and competitive pricing.',
      alt: 'Competitive Pricing'
    },
    {
      id: 'certified-experts',
      icon: certifiedExperts,
      title: 'Certified Experts',
      description: isMobile
        ? 'Proven excellence backed by certified professionals.'
        : 'Choose Razor for proven excellence backed by certified professionals.',
      alt: 'Certified Experts'
    },
    {
      id: 'easy-financing',
      icon: easyFinancing,
      title: 'Easy Financing',
      description: isMobile
        ? 'Hassle-free financing options available.'
        : 'Don\'t let budget constraints stop you—explore our hassle-free financing options.',
      alt: 'Easy Financing'
    },
    {
      id: 'satisfaction',
      icon: satisfaction,
      title: '100% Satisfaction',
      description: isMobile
        ? 'See what our customers say about us.'
        : 'Don\'t just take our word for it—see what Homeowners of Saskatoon say about Razor.',
      alt: '100% Satisfaction'
    }
  ];

  // Split features for left and right columns
  const leftFeatures = features.slice(0, 2);
  const rightFeatures = features.slice(2, 4);

  // Render feature item with responsive behavior
  const renderFeatureItem = (feature, index) => (
    <div 
      key={feature.id}
      className="feature-item"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        cursor: isMobile ? 'pointer' : 'default',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div className="feature-icon">
        {!imageErrors[feature.id] ? (
          <img
            src={feature.icon}
            alt={feature.alt}
            onError={() => handleImageError(feature.id)}
            style={{
              filter: isMobile ? 'none' : 'none',
              transition: 'all 0.3s ease'
            }}
            loading={index < 2 ? 'eager' : 'lazy'}
          />
        ) : (
          <div 
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: '#666'
            }}
          >
            ✓
          </div>
        )}
      </div>
      <h3 
        className="feature-title"
        style={{
          fontSize: isMobile ? '1.3rem' : isTablet ? '1.4rem' : '1.5rem',
          lineHeight: '1.2'
        }}
      >
        {feature.title}
      </h3>
      <p 
        className="feature-description"
        style={{
          fontSize: isMobile ? '0.9rem' : isTablet ? '0.95rem' : '1rem',
          lineHeight: isMobile ? '1.5' : '1.6'
        }}
      >
        {feature.description}
      </p>
    </div>
  );

  return (
    <div 
      className="why-choose-us-section"
      style={{
        padding: isMobile 
          ? '40px 15px' 
          : isTablet 
          ? '60px 20px' 
          : '80px 20px'
      }}
    >
      <div 
        className="section-header"
        style={{
          marginBottom: isMobile ? '40px' : isTablet ? '50px' : '60px'
        }}
      >
        <h2 
          className="why-choose-us-title"
          style={{
            fontSize: isMobile 
              ? '2rem' 
              : isTablet 
              ? '3rem' 
              : screenWidth >= 1440 
              ? '4.5rem' 
              : '4rem',
            lineHeight: '1.1',
            marginBottom: isMobile ? '15px' : '20px'
          }}
        >
          Why Choose Us
        </h2>
        <p 
          className="section-description"
          style={{
            fontSize: isMobile 
              ? '16px' 
              : isTablet 
              ? '17px' 
              : '18px',
            maxWidth: isMobile 
              ? '100%' 
              : isTablet 
              ? '600px' 
              : '800px',
            padding: isMobile ? '0 10px' : '0'
          }}
        >
          {isMobile 
            ? 'Discover what our customers are saying. Real stories, real experiences.'
            : 'Discover what our customers are saying about us. Real stories, real experiences — find out why they choose us.'
          }
        </p>
      </div>

      <div 
        className="features-container"
        style={{
          maxWidth: isMobile ? '100%' : isTablet ? '90%' : '80%',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '20px' : '0'
        }}
      >
        {isMobile ? (
          // Mobile: Single column layout
          <div style={{ width: '100%' }}>
            {features.map((feature, index) => renderFeatureItem(feature, index))}
          </div>
        ) : (
          // Tablet and Desktop: Two column layout
          <>
            <div 
              className="left-features"
              style={{
                maxWidth: isTablet ? '48%' : '45%'
              }}
            >
              {leftFeatures.map((feature, index) => renderFeatureItem(feature, index))}
            </div>

            <div 
              className="right-features"
              style={{
                maxWidth: isTablet ? '48%' : '45%'
              }}
            >
              {rightFeatures.map((feature, index) => renderFeatureItem(feature, index + 2))}
            </div>
          </>
        )}
      </div>

      {/* Mobile-specific enhancement: Feature count indicator */}
      {isMobile && (
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
          {features.length} Key Features
        </div>
      )}
    </div>
  );
};

export default WhyChooseUs; 