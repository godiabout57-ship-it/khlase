import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  Timestamp,
  setDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// Collection names
const PRODUCTS_COLLECTION = "products";
const ORDERS_COLLECTION = "orders";

// --- Storage Functions ---

export const uploadImage = async (file: File | Blob, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

// --- Product Functions ---

export const getProducts = async () => {
  const q = query(collection(db, PRODUCTS_COLLECTION));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getProduct = async (id: string) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const addProduct = async (product: any) => {
  const { id, ...data } = product;
  // If id is provided and is a string, use it as document ID, otherwise auto-generate
  if (id && typeof id === 'string') {
     await setDoc(doc(db, PRODUCTS_COLLECTION, id), {
       ...data,
       createdAt: Timestamp.now()
     });
     return id;
  } else {
     const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
       ...data,
       createdAt: Timestamp.now()
     });
     return docRef.id;
  }
};

export const updateProduct = async (id: string, data: any) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await updateDoc(docRef, data);
};

export const deleteProduct = async (id: string) => {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- Order Functions ---

export const getOrders = async () => {
  const q = query(collection(db, ORDERS_COLLECTION), orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const addOrder = async (order: any) => {
  // 1. Add order to Firestore
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...order,
    date: Timestamp.now().toDate().toISOString() // Keep ISO string for compatibility or use Timestamp
  });

  // 2. Update product stock (quantities)
  for (const item of order.items) {
     const productRef = doc(db, PRODUCTS_COLLECTION, String(item.id));
     const productSnap = await getDoc(productRef);
     if (productSnap.exists()) {
        const currentQty = Number(productSnap.data().quantity) || 0;
        await updateDoc(productRef, {
          quantity: Math.max(0, currentQty - item.quantity)
        });
     }
  }

  return docRef.id;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(docRef, { status });
};
