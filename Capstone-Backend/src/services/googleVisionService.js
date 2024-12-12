const vision = require('@google-cloud/vision');
const { Readable } = require('stream');

// Membuat client untuk Google Vision API
const client = new vision.ImageAnnotatorClient();

// Fungsi untuk menganalisis gambar menggunakan Google Vision API
async function analyzeImage(base64Image) {
  try {
    // Mengonversi base64 menjadi buffer
    const image = Buffer.from(base64Image, 'base64');

    // Menjalankan analisis label menggunakan Google Vision API
    const [result] = await client.labelDetection(image);

    // Mengembalikan hasil analisis
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Google Vision API error');
  }
}

// Fungsi untuk mengonversi stream menjadi base64
function imageToBase64(imageStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    
    // Menggunakan stream untuk membaca data dari imageStream
    imageStream.on('data', chunk => chunks.push(chunk));
    imageStream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    imageStream.on('error', reject);
  });
}

module.exports = { analyzeImage, imageToBase64 };
