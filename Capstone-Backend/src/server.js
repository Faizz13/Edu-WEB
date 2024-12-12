require('dotenv').config();
const Hapi = require('@hapi/hapi');
const { analyzeImage } = require('./services/googleVisionService');
const { getToyByLabel, saveContactForm } = require('./services/firestoreService');

// Fungsi untuk mengonversi stream menjadi base64
const streamToBase64 = (stream) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
    stream.on('error', reject);
  });
};

const server = Hapi.server({
  port: 4159,
  host: '0.0.0.0',
  routes: {
    cors: {
      origin: ['*'], // Mengizinkan akses dari semua domain
    },
  },
});

const init = async () => {
  // Rute API untuk upload file
  server.route({
    method: 'POST',
    path: '/upload',
    handler: async (request, h) => {
      try {
        const { image } = request.payload;

        // Validasi: Pastikan file diunggah
        if (!image) {
          return h.response({ error: 'No image uploaded' }).code(400);
        }

        // Validasi: Pastikan file adalah gambar
        if (!image.hapi.filename || !image.hapi.headers['content-type'].startsWith('image/')) {
          return h.response({ error: 'Invalid file type. Only images are allowed.' }).code(400);
        }

        console.log('File received:', image.hapi);

        const base64Image = await streamToBase64(image);

        // Proses analisis gambar menggunakan Google Vision API
        let visionResponse;
        try {
          visionResponse = await analyzeImage(base64Image);
        } catch (error) {
          console.error('Error processing image with Google Vision:', error);
          return h.response({ error: 'Error processing image with Google Vision' }).code(500);
        }

        const labels = visionResponse.labelAnnotations.map((label) => label.description.toLowerCase());
        console.log('Labels from Google Vision:', labels);

        let toyDescription = null;
        let matchingToys;
        try {
          matchingToys = await Promise.all(
            labels.map((label) => getToyByLabel(label))
          );
        } catch (error) {
          console.error('Error fetching toys from Firestore:', error);
          return h.response({ error: 'Error fetching toys from Firestore' }).code(500);
        }

        const validToys = matchingToys.filter((toy) => toy);
        console.log('Matching toys from Firestore:', validToys);

        if (validToys.length > 0) {
          toyDescription = validToys.reduce((bestMatch, toy) => {
            const matchCount = toy.labels.filter((label) => labels.includes(label)).length;
            return matchCount > (bestMatch?.matchCount || 0)
              ? { ...toy, matchCount }
              : bestMatch;
          }, null);

          if (toyDescription?.matchCount < 2) {
            toyDescription = null;
          }
        }

        console.log('Selected toy:', toyDescription);

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
        console.error('Error during upload:', error.message, error.stack);
        return h.response({ error: 'Internal Server Error' }).code(500);
      }
    },
    options: {
      payload: {
        output: 'stream', 
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 10 * 1024 * 1024, 
      },
    },
  });

  // Rute API untuk halaman kontak
  server.route({
    method: 'POST',
    path: '/contact',
    handler: async (request, h) => {
      try {
        const { name, email, message } = request.payload;

        if (!name || !email || !message) {
          return h.response({ error: 'Semua field harus diisi' }).code(400);
        }

        const contactId = await saveContactForm(name, email, message);

        return h.response({ message: 'Terima kasih telah menghubungi kami!', contactId }).code(200);
      } catch (error) {
        console.error('Error saat menangani formulir kontak:', error.message, error.stack);
        return h.response({ error: 'Terjadi Kesalahan pada Server' }).code(500);
      }
    },
    options: {
      payload: {
        parse: true, 
        allow: 'application/json', 
      },
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
