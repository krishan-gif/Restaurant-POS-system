import { useState, useEffect } from 'react';
import { Store, Receipt, Printer, Users, LayoutList, Edit, Trash2, Plus } from 'lucide-react';

const SettingsDashboard = () => {
  const [activeTab, setActiveTab] = useState('menu');

  // Menu Management State
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Burgers', price: '', image: '' });

  useEffect(() => {
    if (activeTab === 'menu') {
      fetchMenuItems();
    }
  }, [activeTab]);

  const fetchMenuItems = () => {
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error(err));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', category: 'Burgers', price: '', image: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, category: item.category, price: item.price, image: item.image });
    setShowModal(true);
  };

  const handleSave = async () => {
    const url = editingId ? `/api/menu/${editingId}` : '/api/menu';
    const method = editingId ? 'PUT' : 'POST';
    
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, price: Number(formData.price) || 0})
      });
      setShowModal(false);
      fetchMenuItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await fetch(`/api/menu/${id}`, { method: 'DELETE' });
        fetchMenuItems();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="settings-dashboard animate-enter">
      <div className="settings-sidebar">
        <button 
          className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <Store size={20} />
          <span>General</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          <LayoutList size={20} />
          <span>Menu Management</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'tax' ? 'active' : ''}`}
          onClick={() => setActiveTab('tax')}
        >
          <Receipt size={20} />
          <span>Tax & Fees</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'printers' ? 'active' : ''}`}
          onClick={() => setActiveTab('printers')}
        >
          <Printer size={20} />
          <span>Printers & KDS</span>
        </button>
        <button 
          className={`settings-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={20} />
          <span>Staff Accounts</span>
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'general' && (
          <div className="settings-panel animate-enter">
            <h2>General Settings</h2>
            <p className="settings-desc">Manage your restaurant details and basic configuration.</p>
            
            <div className="form-group">
              <label>Restaurant Name</label>
              <input type="text" defaultValue="KCH Restaurant" />
            </div>
            
            <div className="form-group">
              <label>Store Address</label>
              <input type="text" defaultValue="123 Innovation Drive, Tech District" />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input type="tel" defaultValue="(555) 123-4567" />
            </div>

            <button className="save-btn">Save Changes</button>
          </div>
        )}

        {activeTab === 'menu' && (
          <div className="settings-panel animate-enter" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <div>
                 <h2>Menu Management</h2>
                 <p className="settings-desc" style={{ marginBottom: 0 }}>Add, edit, or remove items from your POS menu.</p>
               </div>
               <button className="save-btn" onClick={openAddModal} style={{ marginTop: 0, display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <Plus size={18} /> Add Item
               </button>
            </div>

            <div className="hardware-list" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', paddingRight: '10px' }}>
              {menuItems.map(item => (
                <div key={item.id} className="hardware-item" style={{ display: 'flex', alignItems: 'center', padding: '12px 1rem' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                  <div className="hardware-info" style={{ marginLeft: '1rem', flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{item.name}</h4>
                    <p style={{ color: 'var(--text-muted)' }}>{item.category} • Rs. {item.price}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="edit-btn" onClick={() => openEditModal(item)} style={{ padding: '8px', backgroundColor: 'var(--bg-panel)' }}><Edit size={16}/></button>
                    <button className="edit-btn" style={{ color: '#ef4444', padding: '8px', backgroundColor: 'var(--bg-panel)' }} onClick={() => handleDelete(item.id)}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              {menuItems.length === 0 && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No menu items found. Add some!</p>
              )}
            </div>
            
            {showModal && (
               <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ zIndex: 1000 }}>
                 <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Item' : 'Add New Item'}</h2>
                    <div className="form-group">
                       <label>Item Name</label>
                       <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Cheese Burger" />
                    </div>
                    <div className="form-group">
                       <label>Category</label>
                       <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'white', outline: 'none' }}>
                         <option>Burgers</option>
                         <option>Pizza</option>
                         <option>Salads</option>
                         <option>Drinks</option>
                         <option>Desserts</option>
                       </select>
                    </div>
                    <div className="form-group">
                       <label>Price (Rs.)</label>
                       <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="e.g. 500" />
                    </div>
                    <div className="form-group">
                       <label>Image URL</label>
                       <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." />
                    </div>
                    
                    {formData.image && (
                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Image Preview</p>
                        <img src={formData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => e.target.style.display = 'none'} onLoad={(e) => e.target.style.display = 'inline-block'} />
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                       <button className="save-btn" style={{ flex: 1, backgroundColor: 'transparent', border: '1px solid var(--border)', marginTop: 0 }} onClick={() => setShowModal(false)}>Cancel</button>
                       <button className="save-btn" style={{ flex: 1, marginTop: 0 }} onClick={handleSave}>Save Item</button>
                    </div>
                 </div>
               </div>
            )}
          </div>
        )}

        {activeTab === 'tax' && (
          <div className="settings-panel animate-enter">
            <h2>Tax & Fees Configuration</h2>
            <p className="settings-desc">Set up your default tax rates and service charges.</p>
            
            <div className="form-group">
              <label>Default Tax Rate (%)</label>
              <input type="number" defaultValue="8.00" step="0.01" />
            </div>

            <div className="form-group row-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Apply Tax to Dine-in Orders</span>
              </label>
            </div>

            <div className="form-group row-group">
              <label className="checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Apply Tax to Takeaway Orders</span>
              </label>
            </div>

            <button className="save-btn">Save Changes</button>
          </div>
        )}

        {activeTab === 'printers' && (
          <div className="settings-panel animate-enter">
            <h2>Hardware Integrations</h2>
            <p className="settings-desc">Manage connected receipt and kitchen printers.</p>
            
            <div className="hardware-list">
              <div className="hardware-item">
                <div className="hardware-info">
                  <h4>Front Desk Receipt Printer</h4>
                  <p>Epson TM-T88VI (Network: 192.168.1.55)</p>
                </div>
                <div className="status-indicator online">Online</div>
              </div>
              <div className="hardware-item">
                <div className="hardware-info">
                  <h4>Hot Kitchen Station KDS</h4>
                  <p>iPad Pro 12.9" (App Version: 2.1.0)</p>
                </div>
                <div className="status-indicator online">Online</div>
              </div>
            </div>

            <button className="add-hardware-btn">+ Add Device</button>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="settings-panel animate-enter">
            <h2>Staff Access Management</h2>
            <p className="settings-desc">Control who has access to the POS and their permissions.</p>
            
            <div className="hardware-list">
              <div className="hardware-item">
                <div className="hardware-info">
                  <h4>Sarah Jenkins</h4>
                  <p>Role: Manager (Full Access)</p>
                </div>
                <button className="edit-btn">Edit</button>
              </div>
              <div className="hardware-item">
                <div className="hardware-info">
                  <h4>Mike Torres</h4>
                  <p>Role: Server (Order Taking Only)</p>
                </div>
                <button className="edit-btn">Edit</button>
              </div>
            </div>

            <button className="add-hardware-btn">+ Add Staff Member</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsDashboard;
