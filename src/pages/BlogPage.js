import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import '../assets/css/BlogPage.css';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
      }
      setRetrying(false);
      setError(null);

      const response = await fetch('https://design.elitedigitals.ae/admin/api/blogs.php');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data) {
        throw new Error('Empty response from server');
      }

      if (data.status === 'success' && Array.isArray(data.data)) {
        setBlogs(data.data);
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error details:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('Cannot connect to the server. Please check your internet connection.');
      } else if (error.message.includes('Invalid response format')) {
        setError('Server returned unexpected data format. Please try again later.');
      } else {
        setError(`Error: ${error.message}`);
      }
      
      setRetrying(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchBlogs(true);
  };

  const breadcrumbLinks = [
    { url: '/', text: 'Home' },
    { url: '/blog', text: 'Blog' }
  ];

  if (loading) {
    return (
      <main className="main-content">
        <div className="loading-container">
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <div className="blog-page">
        <Breadcrumbs title="Blog" links={breadcrumbLinks} />
        <div className="error-message">
          <p>{error}</p>
          <p className="error-details">Technical details: {error}</p>
          {retrying && (
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <Breadcrumbs title="Blog" links={breadcrumbLinks} />

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <p className="error-details">Technical details: {error}</p>
          {retrying && (
            <button onClick={handleRetry} className="retry-button">
              Try Again
            </button>
          )}
        </div>
      )}

      {!error && blogs.length === 0 ? (
        <div className="no-blogs-message">
          <p>No blog posts available at the moment.</p>
        </div>
      ) : !error && (
        <div className="blog-grid-container">
          {blogs.map((blog) => (
            <Link to={`/blog/${blog.id}`} key={blog.id} className="blog-card">
              <div className="blog-image-overlay">
                <img 
                  src={blog.image 
                    ? `https://design.elitedigitals.ae/admin/uploads/blogs/${blog.image}`
                    : require('../assets/images/no-image.png')
                  }
                  alt={blog.heading}
                  onError={(e) => {
                    e.target.src = require('../assets/images/no-image.png');
                  }}
                />
                <div className="blog-overlay">
                  <h2>{blog.heading}</h2>
                  {blog.author && <p className="blog-author">By {blog.author}</p>}
                  {blog.publish_date && (
                    <p className="blog-date">
                      {new Date(blog.publish_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage; 