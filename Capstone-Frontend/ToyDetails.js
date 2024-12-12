import React, { useEffect, useState } from 'react';
import { FaPlay, FaAward, FaShareAlt, FaArrowUp, FaRegHeart } from 'react-icons/fa';
import { Button, Card, ListGroup, Spinner, Row, Col, Toast, Modal } from 'react-bootstrap';
import 'animate.css';

const ToyDetails = ({ toyData }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!toyData)
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  const { name, description, playInstructions, benefits, imageUrl } = toyData.toy;

  const formattedPlayInstructions = playInstructions.split('\n').map((step, index) => (
    <ListGroup.Item key={index} className="border-0 py-2">
      {step}
    </ListGroup.Item>
  ));

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out this toy: ${name}`,
          text: `Explore how to play ${name} and its benefits!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      setShowToast(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`container my-5 ${isVisible ? 'animate__animated animate__zoomIn' : ''}`}>
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          {/* Toast Notification */}
          <Toast
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={3000}
            autohide
            style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }}
          >
            <Toast.Body>Web Share API not supported on your device.</Toast.Body>
          </Toast>

          {/* Toy Title */}
          <Card
            className="shadow-lg border-0 overflow-hidden mb-4"
            style={{
              maxWidth: '850px',
              margin: 'auto',
              borderRadius: '15px',
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            }}
          >
            <Card.Body className="p-5 text-center">
              <Card.Title className="text-primary mb-4 display-4">{name}</Card.Title>
              <Card.Text className="text-muted fs-5">{description}</Card.Text>
              {imageUrl && (
                <Card.Img
                  variant="top"
                  src={imageUrl}
                  className="rounded mb-4"
                  style={{ height: 'auto', maxWidth: '100%' }}
                />
              )}
            </Card.Body>
          </Card>

          {/* Detail Sections */}
          <Row className="g-4">
            <Col md={6} sm={12}>
              {/* Play Instructions */}
              <Card
                className="shadow-lg border-0"
                style={{
                  maxWidth: '100%',
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  borderRadius: '15px',
                  backgroundColor: '#f8f9fa',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Card.Body>
                  <h5 className="d-flex align-items-center text-secondary fs-4 mb-3">
                    <FaPlay className="me-2" />
                    Play Instructions
                  </h5>
                  <ListGroup variant="flush" className="text-start">
                    {formattedPlayInstructions}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} sm={12}>
              {/* Benefits */}
              <Card
                className="shadow-lg border-0"
                style={{
                  maxWidth: '100%',
                  transition: 'transform 0.3s ease',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                  borderRadius: '15px',
                  backgroundColor: '#f8f9fa',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <Card.Body>
                  <h5 className="d-flex align-items-center text-secondary fs-4 mb-3">
                    <FaAward className="me-2" />
                    Benefits
                  </h5>
                  <Card.Text className="fs-5">{benefits}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Share Button */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-primary"
              size="lg"
              className="d-flex align-items-center p-3 text-uppercase shadow-sm"
              style={{ transition: 'background-color 0.3s ease, transform 0.2s ease' }}
              onClick={handleShare}
            >
              <FaShareAlt className="me-2" />
              Share This Toy
            </Button>
          </div>

          {/* Like Button (Clickable) */}
          <div className="d-flex justify-content-center mt-4">
            <Button
              variant="outline-danger"
              size="lg"
              className="d-flex align-items-center p-3 text-uppercase shadow-sm"
              onClick={() => alert('You liked this toy!')}
              style={{ transition: 'background-color 0.3s ease' }}
            >
              <FaRegHeart className="me-2" />
              Like This Toy
            </Button>
          </div>

          {/* Back to Top Button */}
          <div className="text-center mt-5">
            <Button
              variant="primary"
              className="rounded-circle shadow"
              style={{ width: '50px', height: '50px' }}
              onClick={scrollToTop}
            >
              <FaArrowUp />
            </Button>
          </div>

          {/* Modal for More Information */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{name} - More Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Card.Text>{description}</Card.Text>
              <h5 className="mt-4">Play Instructions</h5>
              <ListGroup variant="flush" className="text-start">
                {formattedPlayInstructions}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ToyDetails;
