import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaKey, 
  FaMobile,
  FaFingerprint,
  FaUserShield,
  FaLock,
  FaCheckCircle,
  FaGlobe,
  FaPlay,
  FaStar,
  FaQuoteRight,
  FaCheck,
  FaGoogle,
  FaMicrosoft,
  FaAmazon,
  FaSlack
} from 'react-icons/fa';

const Home = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const features = [
    { 
      icon: <FaShieldAlt />, 
      title: 'Enterprise Security', 
      description: 'Military-grade encryption with advanced threat protection for your authentication system.' 
    },
    { 
      icon: <FaFingerprint />, 
      title: 'Biometric Authentication', 
      description: 'Seamless integration with fingerprint and face recognition on supported devices.' 
    },
    { 
      icon: <FaUserShield />, 
      title: 'Role-Based Access', 
      description: 'Granular access control with customizable user permissions and hierarchies.' 
    },
    { 
      icon: <FaKey />, 
      title: 'Smart Session Control', 
      description: 'Intelligent session management with automatic threat detection and prevention.' 
    },
    { 
      icon: <FaGlobe />, 
      title: 'Global Infrastructure', 
      description: 'Distributed servers ensuring low-latency access from anywhere in the world.' 
    },
    { 
      icon: <FaMobile />, 
      title: 'Cross-Platform Support', 
      description: 'Consistent experience across all devices and modern web browsers.' 
    }
  ];

  const stats = [
    { number: '99.99%', label: 'Uptime SLA' },
    { number: '<10ms', label: 'Response Time' },
    { number: '256-bit', label: 'Encryption' },
    { number: '24/7', label: 'Expert Support' }
  ];

  const testimonials = [
    {
      author: 'Sarah Johnson',
      role: 'CTO',
      company: 'TechCorp',
      content: 'SecureAuth has transformed our authentication system. The implementation was seamless, and our security metrics have improved significantly.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      author: 'Michael Chen',
      role: 'Security Lead',
      company: 'DataSafe',
      content: 'The best authentication solution we have implemented. The biometric integration and fraud detection features are outstanding.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      author: 'Emma Davis',
      role: 'Product Manager',
      company: 'CloudSecure',
      content: 'Our development team loves the API simplicity, and our users appreciate the smooth authentication experience.',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];

  const trustedBy = [
    { name: 'Google', icon: <FaGoogle /> },
    { name: 'Microsoft', icon: <FaMicrosoft /> },
    { name: 'Amazon', icon: <FaAmazon /> },
    { name: 'Slack', icon: <FaSlack /> }
  ];

  return (
    <>
      <main className="landing-page">
        {/* Hero Section */}
        <section className="home-hero">
          <div className="container">
            <motion.div
              className="home-hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1>Secure Authentication for Modern Applications</h1>
              <p className="home-hero-subtitle">
                Enterprise-grade security meets exceptional user experience. 
                Protect your applications with state-of-the-art authentication.
              </p>
              <div className="home-hero-buttons">
                <Link to="/signup" className="btn btn-primary">
                  Start Free Trial
                </Link>
                <Link to="/login" className="btn btn-outline">
                  Sign In
                </Link>
              </div>
              <div className="home-security-badges">
                <div className="home-badge">
                  <FaShieldAlt /> SOC2 Type II Certified
                </div>
                <div className="home-badge">
                  <FaLock /> GDPR Compliant
                </div>
                <div className="home-badge">
                  <FaCheckCircle /> ISO 27001 Certified
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="home-stats">
          <div className="container">
            <div className="home-stats-grid">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="home-stat-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3>{stat.number}</h3>
                  <p>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="home-features">
          <div className="container">
            <div className="home-features-header">
              <h2>Enterprise-Grade Security Features</h2>
              <p>Comprehensive authentication solutions designed for modern applications</p>
            </div>
            <div className="home-features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="home-feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="home-feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section className="home-demo">
          <div className="container">
            <div className="home-demo-header">
              <h2>See It In Action</h2>
              <p>Experience our authentication flow firsthand</p>
            </div>
            <div className="home-demo-content">
              <motion.div 
                className="demo-preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="demo-browser">
                  <div className="browser-header">
                    <div className="browser-actions">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="browser-address">secure-auth-demo.com</div>
                  </div>
                  <div className="browser-content">
                    <AnimatePresence mode="wait">
                      {showDemo ? (
                        <motion.div
                          key="demo-form"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="demo-auth-form"
                        >
                          <div className="demo-input-group">
                            <label>Email</label>
                            <input type="email" placeholder="demo@example.com" disabled />
                          </div>
                          <div className="demo-input-group">
                            <label>Password</label>
                            <input type="password" value="••••••••" disabled />
                          </div>
                          <button className="demo-button" disabled>
                            Sign In Securely
                          </button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="demo-start"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="demo-start"
                          onClick={() => setShowDemo(true)}
                        >
                          <FaPlay className="demo-play-icon" />
                          <span>Click to view demo</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
              <div className="demo-features">
                <h3>Key Features Demonstrated</h3>
                <ul>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <FaCheck /> Multi-factor Authentication
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <FaCheck /> Biometric Integration
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FaCheck /> Real-time Security Checks
                  </motion.li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="home-testimonials">
          <div className="container">
            <div className="testimonials-header">
              <h2>Trusted by Security Leaders</h2>
              <p>See what our customers have to say</p>
            </div>
            <div className="testimonials-grid">
              <AnimatePresence mode="wait">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="testimonial-content">
                      <FaQuoteRight className="quote-icon" />
                      <p>{testimonial.content}</p>
                    </div>
                    <div className="testimonial-author">
                      <img src={testimonial.avatar} alt={testimonial.author} />
                      <div className="author-info">
                        <h4>{testimonial.author}</h4>
                        <p>{testimonial.role}</p>
                        <p className="company">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="testimonial-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="star-icon" />
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="testimonial-nav">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`nav-dot ${index === activeTestimonial ? 'active' : ''}`}
                    onClick={() => setActiveTestimonial(index)}
                    aria-label={`View testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="home-trust">
          <div className="container">
            <h2>Trusted by Industry Leaders</h2>
            <div className="trust-logos">
              {trustedBy.map((company, index) => (
                <motion.div
                  key={index}
                  className="trust-logo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {company.icon}
                  <span>{company.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="home-cta">
          <div className="container">
            <motion.div
              className="home-cta-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2>Ready to Secure Your Application?</h2>
              <p>Start with our enterprise-grade authentication system today</p>
              <div className="home-hero-buttons">
                <Link to="/signup" className="btn btn-primary">
                  Start Free Trial
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Talk to Sales
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;