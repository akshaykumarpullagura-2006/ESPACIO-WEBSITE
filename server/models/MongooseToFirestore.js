import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, writeBatch } from 'firebase/firestore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyA1ISD8zLtXM7K3XA9nVP6UCfG93g3mOAA",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "espacio-website-admin-portal.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "espacio-website-admin-portal",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "espacio-website-admin-portal.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "946292247242",
  appId: process.env.FIREBASE_APP_ID || "1:946292247242:web:a7b87df956fcdcfaad8233",
  measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-W9NFMWGBKF"
};

// Initialize Firebase
let app;
let db = null;
try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('Firebase SDK initialized successfully on server using web configuration.');
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (e) {
  console.error('Failed to initialize Firebase SDK:', e.message);
}

export class FirestoreModelAdapter {
  constructor(collectionName) {
    this.collectionName = collectionName.toLowerCase() + 's';
  }

  get col() {
    if (!db) {
      throw new Error(`Firestore is not initialized. Please check credentials.`);
    }
    return collection(db, this.collectionName);
  }

  _toDoc(docSnap) {
    if (!docSnap.exists()) return null;
    const data = docSnap.data();
    return {
      _id: docSnap.id,
      id: docSnap.id,
      ...data,
      comparePassword: async function(candidatePassword) {
        if (!this.password) return false;
        return await bcrypt.compare(candidatePassword, this.password);
      }
    };
  }

  find(filter = {}) {
    const sanitizedFilter = { ...filter };
    delete sanitizedFilter.softDelete; // Mongoose defaults

    let limitNum = null;
    let skipNum = 0;

    const chain = {
      select: () => chain,
      sort: () => chain,
      limit: (n) => {
        limitNum = n;
        return chain;
      },
      skip: (n) => {
        skipNum = n;
        return chain;
      },
      populate: () => chain,
      lean: () => chain,
      then: async (resolve, reject) => {
        try {
          if (!db) {
            return resolve([]);
          }
          let queryRef = this.col;
          let whereClauses = [];
          
          Object.keys(sanitizedFilter).forEach(key => {
            let val = sanitizedFilter[key];
            if (val !== undefined && val !== null) {
              if (typeof val === 'object' && val.$regex) {
                // Skip regex in firestore queries
              } else {
                whereClauses.push(where(key, '==', val));
              }
            }
          });

          if (whereClauses.length > 0) {
            queryRef = query(queryRef, ...whereClauses);
          }
          
          const snap = await getDocs(queryRef);
          let docs = [];
          snap.forEach(d => {
            const docData = this._toDoc(d);
            if (docData) {
              let matches = true;
              Object.keys(sanitizedFilter).forEach(key => {
                let filterVal = sanitizedFilter[key];
                if (filterVal && typeof filterVal === 'object' && filterVal.$regex) {
                  const reg = new RegExp(filterVal.$regex, filterVal.$options || 'i');
                  if (!reg.test(docData[key])) matches = false;
                }
              });
              if (matches) docs.push(docData);
            }
          });

          if (skipNum) {
            docs = docs.slice(skipNum);
          }
          if (limitNum !== null) {
            docs = docs.slice(0, limitNum);
          }

          resolve(docs);
        } catch (err) {
          if (reject) reject(err);
        }
      },
      catch: (reject) => {
        chain.then(null, reject);
        return chain;
      }
    };

    return chain;
  }

  async findOne(filter = {}) {
    const docs = await this.find(filter);
    return docs.length > 0 ? docs[0] : null;
  }

  async findById(id) {
    if (!db || !id) return null;
    const docSnap = await getDoc(doc(db, this.collectionName, id));
    return this._toDoc(docSnap);
  }

  async create(data) {
    if (!db) return data;
    const payload = {
      ...data,
      softDelete: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Hash password if we are creating a User
    if (this.collectionName === 'users' && payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.password = await bcrypt.hash(payload.password, salt);
    }

    const docRef = await addDoc(collection(db, this.collectionName), payload);
    return { _id: docRef.id, id: docRef.id, ...payload };
  }

  async findByIdAndUpdate(id, data, options = {}) {
    if (!db || !id) return null;
    const docRef = doc(db, this.collectionName, id);
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(docRef, payload);
    const docSnap = await getDoc(docRef);
    return this._toDoc(docSnap);
  }

  async findByIdAndDelete(id) {
    if (!db || !id) return null;
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    const deleted = this._toDoc(docSnap);
    await deleteDoc(docRef);
    return deleted;
  }

  async deleteMany(filter = {}) {
    if (!db) return;
    const snap = await getDocs(this.col);
    const batch = writeBatch(db);
    snap.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }

  async countDocuments(filter = {}) {
    if (!db) return 0;
    const snap = await getDocs(this.col);
    return snap.size;
  }
}
