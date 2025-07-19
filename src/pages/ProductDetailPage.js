import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import '../assets/css/ProductDetail.css';
import '../assets/css/ProductFinishes.css';
import '../assets/css/ProductTabs.css';
import '../assets/css/RelatedProducts.css';
import EnquiryForm from '../components/EnquiryForm';

// Import product images
import mainImg1 from '../assets/images/inner/1.JPG';
import mainImg2 from '../assets/images/inner/2.JPG';
import mainImg3 from '../assets/images/inner/3.JPG';
import mainImg4 from '../assets/images/inner/4.jpg';

// Import wooden finish images
import wood1 from '../assets/images/wooden/1.png';
import wood2 from '../assets/images/wooden/2.png';
import wood3 from '../assets/images/wooden/3.png';
import wood4 from '../assets/images/wooden/4.png';
import wood5 from '../assets/images/wooden/5.png';
import wood6 from '../assets/images/wooden/6.png';
import wood7 from '../assets/images/wooden/7.png';
import wood8 from '../assets/images/wooden/8.png';
import wood9 from '../assets/images/wooden/9.png';

// Import related product images
import relatedProduct1 from '../assets/images/products/1.JPG';
import relatedProduct2 from '../assets/images/products/2.JPG';
import relatedProduct3 from '../assets/images/products/3.JPG';
import relatedProduct4 from '../assets/images/products/4.jpg';
import relatedProduct5 from '../assets/images/products/5.png';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('wooden');
  const [activeDetailTab, setActiveDetailTab] = useState('description');
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  
  // Product images
  const images = [mainImg1, mainImg2, mainImg3, mainImg4];
  
  // Product finishes data
  const finishesData = {
    sizes: [
      { id: 1, image: wood1, name: 'Standard (160x80cm)' },
      { id: 2, image: wood2, name: 'Large (180x90cm)' },
      { id: 3, image: wood3, name: 'Executive (200x100cm)' },
      { id: 4, image: wood4, name: 'Custom Size' }
    ],
    materials: [
      { id: 1, image: wood5, name: 'Egger German Board' },
      { id: 2, image: wood6, name: 'MDF Board' },
      { id: 3, image: wood7, name: 'Particle Board' },
      { id: 4, image: wood8, name: 'Solid Wood' }
    ],
    wooden: [
      { id: 1, image: wood1, name: 'Natural Davos Oak' },
      { id: 2, image: wood2, name: 'Shorewood' },
      { id: 3, image: wood3, name: 'Pacific Walnut' },
      { id: 4, image: wood4, name: 'Truffle Brown Davos Oak' },
      { id: 5, image: wood5, name: 'Natural Dijon Walnut' },
      { id: 6, image: wood6, name: 'Lincoln Walnut' },
      { id: 7, image: wood7, name: 'Grey Brown Whitriver Oak' },
      { id: 8, image: wood8, name: 'Dark Hunton Oak' },
      { id: 9, image: wood9, name: 'Cognac Kendal Oak' }
    ],
    solid: [
      { id: 1, image: wood1, name: 'Pure White' },
      { id: 2, image: wood2, name: 'Cashmere' },
      { id: 3, image: wood3, name: 'Light Grey' },
      { id: 4, image: wood4, name: 'Dust Grey' },
      { id: 5, image: wood5, name: 'Stone Grey' },
      { id: 6, image: wood6, name: 'Black' }
    ],
    marble: [
      { id: 1, image: wood7, name: 'Carrara Marble' },
      { id: 2, image: wood8, name: 'Black Marble' },
      { id: 3, image: wood9, name: 'Emperador' },
      { id: 4, image: wood1, name: 'Calacatta Gold' }
    ]
  };
  
  // Slider state
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://157.175.147.228/admin/api/products.php?id=${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        
        // Set the product data directly since the API now returns properly structured data
        setProduct(data);
        
        if (data.images && data.images.length > 0) {
          setMainImage(`http://157.175.147.228/admin/uploads/products/${data.images[0]}`);
        }

        // Fetch related products
        const relatedResponse = await fetch(`http://157.175.147.228/admin/api/products.php?subcategory=${data.subcategory_name}`);
        const relatedData = await relatedResponse.json();
        // Filter out current product and limit to 5 items
        const filteredRelated = relatedData
          .filter(item => item.id !== data.id)
          .slice(0, 5);
        setRelatedProducts(filteredRelated);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  // Handle thumbnail click
  const handleThumbnailClick = (img, index) => {
    setMainImage(`http://157.175.147.228/admin/uploads/products/${img}`);
    setActiveIndex(index);
  };

  // Handle tab click
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  
  // Handle detail tab click
  const handleDetailTabClick = (tabName) => {
    setActiveDetailTab(tabName);
  };

  // Handle slider navigation
  const handleSlideChange = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;
    
    const windowWidth = window.innerWidth;
    let visibleItems = 3;
    
    if (windowWidth <= 576) {
      visibleItems = 1;
    } else if (windowWidth <= 768) {
      visibleItems = 2;
    }
    
    const itemWidth = slider.firstChild.offsetWidth + 20;
    const maxSlide = relatedProducts.length - visibleItems;
    
    let newSlide;
    if (direction === 'next') {
      newSlide = currentSlide + 1 > maxSlide ? maxSlide : currentSlide + 1;
    } else {
      newSlide = currentSlide - 1 < 0 ? 0 : currentSlide - 1;
    }
    
    setCurrentSlide(newSlide);
    slider.style.transform = `translateX(-${newSlide * itemWidth}px)`;
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (sliderRef.current) {
        setCurrentSlide(0);
        sliderRef.current.style.transform = 'translateX(0)';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEnquiryClick = () => {
    setIsEnquiryOpen(true);
  };

  const handleEnquiryClose = () => {
    setIsEnquiryOpen(false);
  };

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container">
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-message">
          {error || 'Product not found'}
          <Link to="/" className="back-link">Return to Home</Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareTitle = encodeURIComponent(product.name);

  return (
    <div className="product-detail-page">
     
      
      <div className="product-detail-container">
        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={mainImage} alt={product.name} />
            </div>
            <div className="thumbnail-container">
              {product.images.map((img, index) => (
                <div 
                  key={index} 
                  className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(img, index)}
                >
                  <img 
                    src={`http://157.175.147.228/admin/uploads/products/${img}`} 
                    alt={`${product.name} - View ${index + 1}`} 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <span className="product-category">
              Category: <Link to={`/collection/${product.category_name.toLowerCase()}`}>
                <strong>{product.category_name}</strong>
              </Link>
            </span>
            <span className="subcategory">
              <span className="label">Subcategory:</span> <strong>{product.subcategory_name}</strong>
            </span>
            <br />
            <span className="product-sku">
              <span className="label">SKU:</span> <strong>{product.sku}</strong>
            </span>

            <div className="product-description" 
                 dangerouslySetInnerHTML={{ __html: product.description }} />
            <button className="enquiry-button" onClick={handleEnquiryClick}>
              ENQUIRY NOW
            </button>
            
            <div className="social-share">
              <div className="share-title">Share On :</div>
              <div className="social-icons">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaFacebookF /></a>
                <a href={`https://www.instagram.com/`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaInstagram /></a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaLinkedinIn /></a>
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaTwitter /></a>
                <a href={`https://api.whatsapp.com/send?text=${shareTitle}%20-%20${shareUrl}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaWhatsapp /></a>
                <a href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noopener noreferrer" className="social-icon"><FaTelegram /></a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Finishes Section */}
        <div className="product-finishes-section">
          <h2 className="finishes-title">Available Finishes & Options</h2>
          
          {/* Tabs Navigation */}
          <div className="finishes-tabs">
            {product?.materials?.length > 0 && (
              <button 
                className={`tab-button ${activeTab === 'materials' ? 'active' : ''}`}
                onClick={() => handleTabClick('materials')}
              >
                Materials
              </button>
            )}
            {product?.wooden?.length > 0 && (
              <button 
                className={`tab-button ${activeTab === 'wooden' ? 'active' : ''}`}
                onClick={() => handleTabClick('wooden')}
              >
                Wooden Finishes
              </button>
            )}
            {product?.colors?.length > 0 && (
              <button 
                className={`tab-button ${activeTab === 'colors' ? 'active' : ''}`}
                onClick={() => handleTabClick('colors')}
              >
                Colors
              </button>
            )}
            {product?.marbles?.length > 0 && (
              <button 
                className={`tab-button ${activeTab === 'marble' ? 'active' : ''}`}
                onClick={() => handleTabClick('marble')}
              >
                Marble/Stone Finishes
              </button>
            )}
          </div>
          
          {/* Tab Contents */}
          <div className={`tab-content ${activeTab === 'materials' ? 'active' : ''}`}>
            <div className="finishes-grid">
              {product?.materials?.map((material, index) => (
                <div className="finish-item" key={index}>
                  <div className="finish-image">
                    <img 
                      src={`http://157.175.147.228/admin/uploads/materials/${material.image}`}
                      alt={material.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </div>
                  <span className="finish-name">{material.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'wooden' ? 'active' : ''}`}>
            <div className="finishes-grid">
              {product?.wooden?.map((wood, index) => (
                <div className="finish-item" key={index}>
                  <div className="finish-image">
                    <img 
                      src={`http://157.175.147.228/admin/uploads/wooden/${wood.image}`}
                      alt={wood.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </div>
                  <span className="finish-name">{wood.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'colors' ? 'active' : ''}`}>
            <div className="finishes-grid">
              {product?.colors?.map((color, index) => (
                <div className="finish-item" key={index}>
                  <div className="finish-image">
                    <img 
                      src={`http://157.175.147.228/admin/uploads/colors/${color.image}`}
                      alt={color.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </div>
                  <span className="finish-name">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className={`tab-content ${activeTab === 'marble' ? 'active' : ''}`}>
            <div className="finishes-grid">
              {product?.marbles?.map((marble, index) => (
                <div className="finish-item" key={index}>
                  <div className="finish-image">
                    <img 
                      src={`http://157.175.147.228/admin/uploads/marbles/${marble.image}`}
                      alt={marble.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
                      }}
                    />
                  </div>
                  <span className="finish-name">{marble.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs Section */}
        <div className="product-tabs-section">
          {/* Tabs Navigation */}
          <div className="detail-tabs">
            <button 
              className={`detail-tab-button ${activeDetailTab === 'description' ? 'active' : ''}`}
              onClick={() => handleDetailTabClick('description')}
            >
              Description
            </button>
            <button 
              className={`detail-tab-button ${activeDetailTab === 'vendor' ? 'active' : ''}`}
              onClick={() => handleDetailTabClick('vendor')}
            >
              Vendor Info
            </button>
            <button 
              className={`detail-tab-button ${activeDetailTab === 'shipping' ? 'active' : ''}`}
              onClick={() => handleDetailTabClick('shipping')}
            >
              Shipping
            </button>
          </div>
          
          {/* Description Tab Content */}
          <div className={`detail-tab-content ${activeDetailTab === 'description' ? 'active' : ''}`}>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            
            <ul className="specs-list">
              {product.category_name && (
                <li>
                  <span className="label">Category:</span> 
                  {product.category_name}
                  {product.subcategory_name && (
                    <> &gt; {product.subcategory_name}</>
                  )}
                </li>
              )}
              {product.sku && (
                <li>
                  <span className="label">SKU:</span> 
                  {product.sku}
                </li>
              )}
              {product?.materials?.length > 0 && (
                <li>
                  <span className="label">Materials:</span> 
                  {product.materials.map(material => material.name).join(', ')}
                </li>
              )}
              {product?.colors?.length > 0 && (
                <li>
                  <span className="label">Available Colors:</span> 
                  {product.colors.map(color => color.name).join(', ')}
                </li>
              )}
              {product?.wooden?.length > 0 && (
                <li>
                  <span className="label">Wooden Finishes:</span> 
                  {product.wooden.map(wood => wood.name).join(', ')}
                </li>
              )}
              {product?.marbles?.length > 0 && (
                <li>
                  <span className="label">Marble/Stone Finishes:</span> 
                  {product.marbles.map(marble => marble.name).join(', ')}
                </li>
              )}
            </ul>
          </div>
          
          {/* Vendor Info Tab Content */}
          <div className={`detail-tab-content ${activeDetailTab === 'vendor' ? 'active' : ''}`}>
            <div className="vendor-info">
              <h3>Design Craft</h3>
              <div className="vendor-address">
                <p>Abdul Razzaq Mohiddin Abdulla</p>
                <p>Warehouse Shed No-1 Opp. Pedal Art</p>
                <p>Al Quoz Industrial Area – 1, Dubai</p>
              </div>
              <p>
                At Design Craft, we blend artistry with functionality to create office furniture that transforms workspaces. Our premium materials and skilled craftsmanship ensure every piece meets the highest standards of quality and aesthetics.
              </p>
            </div>
          </div>
          
          {/* Shipping Tab Content */}
          <div className={`detail-tab-content ${activeDetailTab === 'shipping' ? 'active' : ''}`}>
            <div className="shipping-info">
              <h3>Delivery Information</h3>
              <ul>
                <li>Free delivery within Dubai city limits on orders above AED 2,000</li>
                <li>Delivery to other emirates available at nominal charges</li>
                <li>Typical delivery timeframe: 3-5 business days</li>
                <li>Express delivery options available for urgent requirements</li>
                <li>Installation service provided by our professional team</li>
              </ul>
              
              <h3>Return Policy</h3>
              <p>Custom-made items cannot be returned unless there's a manufacturing defect. Please inspect all items upon delivery. Any damages must be reported within 24 hours of receipt.</p>
            </div>
          </div>
        </div>
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="related-title">Related Products</h2>
            <p className="related-subtitle">
              Explore more {product.subcategory_name} options that match your style.
            </p>
            
            <div className="related-products-slider">
              <button 
                className="slider-nav-button slider-nav-prev" 
                onClick={() => handleSlideChange('prev')}
                aria-label="Previous products"
              >
                <FiChevronLeft />
              </button>
              
              <div className="related-products-grid" ref={sliderRef}>
                {relatedProducts.map(relatedProduct => (
                  <div key={relatedProduct.id} className="related-product-item">
                    <Link to={`/product/${relatedProduct.id}`}>
                      <div className="related-product-image">
                        <img 
                          src={`http://157.175.147.228/admin/uploads/products/${relatedProduct.images[0]}`}
                          alt={relatedProduct.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                          }}
                        />
                      </div>
                      <div className="related-product-info">
                        <h3 className="related-product-title">{relatedProduct.name}</h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              
              <button 
                className="slider-nav-button slider-nav-next" 
                onClick={() => handleSlideChange('next')}
                aria-label="Next products"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>

      <EnquiryForm
        isOpen={isEnquiryOpen}
        onClose={handleEnquiryClose}
        productName={product.name}
        productSku={product.sku}
      />

      <style jsx>{`
        .custom-breadcrumbs {
          background-color: #ffffff;
          padding: 15px 0;
          border-bottom: 1px solid #e5e5e5;
          margin-top: 80px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .breadcrumbs-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .breadcrumbs-content {
          display: flex;
          align-items: center;
          min-height: 40px;
        }

        .breadcrumbs-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 5px;
          font-size: 13px;
          font-weight: 400;
        }

        .breadcrumbs-links a {
          color: #666;
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 5px 0;
        }

        .breadcrumbs-links a:hover {
          color: #ff7f50;
        }

        .separator {
          color: #ccc;
          margin: 0 5px;
          font-size: 12px;
        }

        .current {
          color: #333;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .custom-breadcrumbs {
            margin-top: 60px;
            padding: 12px 0;
          }

          .breadcrumbs-content {
            min-height: 35px;
          }

          .breadcrumbs-links {
            font-size: 12px;
          }
        }

        @media (max-width: 480px) {
          .custom-breadcrumbs {
            margin-top: 50px;
            padding: 10px 0;
          }

          .breadcrumbs-links {
            font-size: 11px;
          }

          .separator {
            margin: 0 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetailPage; 

<style jsx>{`
  .specs-list {
    list-style: none;
    padding: 0;
    margin: 20px 0;
  }

  .specs-list li {
    margin-bottom: 12px;
    font-size: 15px;
    color: #333;
  }

  .specs-list .label {
    font-weight: 600;
    color: #666;
    min-width: 150px;
    display: inline-block;
  }

  .product-category,
  .subcategory,
  .product-sku {
    display: block;
    margin-bottom: 10px;
    font-size: 15px;
    color: #666;
  }

  .label {
    display: inline-block;
    min-width: 100px;
    margin-right: 10px;
  }

  strong {
    color: #333;
    font-weight: 600;
  }

  .product-category a {
    color: #333;
    text-decoration: none;
    font-weight: 600;
  }

  .product-category a:hover {
    color: #007bff;
  }

  .product-description {
    margin-top: 20px;
  }
`}</style> 