import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';
import '../assets/css/Gallery.css';

const Gallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeFilter, setActiveFilter] = useState('Show All');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://157.175.147.228/admin/api/gallery.php');
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setGalleryItems(data);
        // Extract unique categories from gallery items
        const uniqueCategories = [...new Set(data.map(item => item.name))].sort((a, b) => a.localeCompare(b));
        setCategories(['Show All', ...uniqueCategories]);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = activeFilter === 'Show All'
    ? galleryItems
    : galleryItems.filter(item => item.name === activeFilter);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const breadcrumbsConfig = {
    title: "Recent Works",
    links: [
      { text: "Home", url: "/" },
      { text: "Recent Works", url: "/gallery" }
    ]
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container">
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      <Breadcrumbs {...breadcrumbsConfig} />

      <div className="gallery-section">
        <div className="gallery-header">
          <h1>Gallery</h1>
          <p>Professional Design Agency to provide solutions</p>
        </div>

        {/* Filter Buttons */}
        <div className="gallery-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
              data-category={category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-container">
          <div className="gallery-grid">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="gallery-item"
                onClick={() => openLightbox(item)}
              >
                <div className="gallery-item-inner">
                  <img 
                    src={`http://157.175.147.228/admin/uploads/gallery/${item.image}`} 
                    alt={item.name}
                    loading="lazy"
                  />
                  <div className="gallery-item-overlay">
                    <div className="gallery-item-content">
                      <div className="view-icon">
                        <FaEye size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={`http://157.175.147.228/admin/uploads/gallery/${selectedImage.image}`} 
              alt={selectedImage.name} 
            />
            <div className="lightbox-details">
              <h3>{selectedImage.name}</h3>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Gallery; 