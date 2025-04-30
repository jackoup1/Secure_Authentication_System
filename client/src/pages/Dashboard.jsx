import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaHistory, 
  FaSignOutAlt, 
  FaExclamationTriangle,
  FaCheckCircle,
  FaGlobe
} from 'react-icons/fa';
import { format, formatDistanceToNow } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Layout/Header';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [loginHistory, setLoginHistory] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load login history from localStorage
    const lastLogin = JSON.parse(localStorage.getItem('lastLogin') || 'null');
    const failedLogins = JSON.parse(localStorage.getItem('failedLogins') || '[]');
    
    // Combine and sort login attempts
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

  const handleSessionTerminate = async (sessionId) => {
    if (sessionId === 'current') {
      await logout();
      return;
    }
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  const getActivityIcon = (activity) => {
    if (!activity.success) return <FaExclamationTriangle className="text-warning" />;
    switch (activity.type) {
      case 'login':
        return <FaCheckCircle className="text-success" />;
      case 'password_changed':
        return <FaShieldAlt />;
      case 'location_change':
        return <FaGlobe />;
      default:
        return <FaHistory />;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="container">
        <div className="dashboard-header">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="welcome-section"
          >
            <h1>Welcome back, {user?.username || 'User'}!</h1>
            {loginHistory[0]?.timestamp && (
              <p className="last-login">
                Last login: {formatDistanceToNow(new Date(loginHistory[0].timestamp))} ago
              </p>
            )}
          </motion.div>

          <div className="quick-actions">
            <button className="btn btn-outline" onClick={() => setActiveTab('security')}>
              <FaShieldAlt /> Security Settings
            </button>
            <button className="btn btn-danger" onClick={logout}>
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security
          </button>
          <button
            className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
            onClick={() => setActiveTab('sessions')}
          >
            Active Sessions
          </button>
        </div>

        <AnimatePresence mode="sync">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="dashboard-content"
          >
            {activeTab === 'overview' && (
              <div className="overview-grid">
                <div className="stat-card">
                  <h3>Account Status</h3>
                  <div className="status-badge success">Protected</div>
                  <p>Your account has all security features enabled</p>
                </div>
                <div className="stat-card">
                  <h3>Active Sessions</h3>
                  <div className="stat-number">{sessions.length}</div>
                  <p>Device{sessions.length !== 1 ? 's' : ''} currently signed in</p>
                </div>
                <div className="stat-card">
                  <h3>Recent Activity</h3>
                  <div className="stat-date">
                    {loginHistory[0]?.timestamp 
                      ? format(new Date(loginHistory[0].timestamp), 'PP')
                      : 'No recent activity'}
                  </div>
                  <p>{loginHistory[0]?.success ? 'Successful login' : 'Failed login attempt'}</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="security-section">
                <h2>Login Activity</h2>
                <div className="activity-list">
                  {loginHistory.map((activity, index) => (
                    <motion.div
                      key={index}
                      className="activity-item"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="activity-icon">
                        {getActivityIcon(activity)}
                      </div>
                      <div className="activity-details">
                        <h4>
                          {activity.success ? 'Successful login' : 'Failed login attempt'}
                        </h4>
                        <p>
                          {activity.user_agent && `${getBrowser()} • ${getOS()}`}
                          {activity.ip_address && ` • IP: ${activity.ip_address}`}
                        </p>
                        <span className="activity-time">
                          {format(new Date(activity.timestamp), 'PPpp')}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'sessions' && (
              <div className="sessions-section">
                <h2>Active Sessions</h2>
                <div className="sessions-list">
                  {sessions.map(session => (
                    <motion.div
                      key={session.id}
                      className="session-item"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="session-info">
                        <h4>{session.device}</h4>
                        <p>{session.location}</p>
                        <p className="session-ip">IP: {session.ip_address}</p>
                        <span className="session-time">
                          Last active: {format(session.lastActive, 'PPpp')}
                        </span>
                        {session.current && (
                          <span className="current-badge">Current Session</span>
                        )}
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleSessionTerminate(session.id)}
                      >
                        {session.current ? 'Sign Out' : 'Terminate'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;