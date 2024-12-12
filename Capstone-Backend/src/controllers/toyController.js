const { analyzeImage } = require('../services/googleVisionService');
const { getToyByLabel, saveImageToUploads, imageToBase64 } = require('../services/firestoreService');

// Handler untuk memproses gambar
const uploadToyHandler = async (request, h) => {
  try {
    const image = request.payload.image;

    // Validasi format file
    if (!image) {
      return h.response({ error: 'No file uploaded.' }).code(400);
    }

    const fileType = image.hapi.headers['content-type'];
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
      return h.response({ error: 'Invalid file type. Only JPG and PNG are allowed.' }).code(400);
    }

    // Simpan gambar ke direktori "uploads"
    const filePath = await saveImageToUploads(image);

    // Konversi gambar ke base64
    const base64Image = await imageToBase64(filePath);

    // Analisis gambar menggunakan Google Vision API
    const visionResponse = await analyzeImage(base64Image);
    const labels = visionResponse.labelAnnotations.map((label) => label.description.toLowerCase());

    // Cari mainan berdasarkan label yang diperoleh
    let toyDescription = null;
    for (const label of labels) {
      toyDescription = await getToyByLabel(label);
      if (toyDescription) break; // Keluar dari loop jika ditemukan
    }

    if (!toyDescription) {
      return h.response({
        labels,
        message: 'No matching toy found in the database.',
      }).code(404);
    }

    return h.response({
      labels,
      toy: toyDescription,
    }).code(200);
  } catch (error) {
    console.error('Error during upload:', error);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

module.exports = { uploadToyHandler };
