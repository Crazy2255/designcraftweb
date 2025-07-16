import React, { useState, useRef, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../assets/css/HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenWidth, setScreenWidth] = useState(0);
  const sliderRef = useRef(null);
  
  useEffect(() => {
    fetchHeroData();
    handleResize();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleResize = () => {
    const width = window.innerWidth;
    setScreenWidth(width);
    setIsMobile(width <= 767);
    setIsTablet(width >= 768 && width <= 991);
  };

  const handleOrientationChange = () => {
    setTimeout(() => {
      handleResize();
      if (sliderRef.current) {
        sliderRef.current.slickGoTo(currentSlide);
      }
    }, 100);
  };

  const fetchHeroData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching hero data...');
      
      const response = await fetch('https://design.elitedigitals.ae/admin/api/hero-sections.php');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched data:', data);
      
      const activeSlides = data.filter(item => item.status === 'active');
      console.log('Active slides:', activeSlides);
      
      setHeroData(activeSlides);
    } catch (error) {
      console.error('Error fetching hero data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Responsive slider settings based on screen size
  const getSliderSettings = () => {
    const baseSettings = {
      dots: false,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      beforeChange: (current, next) => setCurrentSlide(next),
      responsive: [
        {
          breakpoint: 1440,
          settings: {
            speed: 700,
            autoplay: true,
            autoplaySpeed: 6000,
            pauseOnHover: true,
            pauseOnFocus: true,
          }
        },
        {
          breakpoint: 1199,
          settings: {
            speed: 600,
            autoplay: true,
            autoplaySpeed: 5500,
            pauseOnHover: true,
            pauseOnFocus: true,
          }
        },
        {
          breakpoint: 991,
          settings: {
            speed: 500,
            autoplay: true,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            pauseOnFocus: true,
            touchThreshold: 5,
          }
        },
        {
          breakpoint: 767,
          settings: {
            speed: 400,
            autoplay: true,
            autoplaySpeed: 4500,
            pauseOnHover: false,
            pauseOnFocus: false,
            touchThreshold: 3,
            swipe: true,
            touchMove: true,
            draggable: true,
          }
        },
        {
          breakpoint: 479,
          settings: {
            speed: 300,
            autoplay: true,
            autoplaySpeed: 4000,
            pauseOnHover: false,
            pauseOnFocus: false,
            touchThreshold: 2,
            swipe: true,
            touchMove: true,
            draggable: true,
            adaptiveHeight: true,
          }
        }
      ]
    };

    // Default settings for larger screens
    if (screenWidth > 1440) {
      return {
        ...baseSettings,
        speed: 700,
        autoplay: true,
        autoplaySpeed: 6000,
        pauseOnHover: true,
        pauseOnFocus: true,
      };
    }

    return baseSettings;
  };

  const goToPrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const handleImageLoad = (e) => {
    e.target.style.opacity = '1';
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/1920x1080/ff8545/ffffff?text=Image+Not+Found';
  };

  // Touch gesture handlers for mobile devices
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    sliderRef.current.touchStartX = touch.clientX;
    sliderRef.current.touchStartY = touch.clientY;
  };

  const handleTouchEnd = (e) => {
    if (!isMobile || !sliderRef.current.touchStartX) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - sliderRef.current.touchStartX;
    const deltaY = touch.clientY - sliderRef.current.touchStartY;
    
    // Only trigger slide change if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    }
    
    sliderRef.current.touchStartX = null;
    sliderRef.current.touchStartY = null;
  };

  if (isLoading) {
    return (
      <div className="hero-slider">
        <div className="loading-container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '600px'
        }}>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error in hero slider:', error);
    return null;
  }

  if (heroData.length === 0) {
    console.log('No hero data available');
    return null;
  }

  return (
    <div 
      className="hero-slider-wrapper"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="hero-slider-container">
        <Slider ref={sliderRef} {...getSliderSettings()}>
          {heroData.map((slide, index) => (
            <div className="slide" key={slide.id}>
              <div className="slide-background">
                <img 
                  src={`https://design.elitedigitals.ae/admin/uploads/hero/${slide.banner_image}`} 
                  alt={slide.name} 
                  className="slide-image"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading="lazy"
                  style={{ 
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                />
                <div className="slide-overlay"></div>
              </div>
              <div className="slide-content">
                <div className="content-wrapper">
                  {/* Content can be dynamically shown based on screen size */}
                  {!isMobile && (
                    <>
                      <h1 className="main-heading">
                        {slide.name.split('.').map((part, i) => (
                          <span key={i} className="heading-part">
                            {part.trim()}{i < slide.name.split('.').length - 1 ? '.' : ''}
                          </span>
                        ))}
                      </h1>
                      <p className="description">{slide.description}</p>
                      <div className="cta-buttons">
                        <button 
                          className="start-browsing"
                          onClick={() => window.location.href = '/gallery'}
                        >
                          Start browsing
                        </button>
                        <button 
                          className="learn-more"
                          onClick={() => window.location.href = '/about'}
                        >
                          What is {slide.name.split('.')[0]}?
                        </button>
                      </div>
                    </>
                  )}
                  
                  {/* Simplified content for mobile */}
                  {isMobile && (
                    <>
                      <h1 className="main-heading">
                        {slide.name.split('.')[0]}
                      </h1>
                      <p className="description">
                        {slide.description.length > 100 
                          ? slide.description.substring(0, 100) + '...' 
                          : slide.description
                        }
                      </p>
                      <div className="cta-buttons">
                        <button 
                          className="start-browsing"
                          onClick={() => window.location.href = '/gallery'}
                        >
                          Browse
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Navigation - hidden on very small screens */}
      {screenWidth > 320 && (
        <div className="slider-navigation">
          <div className="nav-container">
            <span 
              className="nav-arrow" 
              onClick={goToPrev}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && goToPrev()}
            >
              ←
            </span>
            <span className="slide-number">
              {currentSlide + 1}/{heroData.length}
            </span>
            <span 
              className="nav-arrow" 
              onClick={goToNext}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && goToNext()}
            >
              →
            </span>
          </div>
        </div>
      )}
      
      {/* Progress indicator for mobile */}
      {isMobile && (
        <div className="mobile-progress" style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          zIndex: 4
        }}>
          {heroData.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: index === currentSlide ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => sliderRef.current?.slickGoTo(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider; 