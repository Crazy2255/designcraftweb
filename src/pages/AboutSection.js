import React from 'react';
import logo from '../assets/images/logo.png';

const AboutSection = () => {
  return (
    <div className="about-wrapper">
      {/* Know More Section */}
      <div className="know-more-section">
        {/* ... existing know more content ... */}
      </div>

      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <h2 className="section-title">Our Clients</h2>
          <div className="logo-grid">
            <div className="logo-item">
              <div className="logo-image">
                <img src={logo} alt="Client Logo 1" />
              </div>
              <p className="company-name">Company One</p>
            </div>
            <div className="logo-item">
              <div className="logo-image">
                <img src={logo} alt="Client Logo 2" />
              </div>
              <p className="company-name">Company Two</p>
            </div>
            <div className="logo-item">
              <div className="logo-image">
                <img src={logo} alt="Client Logo 3" />
              </div>
              <p className="company-name">Company Three</p>
            </div>
            <div className="logo-item">
              <div className="logo-image">
                <img src={logo} alt="Client Logo 4" />
              </div>
              <p className="company-name">Company Four</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-section {
          padding: 50px 0;
          background-color: #f8f9fa;
          margin-top: 40px;
        }

        .logo-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-title {
          text-align: center;
          font-size: 32px;
          color: #333;
          margin-bottom: 40px;
          font-weight: 500;
        }

        .logo-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
          align-items: center;
          justify-content: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .logo-item {
          text-align: center;
          padding: 20px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .logo-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .logo-image {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
        }

        .logo-image img {
          max-width: 80%;
          max-height: 80%;
          object-fit: contain;
          filter: grayscale(100%);
          transition: filter 0.3s ease;
        }

        .logo-item:hover .logo-image img {
          filter: grayscale(0%);
        }

        .company-name {
          font-size: 14px;
          color: #666;
          margin: 0;
          font-weight: 500;
        }

        /* Tablet Responsive */
        @media (max-width: 768px) {
          .logo-section {
            padding: 40px 0;
          }

          .section-title {
            font-size: 28px;
            margin-bottom: 30px;
          }

          .logo-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 25px;
          }

          .logo-item {
            padding: 15px;
          }

          .logo-image {
            height: 80px;
          }

          .company-name {
            font-size: 13px;
          }
        }

        /* Mobile Responsive */
        @media (max-width: 480px) {
          .logo-section {
            padding: 30px 0;
          }

          .section-title {
            font-size: 24px;
            margin-bottom: 25px;
          }

          .logo-grid {
            gap: 15px;
          }

          .logo-item {
            padding: 10px;
          }

          .logo-image {
            height: 60px;
          }

          .company-name {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default AboutSection; 