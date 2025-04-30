import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserCircle, 
  FaCog, 
  FaSignOutAlt, 
  FaBell, 
  FaBars,
  FaTimes,
  FaShieldAlt
} from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const [notifications] = useState([
    {
      id: 1,
      message: 'New login from Chrome browser',
      time: '2 minutes ago',
      isRead: false
    },
    {
      id: 2,
      message: 'Security settings updated',
      time: '1 hour ago',
      isRead: true
    }
  ]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleDropdownToggle = (dropdownName) => {
    setShowDropdown(current => current === dropdownName ? '' : dropdownName);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  return (
    <motion.header 
      className={`main-header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      role="banner"
    >
      <div className="container header-container">
        <Link to="/" className="logo" aria-label="SecureAuth Home">
          <FaShieldAlt />
          SecureAuth
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav 
          className={`nav-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}
          role="navigation"
          aria-label="Main navigation"
        >
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <div className="header-actions" ref={dropdownRef}>
                <div className="notifications-dropdown">
                  <button
                    className="notification-button"
                    onClick={() => handleDropdownToggle('notifications')}
                    aria-label={`Notifications ${getUnreadNotificationsCount()} unread`}
                    aria-expanded={showDropdown === 'notifications'}
                    onKeyPress={(e) => handleKeyPress(e, () => handleDropdownToggle('notifications'))}
                  >
                    <FaBell />
                    {getUnreadNotificationsCount() > 0 && (
                      <motion.span 
                        className="notification-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {getUnreadNotificationsCount()}
                      </motion.span>
                    )}
                  </button>
                  <AnimatePresence>
                    {showDropdown === 'notifications' && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="menu"
                      >
                        <h4>Notifications</h4>
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <motion.div 
                              key={notification.id} 
                              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              role="menuitem"
                              tabIndex="0"
                            >
                              <p>{notification.message}</p>
                              <span>{notification.time}</span>
                            </motion.div>
                          ))
                        ) : (
                          <p className="no-notifications">No notifications</p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="user-dropdown">
                  <motion.button
                    className="user-button"
                    onClick={() => handleDropdownToggle('user')}
                    aria-expanded={showDropdown === 'user'}
                    onKeyPress={(e) => handleKeyPress(e, () => handleDropdownToggle('user'))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaUserCircle aria-hidden="true" />
                    <span>{user.username}</span>
                  </motion.button>
                  <AnimatePresence>
                    {showDropdown === 'user' && (
                      <motion.div
                        className="dropdown-menu"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        role="menu"
                      >
                        <Link 
                          to="/dashboard" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowDropdown('')}
                        >
                          <FaUserCircle aria-hidden="true" /> Profile
                        </Link>
                        <Link 
                          to="/settings" 
                          className="dropdown-item"
                          role="menuitem"
                          onClick={() => setShowDropdown('')}
                        >
                          <FaCog aria-hidden="true" /> Settings
                        </Link>
                        <button 
                          onClick={() => {
                            setShowDropdown('');
                            logout();
                          }}
                          className="dropdown-item text-danger"
                          role="menuitem"
                        >
                          <FaSignOutAlt aria-hidden="true" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="btn btn-primary"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;