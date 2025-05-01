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
import { format, formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Layout/Header';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loginHistory, setLoginHistory] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load login history from localStorage
    const lastLogin = JSON.parse(localStorage.getItem('lastLogin') || 'null');
    const failedLogins = JSON.parse(localStorage.getItem('failedLogins') || '[]');
    
    const allLogins = [
      ...(lastLogin ? [lastLogin] : []),
      ...failedLogins
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    setLoginHistory(allLogins);

    // Get active sessions
    const currentSession = {
      id: 'current',
      device: `${getBrowser()} / ${getOS()}`,
      location: 'Current Location',
      lastActive: new Date(),
      current: true,
      ip_address: lastLogin?.ip_address || 'Unknown'
    };

    setSessions([currentSession]);
  }, []);

  const getBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  const getOS = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown OS';
  };

  const getDeviceIcon = (device) => {
    if (device.includes('Android') || device.includes('iOS')) return FaMobileAlt;
    if (device.includes('iPad')) return FaTabletAlt;
    return FaDesktop;
  };

  const getOSIcon = (os) => {
    if (os.includes('Windows')) return FaWindows;
    if (os.includes('Mac')) return FaApple;
    if (os.includes('Linux')) return FaLinux;
    return FaDesktop;
  };

  const getBrowserIcon = (browser) => {
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
    if (!activity.success) return <FaExclamationTriangle className={styles.timelineIcon + ' ' + styles.warning} />;
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

  if (!user) {
    return <div>Loading...</div>;
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
            {loginHistory[0]?.timestamp && (
              <p className={styles.lastLogin}>
                Last login: {formatDistanceToNow(new Date(loginHistory[0].timestamp))} ago
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
                      {loginHistory[0]?.timestamp 
                        ? format(new Date(loginHistory[0].timestamp), 'PP')
                        : 'No activity'}
                    </div>
                    <p>{loginHistory[0]?.success ? 'Successful login' : 'Failed login attempt'}</p>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className={styles.securityTimeline}>
                  <h2>Login Activity</h2>
                  <div className={styles.timelineList}>
                    {loginHistory.map((activity, index) => (
                      <motion.div
                        key={index}
                        className={styles.timelineItem}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {getActivityIcon(activity)}
                        <div className={styles.timelineContent}>
                          <h4>
                            {activity.success ? 'Successful login' : 'Failed login attempt'}
                          </h4>
                          <p>
                            {activity.user_agent && (
                              <span className={styles.deviceInfo}>
                                {getBrowserIcon(getBrowser())} {getBrowser()} • 
                                {getOSIcon(getOS())} {getOS()}
                              </span>
                            )}
                            {activity.ip_address && ` • IP: ${activity.ip_address}`}
                          </p>
                          <span className={styles.timelineTime}>
                            {format(new Date(activity.timestamp), 'PPpp')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
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
                            <p className={styles.sessionIp}>IP: {session.ip_address}</p>
                            <span className={styles.timelineTime}>
                              Last active: {format(session.lastActive, 'PPpp')}
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