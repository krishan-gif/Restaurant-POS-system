import { Home, Pizza, Coffee, ClipboardList, Settings, FileText } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'menu', icon: Pizza, label: 'Menu' },
    { id: 'orders', icon: ClipboardList, label: 'Orders' },
    { id: 'reports', icon: FileText, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-icon" style={{ padding: '20px 0', display: 'flex', justifyContent: 'center' }}>
        <img src="/logo.png" alt="KCH Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
      </div>
      
      <nav className="nav-items">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button 
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <IconComponent size={24} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
