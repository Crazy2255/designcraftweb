import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/logo.png';
import { FaAngleDown, FaTimes, FaBars } from 'react-icons/fa';
import '../assets/css/Navbar.css';

const Navbar = () => {
  const [officeDropdown, setOfficeDropdown] = useState(false);
  const [chairsDropdown, setChairsDropdown] = useState(false);
  const [storageDropdown, setStorageDropdown] = useState(false);
  const [sofaDropdown, setSofaDropdown] = useState(false);
  const [solutionsDropdown, setSolutionsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [officeSubcategories, setOfficeSubcategories] = useState([]);
  const [chairSubcategories, setChairSubcategories] = useState([]);
  const [storageSubcategories, setStorageSubcategories] = useState([]);
  const [sofaSubcategories, setSofaSubcategories] = useState([]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Fetch subcategories for all categories
    const fetchSubcategories = async () => {
      try {
        // Fetch office furniture subcategories (category ID 1)
        const officeResponse = await fetch('https://design.elitedigitals.ae/admin/api/subcategories.php?category_id=1');
        const officeData = await officeResponse.json();
        if (officeData.success) {
          setOfficeSubcategories(officeData.subcategories);
        }

        // Fetch office chairs subcategories (category ID 2)
        const chairsResponse = await fetch('https://design.elitedigitals.ae/admin/api/subcategories.php?category_id=2');
        const chairsData = await chairsResponse.json();
        if (chairsData.success) {
          setChairSubcategories(chairsData.subcategories);
        }

        // Fetch storage solutions subcategories (category ID 3)
        const storageResponse = await fetch('https://design.elitedigitals.ae/admin/api/subcategories.php?category_id=3');
        const storageData = await storageResponse.json();
        if (storageData.success) {
          setStorageSubcategories(storageData.subcategories);
        }

        // Fetch sofa in lounge subcategories (category ID 4)
        const sofaResponse = await fetch('https://design.elitedigitals.ae/admin/api/subcategories.php?category_id=4');
        const sofaData = await sofaResponse.json();
        if (sofaData.success) {
          setSofaSubcategories(sofaData.subcategories);
        }
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    };

    fetchSubcategories();
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className={`navbar ${isScrolled ? 'navbar-fixed' : ''}`}>
      <div className="navbar-top">
        <div className="logo-container">
          <Link to="/">
            <img src={logoImage} alt="Design Craft Logo" className="logo" />
          </Link>
        </div>
      </div>
      
      <div className="navbar-bottom">
        <button 
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li 
            className="dropdown-container"
            onMouseEnter={() => setOfficeDropdown(true)}
            onMouseLeave={() => setOfficeDropdown(false)}
          >
            <Link to="/office-furniture" className="nav-link">
              OFFICE FURNITURE <FaAngleDown />
            </Link>
            {officeDropdown && (
              <div className="dropdown-menu">
                {officeSubcategories.map(subcategory => (
                  <Link 
                    key={subcategory.id} 
                    to={`/office-furniture/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          
          <li 
            className="dropdown-container"
            onMouseEnter={() => setChairsDropdown(true)}
            onMouseLeave={() => setChairsDropdown(false)}
          >
            <Link to="/office-chairs" className="nav-link">
              OFFICE CHAIRS <FaAngleDown />
            </Link>
            {chairsDropdown && (
              <div className="dropdown-menu">
                {chairSubcategories.map(subcategory => (
                  <Link 
                    key={subcategory.id} 
                    to={`/office-chairs/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          
          <li 
            className="dropdown-container"
            onMouseEnter={() => setStorageDropdown(true)}
            onMouseLeave={() => setStorageDropdown(false)}
          >
            <Link to="/storage-solutions" className="nav-link">
              STORAGE SOLUTIONS <FaAngleDown />
            </Link>
            {storageDropdown && (
              <div className="dropdown-menu">
                {storageSubcategories.map(subcategory => (
                  <Link 
                    key={subcategory.id} 
                    to={`/storage-solutions/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          
          <li 
            className="dropdown-container"
            onMouseEnter={() => setSofaDropdown(true)}
            onMouseLeave={() => setSofaDropdown(false)}
          >
            <Link to="/sofa-lounges" className="nav-link">
              SOFA IN LOUNGE <FaAngleDown />
            </Link>
            {sofaDropdown && (
              <div className="dropdown-menu">
                {sofaSubcategories.map(subcategory => (
                  <Link 
                    key={subcategory.id} 
                    to={`/sofa-lounges/${subcategory.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </li>
          
          {/* <li 
            className="dropdown-container"
            onMouseEnter={() => setSolutionsDropdown(true)}
            onMouseLeave={() => setSolutionsDropdown(false)}
          >
            <Link to="/solutions" className="nav-link">
              SOLUTIONS <FaAngleDown />
            </Link>
            {solutionsDropdown && (
              <div className="dropdown-menu">
                <Link to="/office-planning">Office Planning</Link>
                <Link to="/space-optimization">Space Optimization</Link>
                <Link to="/ergonomic-solutions">Ergonomic Solutions</Link>
              </div>
            )}
          </li> */}

          <li className="nav-item">
            <Link to="/case-study" className="nav-link">CASE STUDIES</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/blog" className="nav-link">BLOGS</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/design-fitout" className="nav-link">DESIGN FITOUT</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/design-ideas" className="nav-link">DESIGN IDEAS</Link>
          </li>
          
          <li className="nav-item">
            <Link to="/contact" className="nav-link">CONTACT</Link>
          </li>
        </ul>
        
        {/* <div className="login-button">
          <Link to="/login" className="login-link">LOGIN</Link>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar; 