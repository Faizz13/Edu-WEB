import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Navbar, Nav, Container, Row, Col, Spinner, Alert, Button, Form, Card
} from 'react-bootstrap';
import ToyUploader from './components/ToyUploader';
import ToyDetails from './components/ToyDetails';
import { FaRobot, FaEnvelope, FaHome, FaInfoCircle } from 'react-icons/fa';
import axios from 'axios';
import 'animate.css';  // Make sure to import animate.css for animations

const App = () => {
  const [toyData, setToyData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  // Simulasi waktu loading saat meng-upload
  useEffect(() => {
    setTimeout(() => setIsAppLoaded(true), 2000);
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 1200);
    }
  }, [isLoading]);

  const handleUploadSuccess = (data, image) => {
    setIsLoading(true);
    setToyData(data);
    setImagePreview(image);
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await axios.post('https://backend14-769290320822.asia-southeast2.run.app/contact', contactForm);
      alert('Your message has been sent!');
      setContactForm({ name: '', email: '', message: '' });
    } catch (error) {
      setError('Failed to send message');
    }
  };

  if (!isAppLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
<Navbar bg="dark" variant="dark" expand="lg" className="shadow-lg sticky-top">
  <Container>
    <Navbar.Brand href="#home" className="fw-bold text-white d-flex align-items-center animate__animated animate__fadeIn animate__delay-1s">
      <FaRobot className="me-2" /> Edu-WEB
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto">
        <Nav.Link 
          href="#home" 
          className="text-white fs-5 me-3 nav-link-hover animate__animated animate__fadeIn animate__delay-2s"
        >
          <FaHome className="me-1" /> Home
        </Nav.Link>
        <Nav.Link 
          href="#about" 
          className="text-white fs-5 me-3 nav-link-hover animate__animated animate__fadeIn animate__delay-3s"
        >
          <FaInfoCircle className="me-1" /> About
        </Nav.Link>
        <Nav.Link 
          href="#contact" 
          className="text-white fs-5 me-3 nav-link-hover animate__animated animate__fadeIn animate__delay-4s"
        >
          <FaEnvelope className="me-1" /> Contact
        </Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


      {/* Main Content */}
      <Container fluid className="py-5">
        <Row className="justify-content-center fade-in">
          <Col md={11} lg={10} xl={9} className="text-center">
            <div className="mb-5">
              <h1 className="display-3 text-primary fw-bold animate__animated animate__fadeIn animate__delay-1s">
                <FaRobot className="me-3" />
                Traditional Toy Scanner
              </h1>
              <p className="lead text-muted mb-5 animate__animated animate__fadeIn animate__delay-1s">
                Upload and scan your traditional toys to learn about their features and history!
              </p>
            </div>

            {/* Toy Uploader Section */}
            <div className="mb-5">
              <Card className="shadow-lg p-4 rounded-3 animate__animated animate__fadeInUp" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <Card.Body>
                  <h4 className="text-center mb-3 text-primary">Upload Your Toy</h4>
                  <ToyUploader onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
                </Card.Body>
              </Card>
            </div>

            {/* Error handling */}
            {error && (
              <Alert variant="danger" className="animate__animated animate__fadeInUp">
                {error}
              </Alert>
            )}

            {/* Loading Spinner */}
            {isLoading && (
              <div className="text-center my-5">
                <Spinner animation="border" variant="primary" size="lg" />
                <p className="mt-3 text-muted">Processing your toy...</p>
              </div>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <img src={imagePreview} alt="Toy Preview" className="img-fluid rounded shadow-lg animate__animated animate__fadeInUp" />
              </div>
            )}

            {/* Toy Details */}
            {toyData && !isLoading && (
              <div className="mb-5">
                <ToyDetails toyData={toyData} />
              </div>
            )}
          </Col>
        </Row>

        {/* About Section */}
        <Row id="about" className="justify-content-center mt-5">
          <Col md={8} lg={6}>
            <Card className="shadow-lg p-4 text-center animate__animated animate__fadeInUp">
              <Card.Body>
                <Card.Title className="text-primary mb-4">About the Edu-WEB</Card.Title>
                <Card.Text className="text-muted">
                In this application, users can easily scan or upload an image of any traditional toy, and within moments, receive detailed information about its history, how it’s used, and its significance in the culture from which it originates. As you explore this collection, you will discover the deep connection between traditional toys and the various ethnic groups that inhabit Indonesia, from the Javanese, Balinese, and Batak, to the Dayak, Toraja, and beyond.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contact Form Section */}
        <Row id="contact" className="justify-content-center mt-5 mb-5">
          <Col md={8} lg={6} xl={5}>
            <Card className="shadow-lg p-4">
              <Card.Body>
                <h2 className="mb-4 text-primary text-center animate__animated animate__fadeInUp">
                  <FaEnvelope className="me-2" />
                  Contact Us
                </h2>
                <Form onSubmit={handleSubmitContact}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={contactForm.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={contactForm.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </Form.Group>
                  <Form.Group controlId="formMessage" className="mb-3">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={contactForm.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Your message here"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" className="w-100 mt-3">
                    Send Message
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

{/* Footer */}
<footer className="bg-dark text-white py-5 mt-5">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 text-center">
        <p className="h4 mb-4 animate__animated animate__fadeIn animate__delay-1s">Connect with Us</p>
        <div className="d-flex justify-content-center">
          {/* LinkedIn Icon */}
          <a href="https://www.linkedin.com/in/faiz-naufal-s-504910273/" target="_blank" className="text-white me-4 fs-3 animate__animated animate__pulse animate__infinite animate__delay-1s">
            <i className="fab fa-linkedin"></i>
          </a>

          {/* GitHub Icon */}
          <a href="https://github.com/Faizz13" target="_blank" className="text-white me-4 fs-3 animate__animated animate__pulse animate__infinite animate__delay-1.2s">
            <i className="fab fa-github"></i>
          </a>

          {/* Twitter Icon */}
          <a href="https://www.twitter.com" target="_blank" className="text-white fs-3 animate__animated animate__pulse animate__infinite animate__delay-1.4s">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </div>

    <div className="row justify-content-center mt-4">
      <div className="col-12 col-md-6 text-center">
        <p className="mb-0 animate__animated animate__fadeIn animate__delay-1.6s">&copy; 2024 Traditional Toy Scanner. All Rights Reserved.</p>
        <p className="small text-muted animate__animated animate__fadeIn animate__delay-1.8s">Designed with care & passion for learning and growth.</p>
      </div>
    </div>
  </div>
</footer>

    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
