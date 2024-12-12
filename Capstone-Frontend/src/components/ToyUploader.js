import React, { useState } from 'react';
import { Button, Card, Form, ProgressBar, Alert } from 'react-bootstrap';
import { FaCloudUploadAlt } from 'react-icons/fa'; // Ikon upload yang lebih keren
import { useDropzone } from 'react-dropzone';
import { uploadToyImage } from '../services/toyService';
import { motion } from 'framer-motion'; // Untuk animasi
import { useSpring, animated } from 'react-spring'; // Untuk animasi lainnya

const ToyUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
      setErrorMessage('');
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage('');
    setUploadMessage('Uploading your toy... Please wait.');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadToyImage(formData, (progressEvent) => {
        if (progressEvent.lengthComputable) {
          setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
        }
      });

      if (response && response.data) {
        setUploadMessage('Upload successful! Toy has been added.');
        onUploadSuccess(response.data, response.imageUrl);
      } else {
        setUploadMessage('Error: No data received.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('This is not a traditional toy.');
    } finally {
      setIsUploading(false);
    }
  };

  // Animasi gambar menggunakan React Spring
  const animationProps = useSpring({
    opacity: imagePreview ? 1 : 0,
    transform: imagePreview ? 'scale(1)' : 'scale(0.8)',
    config: { tension: 300, friction: 25 },
  });

  return (
    <motion.div
      className="upload-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Card className="shadow-lg p-5 rounded mb-5" style={{ background: '#f7f9fc' }}>
        <motion.h2
          className="text-center text-primary mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <FaCloudUploadAlt className="me-2" />
          Upload Toy Image
        </motion.h2>

        <Form onSubmit={handleSubmit} className="upload-form">
          {/* Drag-and-Drop Area */}
          <div
            {...getRootProps()}
            className={`drag-drop-area ${isUploading ? 'disabled' : ''}`}
            style={{
              border: '2px dashed #007bff',
              borderRadius: '15px',
              padding: '30px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f0f4f8',
              transition: 'all 0.3s ease-in-out',
              marginBottom: '20px',
              boxShadow: '0px 6px 20px rgba(0, 123, 255, 0.1)',
            }}
          >
            <input {...getInputProps()} />
            <p className="text-muted">Drag & Drop or Click to Upload an Image</p>
            <FaCloudUploadAlt className="display-4 text-primary" />
          </div>

          {/* Menampilkan Pesan Error atau Berhasil */}
          {errorMessage && (
            <Alert variant="danger" className="animate__animated animate__fadeIn animate__delay-2s">
              {errorMessage}
            </Alert>
          )}

          {uploadMessage && !isUploading && (
            <Alert variant="success" className="animate__animated animate__fadeIn animate__delay-2s">
              {uploadMessage}
            </Alert>
          )}

          {/* Tombol Upload */}
          <Button
            variant="primary"
            type="submit"
            disabled={isUploading || !file}
            className="w-100 mb-3"
            style={{
              background: '#007bff',
              border: 'none',
              padding: '15px',
              fontSize: '16px',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            {isUploading ? 'Uploading...' : 'Upload Toy Image'}
          </Button>
        </Form>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-3">
            <ProgressBar animated now={uploadProgress} label={`${Math.round(uploadProgress)}%`} />
          </div>
        )}

        {/* Preview Image with Framer Motion */}
        {imagePreview && (
          <animated.div style={animationProps}>
            <img
              src={imagePreview}
              alt="Toy Preview"
              className="toy-image-preview rounded shadow-lg"
              style={{
                width: '100%',
                maxWidth: '350px',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '0px 6px 20px rgba(0, 123, 255, 0.2)',
              }}
            />
          </animated.div>
        )}
      </Card>

      {/* Animasi tambahan saat upload */}
      {isUploading && (
        <div className="text-center mt-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ToyUploader;
