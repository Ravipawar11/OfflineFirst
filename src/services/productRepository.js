import { doc, getFirestore, setDoc } from '@react-native-firebase/firestore';
import { getDB } from '../db/sqlite';

const dbFirestore = getFirestore();

/**
 * Read products — always from SQLite (works offline).
 * Firestore is only the sync source.
 */
export const getProducts = async () => {
  const db = await getDB();
  const [res] = await db.executeSql(`SELECT * FROM products ORDER BY name`);
  const out = [];
  for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
  return out;
};

/**
 * Upsert a product locally and mark pending. If online, try immediate push.
 */
export const saveProduct = async (product, isOnline) => {
  const db = await getDB();
  const updatedAt = Date.now();

  await db.executeSql(
    `INSERT OR REPLACE INTO products (id, name, price, stock, updated_at, sync_status)
     VALUES (?, ?, ?, ?, ?, 'pending_update')`,
    [product.id, product.name, product.price, product.stock, updatedAt]
  );

  if (isOnline) {
    try {
      await setDoc(doc(dbFirestore, 'products', product.id),
        { name: product.name, price: product.price, stock: product.stock, updated_at: updatedAt },
        { merge: true }
      );
      await db.executeSql(`UPDATE products SET sync_status = 'synced' WHERE id = ?`, [product.id]);
    } catch (e) {
      // stays pending — sync service will retry
    }
  }
};
