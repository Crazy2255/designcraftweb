import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp, FaTelegram } from 'react-icons/fa';
import '../assets/css/BlogDetailPage.css';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id, retryCount]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate blog ID
      if (!id || isNaN(id)) {
        throw new Error('Invalid blog ID');
      }

      console.log('Fetching blog with ID:', id);
      const response = await fetch(`http://157.175.147.228/admin/api/blogs.php?id=${id}`);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      console.log('Response text length:', text.length);

      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }

      console.log('Parsed data:', data);

      if (data.status === 'error') {
        throw new Error(data.message || 'Blog not found');
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid blog data received');
      }

      // Handle both direct blog object and wrapped response
      const blogData = data.data || data;
      
      // Debug log the processed blog data
      console.log('Blog data from API:', blogData);

      // Set fallback values for missing fields - Map API fields to frontend fields
      const processedBlog = {
        id: blogData.id,
        title: blogData.heading || blogData.title || 'Untitled', // API uses 'heading'
        content: blogData.description || blogData.content || 'No content available', // API uses 'description'
        excerpt: blogData.excerpt || (blogData.description && blogData.description.substring(0, 150) + '...') || '',
        author: blogData.author || blogData.author_name || 'Admin',
        publish_date: blogData.publish_date || blogData.created_at || new Date().toISOString(),
        image: blogData.image || '',
        tags: blogData.tags || '',
        category: blogData.category || 'General'
      };

      console.log('Processed blog for display:', processedBlog);

      setBlog(processedBlog);
      
      // Fetch recent posts
      await fetchRecentPosts();
      
    } catch (err) {
      console.error('Error fetching blog:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPosts = async () => {
    try {
      console.log('Fetching recent posts...');
      const response = await fetch('http://157.175.147.228/admin/api/blogs.php');
      
      console.log('Recent posts response status:', response.status);
      
      if (!response.ok) {
        console.warn('Failed to fetch recent posts');
        return;
      }

      const text = await response.text();
      if (!text) {
        console.warn('Empty response for recent posts');
        return;
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.warn('Failed to parse recent posts JSON');
        return;
      }

      // Handle different response structures
      let posts = [];
      if (Array.isArray(data)) {
        posts = data;
      } else if (data.status === 'success' && Array.isArray(data.data)) {
        posts = data.data;
      } else if (data.data && Array.isArray(data.data)) {
        posts = data.data;
      }

      // Filter out current blog and limit to 5 recent posts
      const recentPosts = posts
        .filter(post => post.id !== parseInt(id))
        .slice(0, 5)
        .map(post => ({
          id: post.id,
          title: post.heading || post.title || 'Untitled', // API uses 'heading'
          excerpt: post.excerpt || (post.description && post.description.substring(0, 100) + '...') || '', // API uses 'description'
          image: post.image || '',
          publish_date: post.publish_date || post.created_at || new Date().toISOString()
        }));

      setRecentPosts(recentPosts);
    } catch (err) {
      console.warn('Error fetching recent posts:', err);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const sanitizeContent = (content) => {
    if (!content) return '<p>No content available for this blog post.</p>';
    
    // Basic content validation and formatting
    let sanitized = content.toString().trim();
    
    // If content doesn't have any HTML tags, wrap it in paragraphs
    if (!sanitized.includes('<') && !sanitized.includes('>')) {
      // Split by line breaks and wrap each line in a paragraph
      sanitized = sanitized
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => `<p>${line.trim()}</p>`)
        .join('');
    }
    
    return sanitized || '<p>No content available for this blog post.</p>';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    console.warn('Image failed to load:', e.target.src);
    setImageLoading(false);
    setImageError(true);
    e.target.style.display = 'none';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // Check if it's already a full URL
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Construct full URL
    return `http://157.175.147.228/admin/uploads/blogs/${cleanPath}`;
  };

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
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <div className="error-container">
            <h2>Unable to Load Blog Post</h2>
            <p className="error-message">{error}</p>
            {retryCount < 3 && (
              <button onClick={handleRetry} className="retry-btn">
                Retry ({retryCount + 1}/3)
              </button>
            )}
            <Link to="/blog" className="back-link">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-container">
          <div className="error-container">
            <h2>Blog Post Not Found</h2>
            <p>The blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="back-link">
              ← Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(blog.title);

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <article className="blog-article">
          <div className="blog-header">
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-meta">
              <span className="blog-author">By {blog.author}</span>
              <span className="blog-date">{formatDate(blog.publish_date)}</span>
              {blog.category && <span className="blog-category">{blog.category}</span>}
            </div>
          </div>

          {blog.image && (
            <div className="blog-image">
              {imageLoading && (
                <div className="image-loading">
                </div>
              )}
              <img 
                src={getImageUrl(blog.image)}
                alt={blog.title}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  display: imageLoading ? 'none' : 'block',
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              {imageError && !imageLoading && (
                <div className="image-fallback">
                  <div className="fallback-icon">📷</div>
                  <p>Image not available</p>
                </div>
              )}
            </div>
          )}

          <div className="blog-content">
            <div 
              className="blog-text"
              dangerouslySetInnerHTML={{ 
                __html: sanitizeContent(blog.content)
              }}
            />
          </div>

          {blog.tags && (
            <div className="blog-tags">
              <h4>Tags:</h4>
              <div className="tags-list">
                {blog.tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="blog-share">
            <h4>Share this post:</h4>
            <div className="share-buttons">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn twitter"
              >
                <FaTwitter />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn linkedin"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20-%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn whatsapp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`https://www.instagram.com/`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn instagram"
              >
                <FaInstagram />
              </a>
              <a
                href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="share-btn telegram"
              >
                <FaTelegram />
              </a>
            </div>
          </div>
        </article>

        <aside className="blog-sidebar">
          {recentPosts.length > 0 && (
            <div className="recent-posts">
              <h3>Recent Posts</h3>
              <div className="recent-posts-list">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="recent-post-item"
                  >
                    <div className="recent-post-image-container">
                      {post.image ? (
                        <img
                          src={getImageUrl(post.image)}
                          alt={post.title}
                          className="recent-post-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                          onLoad={(e) => {
                            e.target.style.display = 'block';
                            if (e.target.nextSibling) {
                              e.target.nextSibling.style.display = 'none';
                            }
                          }}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '4px'
                          }}
                        />
                      ) : null}
                      <div 
                        className="recent-post-image-fallback"
                        style={{
                          display: post.image ? 'none' : 'flex',
                          width: '100%',
                          height: '80px',
                          backgroundColor: '#f0f0f0',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          fontSize: '24px',
                          color: '#999'
                        }}
                      >
                        📄
                      </div>
                    </div>
                    <div className="recent-post-content">
                      <h4 className="recent-post-title">{post.title}</h4>
                      <p className="recent-post-excerpt">{post.excerpt}</p>
                      <span className="recent-post-date">
                        {formatDate(post.publish_date)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BlogDetailPage;