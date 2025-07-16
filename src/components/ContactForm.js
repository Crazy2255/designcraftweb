import React, { useState } from 'react';
import '../assets/css/ContactForm.css';
import contactImage from '../assets/images/banner/contact.png';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prevState => ({
      ...prevState,
      phone: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      const response = await axios({
        method: 'post',
        url: 'https://design.elitedigitals.ae/admin/api/submit-contact.php',
        data: formDataToSend,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you for your message. We will get back to you soon!'
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || error.message || 'Failed to submit form. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-section">
      <div className="contact-image">
        <img src={contactImage} alt="Modern office interior with wooden finishes" />
      </div>
      
      <div className="contact-form-container">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-subtitle">
          We're here to address your inquiries, feedback, and order products promptly and effectively
        </p>
        
        {status.message && (
          <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {status.message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter Your Full Name"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter Your Email"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Phone No</label>
              <PhoneInput
                country={'ae'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClass="form-input"
                containerClass="phone-input-container"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="" disabled>Select Option</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Place an Order">Place an Order</option>
                <option value="Customer Support">Customer Support</option>
                <option value="General Feedback">General Feedback</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Your Message"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            className="contact-submit-btn"
            disabled={loading}
          >
            {loading ? 'Loading.....' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm; 