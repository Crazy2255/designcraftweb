import React, { useState, useEffect } from 'react';
import '../assets/css/Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://157.175.147.228/admin/api/testimonials.php');
      const data = await response.json();
      if (data && Array.isArray(data)) {
        const formattedTestimonials = data.map(item => ({
          id: item.id,
          text: item.message,
          author: item.person_name,
          position: item.designation
        }));
        setTestimonials(formattedTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : testimonials.length - 1));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Navigate to next slide
  const nextSlide = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex < testimonials.length - 1 ? prevIndex + 1 : 0));
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Auto-advance slides (paused for now)
  /*
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);
  */

  return (
    <div className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-title">Testimonial</h2>
        <p className="testimonials-subtitle">
          Discover what our customers are saying about us. Real stories, real experiences – 
          find out why they choose us.
        </p>
        
        <div className="testimonials-slider">
          <button 
            className="slider-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <div className="slider-content">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={`testimonial-slide ${index === currentIndex ? 'active' : ''}`}
                style={{ 
                  position: 'absolute', 
                  opacity: index === currentIndex ? 1 : 0,
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
                }}
              >
                <p className="testimonial-text">{testimonial.text}</p>
                <h3 className="testimonial-author">{testimonial.author}</h3>
                <p className="testimonial-position">{testimonial.position}</p>
              </div>
            ))}
          </div>
          
          <button 
            className="slider-btn next-btn" 
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        
        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <div 
              key={index} 
              className={`indicator ${index === currentIndex ? 'active' : ''}`} 
              onClick={() => {}}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials; 