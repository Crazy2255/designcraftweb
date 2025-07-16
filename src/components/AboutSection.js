import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/css/AboutSection.css';
import aboutImage from '../assets/images/about/about.png';

// Import static logo images
import logo1 from '../assets/images/mat-logo/1.png';
import logo2 from '../assets/images/mat-logo/1.png';
import logo3 from '../assets/images/mat-logo/1.png';
import logo4 from '../assets/images/mat-logo/1.png';

const AboutSection = () => {
  const [screenWidth, setScreenWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const staticLogos = [
    { id: 1, image: logo1, name: 'Partner Logo 1' },
    { id: 2, image: logo2, name: 'Partner Logo 2' },
    { id: 3, image: logo3, name: 'Partner Logo 3' },
    { id: 4, image: logo4, name: 'Partner Logo 4' }
  ];

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

  // Responsive slider settings
  const getSliderSettings = () => {
    const baseSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      autoplay: true,
      autoplaySpeed: 3000,
      arrows: false,
      pauseOnHover: true,
      swipeToSlide: true,
      touchMove: true,
      accessibility: true,
      focusOnSelect: false
    };

    if (screenWidth >= 1200) {
      return {
        ...baseSettings,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: false
      };
    } else if (screenWidth >= 992) {
      return {
        ...baseSettings,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplaySpeed: 4000
      };
    } else if (screenWidth >= 768) {
      return {
        ...baseSettings,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplaySpeed: 3500
      };
    } else if (screenWidth >= 480) {
      return {
        ...baseSettings,
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplaySpeed: 3000
      };
    } else {
      return {
        ...baseSettings,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 2500,
        centerMode: true,
        centerPadding: '20%'
      };
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    console.warn('About image failed to load');
    e.target.style.opacity = '0.5';
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    e.currentTarget.classList.add('touching');
  };

  const handleTouchEnd = (e) => {
    if (!isMobile) return;
    setTimeout(() => {
      e.currentTarget.classList.remove('touching');
    }, 150);
  };

  return (
    <div className={`about-section ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      <div className="about-container">
        <div className="about-image">
          <div className="image-wrapper">
            <img 
              src={aboutImage} 
              alt="Design Craft Office Space"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className={imageLoaded ? 'loaded' : 'loading'}
              loading="lazy"
            />
            {!imageLoaded && (
              <div className="image-placeholder">
                <div className="loading-container">
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="about-content">
          <h2 className="about-title">
            {isMobile ? 'About Us' : 'About US'}
          </h2>
          
          <div className="about-text-container">
            <p className="about-text">
              At DesignCraft Company, our story is one of passion, craftsmanship, and a relentless
              pursuit of excellence. It all began with a desire to redefine the way people experience
              furniture – not just as functional pieces, but as expressions of personal style and comfort in everyday life.
            </p>
            
            {!isMobile && (
              <p className="about-text">
                Our journey to create furniture that resonates with elegance and quality has led us to curate a
                collection with a story of meticulous attention to detail, from the selection
                of premium materials to the precision of craftsmanship.
              </p>
            )}
            
            {isMobile && (
              <p className="about-text mobile-summary">
                We create furniture that combines elegance, quality, and meticulous craftsmanship for your everyday comfort.
              </p>
            )}
          </div>
          
          <div className="know-more-btn">
            <Link 
              to="/about"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="know-more-link"
            >
              {isMobile ? 'Learn More' : 'Know More'}
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="arrow-icon"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="logo-slider-section">
        <div className="logo-slider-container">
          <Slider {...getSliderSettings()}>
            {staticLogos.map((logo, index) => (
              <div key={logo.id} className="logo-slide">
                <div 
                  className="logo-wrapper"
                  style={{
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <img
                    src={logo.image}
                    alt={logo.name}
                    className="logo-image"
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
        
        {/* Logo count indicator for mobile */}
        {isMobile && (
          <div className="logo-count">
            <span>{staticLogos.length} Trusted Partners</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutSection; 