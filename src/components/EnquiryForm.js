import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import '../assets/css/EnquiryForm.css';

const EnquiryForm = ({ isOpen, onClose, productName, productSku }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    product_name: productName,
    product_sku: productSku
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://157.175.147.228/admin/api/enquiries.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Thank you for your enquiry. We will contact you soon!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          product_name: productName,
          product_sku: productSku
        });
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="enquiry-modal-overlay">
      <div className="enquiry-modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Product Enquiry</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <PhoneInput
              country={'ae'}
              value={formData.phone}
              onChange={handlePhoneChange}
              inputProps={{
                required: true,
                name: 'phone'
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter your message"
              rows="4"
            />
          </div>

          <div className="product-info">
            <p><strong>Product:</strong> {productName}</p>
            <p><strong>SKU:</strong> {productSku}</p>
          </div>

          <button 
            type="submit" 
            className="enquiry-submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading.....' : 'Send Enquiry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnquiryForm; 