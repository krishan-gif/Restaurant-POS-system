import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

// Fetching orders from API
const OrdersDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  }, []);

  const filteredOrders = orders.filter(
    (order) => filter === 'All' || order.status === filter
  );

  const cycleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Preparing' ? 'Ready' : 'Completed';
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: nextStatus } : order
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing': return <Clock size={16} />;
      case 'Ready': return <AlertCircle size={16} />;
      case 'Completed': return <CheckCircle2 size={16} />;
      default: return null;
    }
  };

  return (
    <div className="orders-dashboard animate-enter">
      <div className="orders-header-bar">
        <div className="status-filters">
          {['All', 'Preparing', 'Ready', 'Completed'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="empty-orders">No orders found for this status.</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={`order-card ${order.status.toLowerCase()}`}>
              <div className="order-card-header">
                <h3>{order.orderId}</h3>
                <span className="order-time">{order.time}</span>
              </div>

              <div className="order-status-badge">
                {getStatusIcon(order.status)}
                {order.status}
              </div>

              <div className="order-items-list">
                {order.items && order.items.map((item, index) => (
                  <div key={index} className="order-item-row">{item.quantity}x {item.name}</div>
                ))}
              </div>

              <div className="order-card-footer">
                <div className="order-total-price">Rs.{order.amount.toFixed(2)}</div>
                {order.status !== 'Completed' && (
                  <button
                    className="action-btn"
                    onClick={() => cycleStatus(order.id, order.status)}
                  >
                    Mark {order.status === 'Preparing' ? 'Ready' : 'Completed'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersDashboard;
