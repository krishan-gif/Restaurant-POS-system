import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'pos.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        category TEXT,
        price REAL,
        image TEXT
      )
    `, (err) => {
      if (!err) {
        // Seed initial data if empty
        db.get('SELECT count(*) as count FROM menu_items', (err, row) => {
          if (row.count === 0) {
            const stmt = db.prepare('INSERT INTO menu_items (name, category, price, image) VALUES (?, ?, ?, ?)');
            const initialItems = [
              ['Truffle Burger', 'Burgers', 300, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80'],
              ['Spicy Chicken Sandwich', 'Burgers', 200, 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=300&q=80'],
              ['Margherita Pizza', 'Pizza', 500, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=300&q=80'],
              ['Pepperoni Pizza', 'Pizza', 800, 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80'],
              ['Caesar Salad', 'Salads', 900, 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&q=80'],
              ['Mango Smoothie', 'Drinks', 700, 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=300&q=80']
            ];
            initialItems.forEach(item => stmt.run(item));
            stmt.finalize();
          }
        });
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId TEXT,
        method TEXT,
        amount REAL,
        date TEXT,
        time TEXT,
        status TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        menu_item_name TEXT,
        quantity INTEGER,
        FOREIGN KEY(order_id) REFERENCES orders(id)
      )
    `);
  }
});

export default db;
