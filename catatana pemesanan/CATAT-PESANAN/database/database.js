import * as SQLite from 'expo-sqlite';

let dbPromise = SQLite.openDatabaseAsync('orders.db');

export const initDB = async () => {
  try {
    const db = await dbPromise;
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        product TEXT NOT NULL,
        price REAL NOT NULL,
        qty REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Sedang Diproses',
        date TEXT NOT NULL
      );
    `);
    console.log("Tabel orders berhasil diinisialisasi.");
    return true;
  } catch (error) {
    console.error("Gagal membuat tabel:", error);
    throw error;
  }
};

export const getOrders = async () => {
  try {
    const db = await dbPromise;
    const allRows = await db.getAllAsync('SELECT * FROM orders ORDER BY id DESC;');
    return allRows;
  } catch (error) {
    console.error("Gagal mengambil data orders:", error);
    throw error;
  }
};

export const addOrder = async (name, product, price, qty, total) => {
  try {
    const db = await dbPromise;
    const date = new Date().toLocaleDateString();
    const result = await db.runAsync(
      'INSERT INTO orders (name, product, price, qty, total, status, date) VALUES (?, ?, ?, ?, ?, ?, ?);',
      name, product, price, qty, total, 'Sedang Diproses', date
    );
    return {
      id: result.lastInsertRowId,
      name,
      product,
      price,
      qty,
      total,
      status: 'Sedang Diproses',
      date,
    };
  } catch (error) {
    console.error("Gagal menambah data order:", error);
    throw error;
  }
};

export const deleteOrder = async (id) => {
  try {
    const db = await dbPromise;
    await db.runAsync('DELETE FROM orders WHERE id = ?;', id);
  } catch (error) {
    console.error("Gagal menghapus data order:", error);
    throw error;
  }
};

export const finishOrder = async (id) => {
  try {
    const db = await dbPromise;
    await db.runAsync("UPDATE orders SET status = 'Selesai' WHERE id = ?;", id);
  } catch (error) {
    console.error("Gagal menyelesaikan order:", error);
    throw error;
  }
};
