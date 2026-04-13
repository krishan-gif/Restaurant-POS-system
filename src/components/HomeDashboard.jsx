import { useState, useEffect } from 'react';
import { TrendingUp, ShoppingBag, DollarSign, Clock, Calendar, BarChart3, CreditCard, Banknote, Smartphone } from 'lucide-react';

const TRENDING = [
  { id: 1, name: 'Truffle Burger', sales: 24, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80' },
  { id: 4, name: 'Pepperoni Pizza', sales: 18, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=100&q=80' },
  { id: 7, name: 'Mango Smoothie', sales: 15, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=100&q=80' },
];

const HomeDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todaysOrders = orders.filter(o => o.date === today);
  const totalIncomeToday = todaysOrders.reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = todaysOrders.filter(o => o.status !== 'Completed').length;
  const avgOrderValue = todaysOrders.length > 0 ? totalIncomeToday / todaysOrders.length : 0;

  // Calculate true Monthly and Annual totals from data
  const todayDateObj = new Date();
  const currentMonth = todayDateObj.getMonth();
  const currentYear = todayDateObj.getFullYear();

  const thisMonthOrders = orders.filter(o => {
    if (!o.date) return false;
    const orderDate = new Date(o.date);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });

  const thisYearOrders = orders.filter(o => {
    if (!o.date) return false;
    const orderDate = new Date(o.date);
    return orderDate.getFullYear() === currentYear;
  });

  const totalMonth = thisMonthOrders.reduce((sum, o) => sum + o.amount, 0);
  const totalYear = thisYearOrders.reduce((sum, o) => sum + o.amount, 0);

  const STATS = [
    { id: 1, label: 'Income Today', value: `Rs.${totalIncomeToday.toFixed(2)}`, icon: DollarSign, color: '#10b981' },
    { id: 2, label: 'Income This Month', value: `Rs.${totalMonth.toFixed(2)}`, icon: Calendar, color: '#8b5cf6' },
    { id: 3, label: 'Income This Year', value: `Rs.${totalYear.toFixed(2)}`, icon: BarChart3, color: '#06b6d4' },
    { id: 4, label: 'Orders Today', value: todaysOrders.length.toString(), icon: ShoppingBag, color: '#fb923c' },
    { id: 5, label: 'Avg Order Value', value: `Rs.${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: '#3b82f6' },
    { id: 6, label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: '#f43f5e' }
  ];

  const RECENT_ORDERS = orders.slice(0, 4).map(o => ({
    id: o.orderId,
    time: o.time,
    items: o.items ? o.items.reduce((sum, item) => sum + item.quantity, 0) : 0,
    total: o.amount,
    status: o.status
  }));

  const cardIncome = todaysOrders.filter(o => o.method === 'Card').reduce((sum, o) => sum + o.amount, 0);
  const cashIncome = todaysOrders.filter(o => o.method === 'Cash').reduce((sum, o) => sum + o.amount, 0);
  const otherIncome = todaysOrders.filter(o => o.method === 'Other').reduce((sum, o) => sum + o.amount, 0);

  const getPercentage = (amount) => totalIncomeToday > 0 ? Math.round((amount / totalIncomeToday) * 100) + '%' : '0%';

  const INCOME_BREAKDOWN = [
    { id: 1, method: 'Card Income', amount: `Rs.${cardIncome.toFixed(2)}`, percentage: getPercentage(cardIncome), icon: CreditCard, color: '#3b82f6' },
    { id: 2, method: 'Cash Income', amount: `Rs.${cashIncome.toFixed(2)}`, percentage: getPercentage(cashIncome), icon: Banknote, color: '#10b981' },
    { id: 3, method: 'Other (Digital)', amount: `Rs.${otherIncome.toFixed(2)}`, percentage: getPercentage(otherIncome), icon: Smartphone, color: '#8b5cf6' }
  ];

  return (
    <div className="home-dashboard animate-enter">
      {/* Stats Row */}
      <div className="stats-grid">
        {STATS.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.id} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-panel">
          <div className="panel-header">
            <h2>Recent Orders</h2>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="panel-body">
            {RECENT_ORDERS.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No orders today yet.</p> : RECENT_ORDERS.map(order => (
              <div key={order.id} className="order-row">
                <div className="order-id">{order.id}</div>
                <div className="order-time">{order.time}</div>
                <div className="order-items">{order.items} Items</div>
                <div className="order-total">Rs.{order.total.toFixed(2)}</div>
                <div className={`order-status Rs.${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Trending Items */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Trending Today</h2>
            </div>
            <div className="panel-body">
              {TRENDING.map(item => (
                <div key={item.id} className="trending-row">
                  <img src={item.image} alt={item.name} className="trending-img" />
                  <div className="trending-info">
                    <h4>{item.name}</h4>
                    <p>{item.sales} Orders</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="dashboard-panel">
            <div className="panel-header">
              <h2>Revenue by Method</h2>
            </div>
            <div className="panel-body">
              {INCOME_BREAKDOWN.map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="trending-row" style={{ alignItems: 'flex-start' }}>
                    <div className="stat-icon" style={{ width: '40px', height: '40px', backgroundColor: `Rs.{item.color}20`, color: item.color, flexShrink: 0 }}>
                      <Icon size={20} />
                    </div>
                    <div className="trending-info" style={{ flex: 1 }}>
                      <h4>{item.method}</h4>
                      <p>{item.percentage} of today's total</p>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {item.amount}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
