import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Menu from './components/Menu';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import HomeDashboard from './components/HomeDashboard';
import OrdersDashboard from './components/OrdersDashboard';
import SettingsDashboard from './components/SettingsDashboard';
import IncomeSheet from './components/IncomeSheet';

// Mock Data removed, now fetching from API

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Salads', 'Drinks', 'Desserts'];

function App() {
  const [activeTab, setActiveTab] = useState('menu');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (activeTab === 'menu') {
      fetch('/api/menu')
        .then(res => res.json())
        .then(data => setMenuItems(data))
        .catch(err => console.error("Error fetching menu:", err));
    }
  }, [activeTab]);

  // Derived state for menu filtering
  const filteredMenu = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeCategory, searchQuery]);

  // Cart Operations
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const completeCheckout = async (method) => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (subtotal * 0.08); // Include 8% tax
    const orderId = `#${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          method,
          amount: parseFloat(total.toFixed(2)),
          items: cart
        })
      });
      setShowCheckout(false);
      clearCart();
    } catch (err) {
      console.error(err);
      setShowCheckout(false);
      clearCart();
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="main-area">
        <header className="header">
          <div>
            <h1>{activeTab === 'menu' ? 'Choose Order' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Welcome back, ready for service!</p>
          </div>
          {activeTab === 'menu' && (
            <div className="search-bar">
              <Search size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </header>

        {activeTab === 'menu' ? (
          <>
            <div className="category-filter">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <Menu items={filteredMenu} onAdd={addToCart} />
          </>
        ) : activeTab === 'home' ? (
          <HomeDashboard />
        ) : activeTab === 'orders' ? (
          <OrdersDashboard />
        ) : activeTab === 'reports' ? (
          <IncomeSheet />
        ) : activeTab === 'settings' ? (
          <SettingsDashboard />
        ) : null}
      </main>

      {activeTab === 'menu' && (
        <Cart 
          items={cart} 
          onUpdateQuantity={updateQuantity} 
          onCheckout={handleCheckout} 
        />
      )}

      {showCheckout && (
        <CheckoutModal 
          onClose={() => setShowCheckout(false)} 
          onConfirm={completeCheckout} 
        />
      )}
    </div>
  );
}

export default App;
