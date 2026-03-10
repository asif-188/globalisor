import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Compliance Box', icon: '📊' },
    { id: 'onboarding', label: 'Client Onboarding', icon: '👤' },
    { id: 'registration', label: 'Business Registration', icon: '📝' },
    { id: 'incorporation', label: 'Incorporation', icon: '🏢' },
    { id: 'compliance', label: 'Compliance Monitoring', icon: '⚖️' },
    { id: 'filings', label: 'Annual Returns', icon: '📅' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">G</div>
        <div className="brand-info">
          <h2 className="brand-name">Globalisor</h2>
          <span className="brand-tagline">Sg Compliance Engine</span>
        </div>
      </div>

      <div className="nav-group">
        <p className="nav-title">Platform</p>
        <nav className="sidebar-nav">
          {menuItems.slice(0, 1).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="nav-group">
        <p className="nav-title">Business Services</p>
        <nav className="sidebar-nav">
          {menuItems.slice(1, 4).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="nav-group">
        <p className="nav-title">Administration</p>
        <nav className="sidebar-nav">
          {menuItems.slice(4).map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">AD</div>
          <div className="user-details">
            <p className="user-name">Mohd Asif</p>
            <p className="user-status">Senior Admin</p>
          </div>
          <span className="status-dot"></span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
