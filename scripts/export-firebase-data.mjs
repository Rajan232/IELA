import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Firebase credentials loaded from environment or fallback
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "dummy-api-key-for-development",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "energy-law-association-india.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "energy-law-association-india",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "energy-law-association-india.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "dummy",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "dummy"
};

async function exportFirebaseData() {
  console.log("Starting Firebase Firestore data export...");
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const collections = ["advisory_committee", "steering_committee", "team"];
  const exportResult = {};

  for (const colName of collections) {
    try {
      console.log(`Exporting collection: ${colName}...`);
      const querySnapshot = await getDocs(collection(db, colName));
      exportResult[colName] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log(`Fetched ${exportResult[colName].length} items from ${colName}.`);
    } catch (e) {
      console.warn(`Failed to export ${colName} (or empty):`, e.message);
      exportResult[colName] = [];
    }
  }

  const outDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outputPath = path.join(outDir, "firestore-export.json");
  fs.writeFileSync(outputPath, JSON.stringify(exportResult, null, 2));
  console.log(`Export complete! Data saved to ${outputPath}`);
}

exportFirebaseData().catch(err => {
  console.error("Firebase export error:", err);
});
