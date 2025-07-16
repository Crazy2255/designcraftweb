import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Breadcrumbs.css';
import breadcrumbsImage from '../assets/images/banner/breadcrumbs.png';

const Breadcrumbs = ({ title, links }) => {
  return (
    <div className="breadcrumbs-section">
      <img src={breadcrumbsImage} alt="Breadcrumbs Background" className="breadcrumbs-image" />
      <div className="breadcrumbs-overlay"></div>
      <div className="breadcrumbs-content">
        <h1 className="breadcrumbs-title">{title}</h1>
        <ul className="breadcrumbs-links">
          {links.map((link, index) => (
            <li key={index}>
              {index === links.length - 1 ? (
                <span className="breadcrumbs-current">{link.text}</span>
              ) : (
                <Link to={link.url} className="breadcrumbs-link">
                  {link.text}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumbs; 