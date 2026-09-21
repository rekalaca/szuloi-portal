import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyByDzEGQ1lGiDMqxJ1Q3OIWfmde07AkINc",
  authDomain: "szechenyi-11d.firebaseapp.com",
  projectId: "szechenyi-11d",
  storageBucket: "szechenyi-11d.firebasestorage.app",
  messagingSenderId: "506566271248",
  appId: "1:506566271248:web:5c410dec40c2c162ad8595",
  measurementId: "G-S53RK5VRES"
};

async function testFirebaseConnection() {
  console.log('🔄 Kapcsolódás a Firebase Firestore felhőhöz...');
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const testRef = doc(db, '_connection_test', 'ping');
    const testData = {
      message: 'Sikeres kapcsolat a Széchenyi 11. D adatbázissal!',
      timestamp: new Date().toISOString(),
      status: 'OK'
    };

    // 1. Írás teszt
    console.log('📝 1. Teszt adatok írása (setDoc)...');
    await setDoc(testRef, testData);
    console.log('✅ Írás sikeres!');

    // 2. Olvasás teszt
    console.log('📖 2. Teszt adatok visszaolvasása (getDoc)...');
    const snap = await getDoc(testRef);
    if (snap.exists()) {
      console.log('✅ Olvasás sikeres! Beolvasott adat:', JSON.stringify(snap.data(), null, 2));
    } else {
      throw new Error('A teszt dokumentum nem található.');
    }

    // 3. Törlés (takarítás)
    console.log('🧹 3. Teszt dokumentum törlése...');
    await deleteDoc(testRef);
    console.log('✅ Törlés és takarítás sikeres!');

    console.log('\n🎉 EREDMÉNY: A Firebase Firestore kapcsolat 100%-ban működik és éles!');
  } catch (error) {
    console.error('❌ Hiba történt a Firebase teszt során:', error);
  }
}

testFirebaseConnection();
