import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaLock, 
  FaCheck, 
  FaGithub, 
  FaTwitter, 
  FaLinkedin,
  FaBook,
  FaCode,
  FaLifeRing,
  FaUserShield,
  FaHandshake,
  FaFileContract
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', path: '/features', icon: <FaShieldAlt /> },
        { label: 'Security', path: '/security', icon: <FaLock /> },
        { label: 'Enterprise', path: '/enterprise', icon: <FaUserShield /> },
        { label: 'Pricing', path: '/pricing', icon: <FaHandshake /> }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', path: '/docs', icon: <FaBook /> },
        { label: 'API Reference', path: '/api', icon: <FaCode /> },
        { label: 'Support', path: '/support', icon: <FaLifeRing /> },
        { label: 'Status', path: '/status', icon: <FaCheck /> }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', path: '/privacy', icon: <FaFileContract /> },
        { label: 'Terms of Service', path: '/terms', icon: <FaFileContract /> },
        { label: 'GDPR', path: '/gdpr', icon: <FaLock /> },
        { label: 'Compliance', path: '/compliance', icon: <FaShieldAlt /> }
      ]
    }
  ];

  const socialLinks = [
    { icon: <FaGithub />, url: 'https://github.com', label: 'GitHub' },
    { icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaLinkedin />, url: 'https://linkedin.com', label: 'LinkedIn' }
  ];

  const certifications = [
    { icon: <FaShieldAlt />, text: 'SOC2 Type II Certified' },
    { icon: <FaLock />, text: 'GDPR Compliant' },
    { icon: <FaCheck />, text: 'ISO 27001 Certified' }
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <motion.div 
            className="footer-section brand-section"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/" className="footer-logo">
              <FaShieldAlt />
              <h3>SecureAuth</h3>
            </Link>
            <p className="footer-tagline">
              Enterprise-grade authentication for modern applications. Secure, scalable, and simple to integrate.
            </p>
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              className="footer-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h4>{section.title}</h4>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={linkIndex}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Link to={link.path}>
                      {link.icon}
                      <span>{link.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="footer-certifications"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="certification-badge"
              whileHover={{ y: -4, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {cert.icon}
              <span>{cert.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <div className="footer-bottom">
          <motion.div 
            className="footer-copyright"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            © {currentYear} SecureAuth. All rights reserved.
          </motion.div>
          <motion.div 
            className="footer-security-badge"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <FaShieldAlt />
            <span>256-bit SSL Encryption</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;