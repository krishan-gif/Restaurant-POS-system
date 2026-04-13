import express from 'express';
import cors from 'cors';
import db from './database.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get Menu Items
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM menu_items', [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add Menu Item
app.post('/api/menu', (req, res) => {
  const { name, category, price, image } = req.body;
  db.run(`INSERT INTO menu_items (name, category, price, image) VALUES (?, ?, ?, ?)`,
    [name, category, price, image], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: this.lastID, name, category, price, image });
    });
});

// Update Menu Item
app.put('/api/menu/:id', (req, res) => {
  const { name, category, price, image } = req.body;
  const { id } = req.params;
  db.run(`UPDATE menu_items SET name = ?, category = ?, price = ?, image = ? WHERE id = ?`,
    [name, category, price, image, id], function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: Number(id), name, category, price, image });
    });
});

// Delete Menu Item
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM menu_items WHERE id = ?`, [id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Item deleted' });
  });
});

// Create Order
app.post('/api/orders', (req, res) => {
  const { orderId, method, amount, items, status } = req.body;
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  
  // Format time properly to match frontend (e.g. 10:45 AM)
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const time = `${hours}:${minutes} ${ampm}`;

  db.run(`INSERT INTO orders (orderId, method, amount, date, time, status) VALUES (?, ?, ?, ?, ?, ?)`,
    [orderId, method, amount, date, time, status || 'Ready'], function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const insertedOrderId = this.lastID;
      
      const stmt = db.prepare('INSERT INTO order_items (order_id, menu_item_name, quantity) VALUES (?, ?, ?)');
      items.forEach(item => {
        stmt.run([insertedOrderId, item.name, item.quantity]);
      });
      stmt.finalize();
      
      res.json({ id: insertedOrderId, orderId });
  });
});

// Get Expanded Orders (includes items) for Orders Dashboard & Income Sheet
app.get('/api/orders', (req, res) => {
    db.all('SELECT orders.*, order_items.menu_item_name, order_items.quantity FROM orders LEFT JOIN order_items ON orders.id = order_items.order_id ORDER BY orders.id DESC', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        // Group rows by order
        const ordersMap = {};
        rows.forEach(row => {
            if (!ordersMap[row.id]) {
                ordersMap[row.id] = {
                    id: row.id,
                    orderId: row.orderId,
                    method: row.method,
                    amount: row.amount,
                    date: row.date,
                    time: row.time,
                    status: row.status,
                    items: []
                };
            }
            if (row.menu_item_name) {
                ordersMap[row.id].items.push({
                    name: row.menu_item_name,
                    quantity: row.quantity
                });
            }
        });
        // Convert to array
        const sortedOrders = Object.values(ordersMap).sort((a,b) => b.id - a.id);
        res.json(sortedOrders);
    });
});

// Update Order Status
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ id, status });
  });
});

// Clear Data
app.delete('/api/orders', (req, res) => {
    db.serialize(() => {
        db.run('DELETE FROM order_items');
        db.run('DELETE FROM orders');
        res.json({ message: 'All orders cleared' });
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
