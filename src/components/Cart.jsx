import { Minus, Plus, Trash2 } from 'lucide-react';

const Cart = ({ items, onUpdateQuantity, onCheckout }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% Tax
  const total = subtotal + tax;

  return (
    <aside className="cart-panel">
      <div className="cart-header">
        <h2>Current Order</h2>
      </div>

      <div className="cart-items">
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
            Cart is empty. Add items from the menu.
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="cart-item animate-enter">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              
              <div className="cart-item-info">
                <p className="cart-item-name">{item.name}</p>
                <p className="cart-item-price">${item.price.toFixed(2)}</p>
              </div>

              <div className="qty-control">
                <button 
                  className="qty-btn" 
                  onClick={() => onUpdateQuantity(item.id, -1)}
                >
                  {item.quantity === 1 ? <Trash2 size={16} color="var(--danger)" /> : <Minus size={16} />}
                </button>
                <span className="qty">{item.quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => onUpdateQuantity(item.id, 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal</span>
          <span>Rs.{subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax (8%)</span>
          <span>Rs.{tax.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>Rs.{total.toFixed(2)}</span>
        </div>

        <button 
          className="checkout-btn" 
          onClick={onCheckout}
          disabled={items.length === 0}
          style={{ opacity: items.length === 0 ? 0.5 : 1 }}
        >
          Proceed to Checkout
        </button>
      </div>
    </aside>
  );
};

export default Cart;
