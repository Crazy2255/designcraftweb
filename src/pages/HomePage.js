import React from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductCategories from '../components/ProductCategories';
import AboutSection from '../components/AboutSection';
import WhyChooseUs from '../components/WhyChooseUs';
import BestSeller from '../components/BestSeller';
import ClientSlider from '../components/ClientSlider';
import RecentWorks from '../components/RecentWorks';
import Testimonials from '../components/Testimonials';
import ContactForm from '../components/ContactForm';
import HomeCaseStudy from '../components/HomeCaseStudy';

const HomePage = () => {
  return (
    <div className="home-page">
      <HeroSlider />
      <ProductCategories />
      <AboutSection />
      <WhyChooseUs />
      <BestSeller/>
      <HomeCaseStudy/>
      <ClientSlider />
      <RecentWorks />
      <Testimonials />
      <ContactForm />
    </div>
  );
};

export default HomePage; 