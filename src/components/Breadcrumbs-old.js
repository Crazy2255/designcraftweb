import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../assets/css/Breadcrumbs.css';

const Breadcrumbs = ({ links }) => {
  return (
    <div className="breadcrumbs">
      <div className="breadcrumbs-container">
        <nav className="breadcrumbs-nav">
          <ol className="breadcrumbs-list">
            {links.map((link, index) => (
              <li key={link.path} className="breadcrumbs-item">
                {index === links.length - 1 ? (
                  <span className="breadcrumbs-current">{link.label}</span>
                ) : (
                  <>
                    <Link to={link.path} className="breadcrumbs-link">
                      {link.label}
                    </Link>
                    <span className="breadcrumbs-separator">/</span>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};

Breadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired
};

export default Breadcrumbs; 