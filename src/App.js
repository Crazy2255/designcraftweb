import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ExecutiveDeskPage from './pages/ExecutiveDeskPage';
import ProductDetailPage from './pages/ProductDetailPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import CaseStudy from './pages/CaseStudy';
import Gallery from './pages/Gallery';
import ContactDetail from './pages/ContactDetail';
import DesignFitOut from './pages/DesignFitOut';
import CaseStudiesDetails from './pages/CaseStudiesDetails';
import DesignIdeas from './pages/DesignIdeas';

function App() {
  const [isNavFixed, setIsNavFixed] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsNavFixed(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <HomePage />
            </main>
          </div>
        } />
        
        {/* Product Category Routes */}
        <Route path="/office-furniture/:subcategory" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ExecutiveDeskPage category="Office Furniture" />
            </main>
          </div>
        } />
        <Route path="/office-chairs/:subcategory" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ExecutiveDeskPage category="Office Chairs" />
            </main>
          </div>
        } />
        <Route path="/storage-solutions/:subcategory" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ExecutiveDeskPage category="Storage Solutions" />
            </main>
          </div>
        } />
        <Route path="/sofa-lounges/:subcategory" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ExecutiveDeskPage category="Sofa in Lounge" />
            </main>
          </div>
        } />
        
        <Route path="/product/:id" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ProductDetailPage />
            </main>
          </div>
        } />
        <Route path="/blog" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <BlogPage />
            </main>
          </div>
        } />
        <Route path="/blog/:id" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <BlogDetailPage />
            </main>
          </div>
        } />
        <Route path="/gallery" element={<Gallery />} />
        
        <Route path="/contact" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <ContactDetail />
            </main>
          </div>
        } />

        <Route path="/design-fitout" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <DesignFitOut />
            </main>
          </div>
        } />
        
        <Route path="/case-study" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <CaseStudy />
            </main>
          </div>
        } />
        <Route path="/case-study/:id" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <CaseStudiesDetails />
            </main>
          </div>
        } />
        
        <Route path="/design-ideas" element={
          <div className={`app ${isNavFixed ? 'fixed-nav' : ''}`}>
            <main className="main-content">
              <DesignIdeas />
            </main>
          </div>
        } />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
