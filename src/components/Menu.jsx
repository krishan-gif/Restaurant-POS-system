import { Plus } from 'lucide-react';

const Menu = ({ items, onAdd }) => {
  if (items.length === 0) {
    return <div style={{ color: 'var(--text-muted)' }}>No items found.</div>;
  }

  return (
    <div className="menu-grid animate-enter">
      {items.map((item) => (
        <div key={item.id} className="menu-item">
          <img src={item.image} alt={item.name} className="item-img" />
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price">Rs.{item.price.toFixed(2)}</p>

          <button
            className="add-btn"
            onClick={() => onAdd(item)}
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Menu;
