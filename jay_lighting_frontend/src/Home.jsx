import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';


const Home = () => {

  const pastProjects = [
    {
      id: 1,
      title: "Annual Music Festival",
      description: "Complete sound and lighting setup for 3 days Music festival",
      image: "https://www.shipshewanalightsofjoy.com/images/kj-01.jpg",
      date: "February 2025"
    },
    {
      id: 2,
      title: "Corporate Award Ceremony",
      description: "Premium lighting and audio solutions for corporate event",
      image: "https://static.wixstatic.com/media/4a1094_a67755c7e8004bd4907f6bdceb8a96a8~mv2.jpg/v1/fill/w_1620,h_1080,al_c,q_30/4a1094_a67755c7e8004bd4907f6bdceb8a96a8~mv2.jpg",
      date: "January 2023"
    },
    {
      id: 3,
      title: "Wedding Reception",
      description: "Elegant lighting design and sound system for wedding",
      image: "https://th.bing.com/th/id/OIP.ofovQcuBVMHbLq8HhJN2QAHaJr?rs=1&pid=ImgDetMain", 
      date: "December 2024"
    }
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Jayawardana Lighting & Sounds</h1>
        <p>Your Premier Source for Professional Lighting and Sound Equipment</p>
      </div>

      <div className="services-grid">
        <div className="service-card">
          <i className="fas fa-lightbulb"></i>
          <h3>Lighting Equipment</h3>
          <p>Professional lighting solutions for events of all sizes</p>
        </div>
        <div className="service-card">
          <i className="fas fa-music"></i>
          <h3>Sound Systems</h3>
          <p>High-quality audio equipment for perfect sound</p>
        </div>
        <div className="service-card">
          <i className="fas fa-calendar-alt"></i>
          <h3>Event Support</h3>
          <p>Complete technical support for your events</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Create Your Perfect Event?</h2>
        <Link to="/login" className="cta-button">Get Started</Link>
      </div>


      {/* Past Projects Section */}
      <div className="projects-section">
        <h2>Our Recent Projects</h2>
        <div className="projects-grid">
          {pastProjects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <span className="project-date">{project.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature">
            <h4>Quality Equipment</h4>
            <p>Top-tier lighting and sound gear</p>
          </div>
          <div className="feature">
            <h4>Expert Support</h4>
            <p>Professional technical assistance</p>
          </div>
          <div className="feature">
            <h4>Flexible Rental</h4>
            <p>Customizable rental periods</p>
          </div>
          <div className="feature">
            <h4>Quick Setup</h4>
            <p>Efficient installation and removal</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p><i className="fas fa-phone"></i> +94 123 456 789</p>
            <p><i className="fas fa-envelope"></i> info@jayawardanalighting.com</p>
            <p><i className="fas fa-map-marker-alt"></i> 123 Main Street, Colombo</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">Facebook<i className="fab fa-facebook"></i></a>
              <a href="#">Youtube<i className="fab fa-youtube"></i></a>
              <a href="#">Instagram<i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Jayawardana Lighting & Sounds. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;