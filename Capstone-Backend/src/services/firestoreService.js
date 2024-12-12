const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore(); // Menghubungkan ke Firestore

// Fungsi untuk mengambil mainan berdasarkan label
async function getToyByLabel(label) {
  try {
    const toyRef = db.collection('toys');

    // Mengambil mainan yang labelnya mengandung string yang dicari
    const querySnapshot = await toyRef.where('labels', 'array-contains', label).get();

    // Jika tidak ada mainan yang ditemukan
    if (querySnapshot.empty) {
      console.log(`No toys found with label: ${label}`);
      return null;
    }

    // Menampilkan semua mainan yang ditemukan
    const toys = querySnapshot.docs.map((doc) => doc.data());

    // Jika Anda ingin memilih mainan dengan kecocokan terbaik, bisa menggunakan logika di sini
    const bestMatch = toys.reduce((best, current) => {
      const matchCount = current.labels.filter((l) => l === label).length;
      return matchCount > best.matchCount ? { ...current, matchCount } : best;
    }, { matchCount: 0 });

    return bestMatch; // Kembalikan mainan yang paling relevan
  } catch (error) {
    console.error('Error getting toy by label:', error);
    throw new Error('Firestore query error'); // Berikan pesan yang lebih jelas jika terjadi kesalahan
  }
}

// Fungsi untuk menyimpan data formulir kontak ke Firestore
async function saveContactForm(name, email, message) {
  try {
    const contactRef = db.collection('contacts');
    const docRef = await contactRef.add({
      name,
      email,
      message,
      createdAt: Firestore.Timestamp.now(),
    });

    console.log(`Contact form saved with ID: ${docRef.id}`);
    return docRef.id; // Mengembalikan ID dokumen yang baru disimpan
  } catch (error) {
    console.error('Error saving contact form:', error);
    throw new Error('Firestore write error'); // Pesan kesalahan lebih jelas
  }
}

module.exports = { getToyByLabel, saveContactForm };
