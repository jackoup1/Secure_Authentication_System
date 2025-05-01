import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaHistory, 
  FaSignOutAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaGlobe,
  FaChartLine,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaLinux,
  FaWindows,
  FaApple,
  FaChrome,
  FaFirefox,
  FaSafari,
  FaEdge
} from 'react-icons/fa';
import { format, formatDistanceToNow, isValid } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './Dashboard.module.css';

// Utility function for safe date parsing
const safeParseDate = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    let date;
    
    if (typeof dateInput === 'string') {
      // Try parsing as ISO string first
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(dateInput)) {
        date = new Date(dateInput);
      } else {
        // Try parsing as a number (Unix timestamp)
        const timestampNum = Number(dateInput);
        if (!isNaN(timestampNum)) {
          date = new Date(timestampNum);
        } else {
          // Try parsing as a regular date string
          date = new Date(dateInput);
        }
      }
    } else if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      console.warn('Invalid date input type:', typeof dateInput);
      return null;
    }

    return isValid(date) ? date : null;
  } catch (error) {
    console.warn('Error parsing date:', error);
    return null;
  }
};

// Utility function for safe date formatting
const safeFormatDate = (dateInput, formatFn, fallbackText = 'N/A') => {
  const date = safeParseDate(dateInput);
  if (!date) {
    console.warn('Invalid date for formatting:', dateInput);
    return fallbackText;
  }
  return formatFn(date);
};

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loginHistory, setLoginHistory] = useState([]);
  const [sessions, setSessions] = useState([]);

  const fetchLoginActivity = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:5000/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(`Failed to fetch login activity: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (!Array.isArray(data)) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }
      
      // Transform the data to match the expected format
      const transformedData = data.map(log => ({
        timestamp: safeParseDate(log.loginTime)?.toISOString() || new Date().toISOString(),
        status: log.status,
        ipAddress: log.ipAddress || 'Not detected',
        type: 'login',
        device: `${getBrowser(log.userAgent)} / ${getOS(log.userAgent)}`,
        browser: getBrowser(log.userAgent),
        os: getOS(log.userAgent)
      })).sort((a, b) => {
        const dateA = safeParseDate(a.timestamp);
        const dateB = safeParseDate(b.timestamp);
        return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
      });
      
      console.log('Transformed login data:', transformedData);
      setLoginHistory(transformedData);
    } catch (error) {
      console.error('Error fetching login activity:', error);
      // Fallback to localStorage data if API fails
      try {
        const lastLoginStr = localStorage.getItem('lastLogin');
        const failedLoginsStr = localStorage.getItem('failedLogins');
        
        const lastLogin = lastLoginStr ? JSON.parse(lastLoginStr) : null;
        const failedLogins = failedLoginsStr ? JSON.parse(failedLoginsStr) : [];
        
        // Ensure all timestamps are valid ISO strings
        const allLogins = [
          ...(lastLogin ? [{
            ...lastLogin,
            timestamp: safeParseDate(lastLogin.timestamp)?.toISOString() || new Date().toISOString(),
            ipAddress: lastLogin.ip_address || 'Not detected',
            device: `${getBrowser(lastLogin.user_agent)} / ${getOS(lastLogin.user_agent)}`,
            browser: getBrowser(lastLogin.user_agent),
            os: getOS(lastLogin.user_agent)
          }] : []),
          ...failedLogins.map(login => ({
            ...login,
            timestamp: safeParseDate(login.timestamp)?.toISOString() || new Date().toISOString(),
            ipAddress: login.ip_address || 'Not detected',
            device: `${getBrowser(login.user_agent)} / ${getOS(login.user_agent)}`,
            browser: getBrowser(login.user_agent),
            os: getOS(login.user_agent)
          }))
        ].sort((a, b) => {
          const dateA = safeParseDate(a.timestamp);
          const dateB = safeParseDate(b.timestamp);
          return (dateB?.getTime() || 0) - (dateA?.getTime() || 0);
        });
        
        console.log('Fallback login data:', allLogins);
        setLoginHistory(allLogins);
      } catch (parseError) {
        console.error('Error parsing localStorage data:', parseError);
        setLoginHistory([]);
      }
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchLoginActivity();

      // Get active sessions
      const getCurrentIP = async () => {
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          const ipAddress = ipData.IPv4 || ipData.ip;
          
          const currentSession = {
            id: 'current',
            device: `${getBrowser()} / ${getOS()}`,
            location: 'Current Location',
            lastActive: new Date().toISOString(),
            current: true,
            ip_address: ipAddress
          };
          console.log('Current Session:', currentSession);
          setSessions([currentSession]);
        } catch (ipError) {
          console.warn('Could not fetch IP address:', ipError);
          // Try alternative IP service if first one fails
          try {
            const altIpResponse = await fetch('https://api64.ipify.org?format=json');
            const altIpData = await altIpResponse.json();
            const ipAddress = altIpData.IPv4 || altIpData.ip;
            
            const currentSession = {
              id: 'current',
              device: `${getBrowser()} / ${getOS()}`,
              location: 'Current Location',
              lastActive: new Date().toISOString(),
              current: true,
              ip_address: ipAddress
            };
            console.log('Current Session:', currentSession);
            setSessions([currentSession]);
          } catch (altIpError) {
            console.error('Could not fetch IP from alternative service:', altIpError);
            // Set session without IP if both services fail
            const currentSession = {
              id: 'current',
              device: `${getBrowser()} / ${getOS()}`,
              location: 'Current Location',
              lastActive: new Date().toISOString(),
              current: true,
              ip_address: null
            };
            console.log('Current Session (no IP):', currentSession);
            setSessions([currentSession]);
          }
        }
      };

      getCurrentIP();
    }
  }, [loading, user]);

  const getBrowser = (userAgent = navigator.userAgent) => {
    const ua = userAgent;
    
    // Check for browsers in order of market share
    if (ua.includes('Chrome') && !ua.includes('Edge') && !ua.includes('OPR')) {
      return 'Chrome';
    }
    if (ua.includes('Firefox')) {
      return 'Firefox';
    }
    if (ua.includes('Safari') && !ua.includes('Chrome')) {
      return 'Safari';
    }
    if (ua.includes('Edge')) {
      return 'Edge';
    }
    if (ua.includes('OPR')) {
      return 'Opera';
    }
    if (ua.includes('MSIE') || ua.includes('Trident/')) {
      return 'Internet Explorer';
    }
    if (ua.includes('Brave')) {
      return 'Brave';
    }
    
    return 'Unknown Browser';
  };

  const getOS = (userAgent = navigator.userAgent) => {
    const ua = userAgent;
    
    // Windows
    if (ua.includes('Windows')) {
      if (ua.includes('Windows NT 10.0')) return 'Windows 10';
      if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
      if (ua.includes('Windows NT 6.2')) return 'Windows 8';
      if (ua.includes('Windows NT 6.1')) return 'Windows 7';
      if (ua.includes('Windows NT 6.0')) return 'Windows Vista';
      if (ua.includes('Windows NT 5.1')) return 'Windows XP';
      return 'Windows';
    }
    
    // macOS
    if (ua.includes('Macintosh')) {
      if (ua.includes('Mac OS X 10_15')) return 'macOS Catalina';
      if (ua.includes('Mac OS X 10_14')) return 'macOS Mojave';
      if (ua.includes('Mac OS X 10_13')) return 'macOS High Sierra';
      if (ua.includes('Mac OS X 10_12')) return 'macOS Sierra';
      return 'macOS';
    }
    
    // Linux
    if (ua.includes('Linux')) {
      if (ua.includes('Ubuntu')) return 'Ubuntu';
      if (ua.includes('Fedora')) return 'Fedora';
      if (ua.includes('Debian')) return 'Debora';
      if (ua.includes('CentOS')) return 'CentOS';
      return 'Linux';
    }
    
    // Mobile OS
    if (ua.includes('Android')) {
      const androidVersion = ua.match(/Android\s([0-9.]+)/);
      return androidVersion ? `Android ${androidVersion[1]}` : 'Android';
    }
    if (ua.includes('iPhone') || ua.includes('iPad')) {
      const iosVersion = ua.match(/OS\s([0-9_]+)/);
      return iosVersion ? `iOS ${iosVersion[1].replace(/_/g, '.')}` : 'iOS';
    }
    
    return 'Unknown OS';
  };

  const getDeviceIcon = (device) => {
    if (!device) return FaDesktop;
    if (device.includes('Android') || device.includes('iOS')) return FaMobileAlt;
    if (device.includes('iPad')) return FaTabletAlt;
    return FaDesktop;
  };

  const getOSIcon = (os) => {
    if (!os) return FaDesktop;
    if (os.includes('Windows')) return FaWindows;
    if (os.includes('Mac')) return FaApple;
    if (os.includes('Linux')) return FaLinux;
    return FaDesktop;
  };

  const getBrowserIcon = (browser) => {
    if (!browser) return FaGlobe;
    if (browser.includes('Chrome')) return FaChrome;
    if (browser.includes('Firefox')) return FaFirefox;
    if (browser.includes('Safari')) return FaSafari;
    if (browser.includes('Edge')) return FaEdge;
    return FaGlobe;
  };

  const handleSessionTerminate = async (sessionId) => {
    if (sessionId === 'current') {
      await logout();
      return;
    }
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const getActivityIcon = (activity) => {
    if (!activity || !activity.status) return <FaExclamationTriangle className={styles.timelineIcon + ' ' + styles.warning} />;
    switch (activity.type) {
      case 'login':
        return <FaCheckCircle className={styles.timelineIcon + ' ' + styles.success} />;
      case 'password_changed':
        return <FaShieldAlt className={styles.timelineIcon} />;
      case 'location_change':
        return <FaGlobe className={styles.timelineIcon} />;
      default:
        return <FaHistory className={styles.timelineIcon} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return safeFormatDate(
      timestamp,
      date => formatDistanceToNow(date, { addSuffix: true }),
      'No previous login'
    );
  };

  const formatFullDate = (timestamp) => {
    return safeFormatDate(
      timestamp,
      date => format(date, 'PPpp'),
      'Date not available'
    );
  };

  if (loading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  if (!user) {
    return <LoadingSpinner size="large" text="Redirecting to login..." />;
  }

  return (
    <div className={styles.dashboard}>
      <Header />
      <div className="container">
        <div className={styles.dashboardHeader}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.welcomeSection}
          >
            <h1>Welcome back, {user?.username || 'User'}!</h1>
            {loginHistory.length > 0 && (
              <p className={styles.lastLogin}>
                Last login: {formatTimestamp(loginHistory[0].timestamp)}
              </p>
            )}
          </motion.div>

          <div className={styles.quickActions}>
            <button 
              className="btn btn-outline-light" 
              onClick={() => setActiveTab('security')}
              aria-label="View Security Settings"
            >
              <FaShieldAlt /> Security Settings
            </button>
            <button 
              className="btn btn-danger" 
              onClick={logout}
              aria-label="Sign Out"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'overview'}
              className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine /> Overview
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'security'}
              className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <FaShieldAlt /> Security
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'sessions'}
              className={`${styles.tab} ${activeTab === 'sessions' ? styles.active : ''}`}
              onClick={() => setActiveTab('sessions')}
            >
              <FaDesktop /> Active Sessions
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={styles.tabContent}
              role="tabpanel"
              aria-labelledby={`${activeTab}-tab`}
            >
              {activeTab === 'overview' && (
                <div className={styles.overviewGrid}>
                  <div className={styles.statCard}>
                    <h3><FaShieldAlt /> Account Status</h3>
                    <div className={`${styles.statusBadge} ${styles.success}`}>
                      <FaCheckCircle /> Protected
                    </div>
                    <p>Your account has all security features enabled</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3><FaDesktop /> Active Sessions</h3>
                    <div className={styles.statNumber}>{sessions.length}</div>
                    <p>Device{sessions.length !== 1 ? 's' : ''} currently signed in</p>
                  </div>
                  <div className={styles.statCard}>
                    <h3><FaHistory /> Recent Activity</h3>
                    <div className={styles.statNumber}>
                      {loginHistory.length > 0 
                        ? `${loginHistory.length} activities`
                        : 'No activity'}
                    </div>
                    <p>Total login attempts recorded</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className={styles.securityTimeline}>
                  <h2>Login Activity</h2>
                  <div className={styles.timelineList}>
                    {loginHistory.length > 0 ? (
                      loginHistory.map((activity, index) => (
                        <motion.div
                          key={index}
                          className={`${styles.timelineItem} ${activity.status ? styles.success : styles.failed}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {activity.status ? (
                            <FaCheckCircle className={styles.timelineIcon + ' ' + styles.success} />
                          ) : (
                            <FaExclamationTriangle className={styles.timelineIcon + ' ' + styles.warning} />
                          )}
                          <div className={styles.timelineContent}>
                            <h4>
                              {activity.status ? 'Successful login' : 'Failed login attempt'}
                            </h4>
                            <p>
                              <span className={styles.deviceInfo}>
                                {getBrowserIcon(activity.browser)} {activity.browser} • 
                                {getOSIcon(activity.os)} {activity.os}
                              </span>
                              {activity.ipAddress ? 
                                ` • IP: ${activity.ipAddress}` : 
                                ' • IP: Not detected'}
                            </p>
                            <span className={styles.timelineTime}>
                              {formatFullDate(activity.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className={styles.noActivity}>
                        <FaHistory className={styles.noActivityIcon} />
                        <p>No login activity recorded</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className={styles.sessionsList}>
                  {sessions.map(session => {
                    const DeviceIcon = getDeviceIcon(session.device);
                    const OSIcon = getOSIcon(session.device);
                    const BrowserIcon = getBrowserIcon(session.device);

                    return (
                      <motion.div
                        key={session.id}
                        className={styles.sessionItem}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className={styles.sessionInfo}>
                          <div className={styles.deviceIcon}>
                            <DeviceIcon />
                          </div>
                          <div className={styles.sessionDetails}>
                            <h4>{session.device}</h4>
                            <p>
                              <OSIcon /> {getOS()} • <BrowserIcon /> {getBrowser()}
                            </p>
                            <p className={styles.sessionLocation}>
                              <FaGlobe /> {session.location}
                            </p>
                            <p className={styles.sessionIp}>
                              IP: {session.ip_address ? session.ip_address : 'Not detected'}
                            </p>
                            <span className={styles.timelineTime}>
                              Last active: {formatFullDate(session.lastActive)}
                            </span>
                          </div>
                        </div>
                        <div className={styles.sessionMeta}>
                          {session.current && (
                            <span className={styles.currentBadge}>Current Session</span>
                          )}
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleSessionTerminate(session.id)}
                            aria-label={session.current ? "Sign Out" : "Terminate Session"}
                          >
                            {session.current ? 'Sign Out' : 'Terminate'}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;