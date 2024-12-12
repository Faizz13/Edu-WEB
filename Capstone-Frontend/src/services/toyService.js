import axios from 'axios';

export const uploadToyImage = async (formData) => {
  try {
    const response = await axios.post('https://backend14-769290320822.asia-southeast2.run.app/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    throw new Error("Upload failed");
  }
};
