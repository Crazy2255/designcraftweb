import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import '../assets/css/DesignIdeas.css';

const DesignIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lightbox, setLightbox] = useState({
    isOpen: false,
    slides: [],
    index: 0
  });

  // Fallback image
  const fallbackImage = require('../assets/images/no-image.png');

  const getImageUrl = (filename) => {
    if (!filename) return null;
    return `http://157.175.147.228/admin/uploads/design-ideas/${filename}`;
  };

  const processWorkImages = (workImages) => {
    if (!workImages) return [];
    
    // If it's already an array
    if (Array.isArray(workImages)) {
      return workImages.map(img => getImageUrl(img));
    }
    
    // If it's a string, try to parse it as JSON first
    try {
      const parsed = JSON.parse(workImages);
      if (Array.isArray(parsed)) {
        return parsed.map(img => getImageUrl(img));
      }
    } catch (e) {
      // If JSON parsing fails, try comma split
      if (typeof workImages === 'string') {
        return workImages.split(',').map(img => getImageUrl(img.trim()));
      }
    }
    
    return [];
  };

  useEffect(() => {
    const fetchDesignIdeas = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://157.175.147.228/admin/api/design_ideas.php');
        
        if (!response.ok) {
          throw new Error('Failed to fetch design ideas');
        }

        const data = await response.json();
        
        if (data.success && Array.isArray(data.data)) {
          const processedData = data.data.map(idea => {
            console.log('Processing idea:', idea);
            return {
              ...idea,
              main_image_url: getImageUrl(idea.main_image),
              work_image_urls: processWorkImages(idea.work_images)
            };
          });
          setIdeas(processedData);
        } else {
          throw new Error(data.message || 'Failed to load design ideas');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDesignIdeas();
  }, []);

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const openLightbox = (idea, startIndex = 0) => {
    const allImages = [
      idea.main_image_url,
      ...idea.work_image_urls
    ].filter(Boolean);

    const slides = allImages.map(url => ({
      src: url,
      alt: `${idea.name} Project Image`
    }));

    setLightbox({
      isOpen: true,
      slides,
      index: startIndex
    });
  };

  const breadcrumbsConfig = {
    title: "Design Ideas",
    links: [
      { text: "Home", url: "/" },
      { text: "Design Ideas", url: "/design-ideas" }
    ]
  };

  if (loading) return (
    <main className="main-content">
      <Breadcrumbs {...breadcrumbsConfig} />
      <div className="loading-container">
      </div>
    </main>
  );
  
  if (error) return (
    <>
      <Breadcrumbs {...breadcrumbsConfig} />
      <div className="error-container">
        <div className="error">Error: {error}</div>
      </div>
    </>
  );

  if (!ideas.length) return (
    <>
      <Breadcrumbs {...breadcrumbsConfig} />
      <div className="no-data-container">
        <div className="no-data">No design ideas available.</div>
      </div>
    </>
  );

  return (
    <>
      <Breadcrumbs {...breadcrumbsConfig} />

      <div className="design-ideas-container">
        <h1 className="design-ideas-main-title">Design Ideas</h1>
        <div className="design-ideas-wrapper">
          {ideas.map((idea) => (
            <div key={idea.id} className="design-idea-card">
              <h2 className="design-idea-title">{idea.name}</h2>
              <div className="design-idea-row">
                {/* Left Side Images */}
                <div className="design-idea-left-column">
                  <div 
                    className="main-image-wrapper"
                    onClick={() => openLightbox(idea, 0)}
                  >
                    <img 
                      src={idea.main_image_url || fallbackImage}
                      alt={idea.name}
                      className="design-idea-main-image"
                      onError={handleImageError}
                    />
                    <div className="image-overlay">
                      <span>View Image</span>
                    </div>
                  </div>
                </div>

                {/* Right Side Images */}
                <div className="design-idea-right-column">
                  {idea.work_image_urls.length > 0 ? (
                    <>
                      <div className="work-images-grid">
                        {idea.work_image_urls.slice(0, 4).map((imageUrl, index) => (
                          <div 
                            key={index} 
                            className="work-image-preview"
                            onClick={() => openLightbox(idea, index + 1)}
                          >
                            <img 
                              src={imageUrl}
                              alt={`${idea.name} - Work Image ${index + 1}`}
                              onError={handleImageError}
                            />
                            <div className="image-overlay">
                              <span>View</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      {idea.work_image_urls.length > 4 && (
                        <div className="more-images-count">
                          +{idea.work_image_urls.length - 4} more
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-work-images">
                      No additional images
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={lightbox.isOpen}
        close={() => setLightbox({ ...lightbox, isOpen: false })}
        slides={lightbox.slides}
        index={lightbox.index}
      />
    </>
  );
};

export default DesignIdeas; 