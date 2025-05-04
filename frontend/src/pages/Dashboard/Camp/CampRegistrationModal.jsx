import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { BASEURL } from '../../../api/api';
import axios from 'axios';
import toast from 'react-hot-toast';

function CampRegistrationModal({ show, onHide }) {
  const [formData, setFormData] = useState({
    kidName: '',
    kidFather: '',
    kidMother: '',
    fatherNumber: '',
    fatherMail: '',
    kidAge: '',
    adresse: '',
    zayad: '',
    tasrihAbawi: '',
    chadaTibiya: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.kidName || !formData.kidFather || !formData.kidMother || !formData.fatherNumber || !formData.kidAge || !formData.adresse) {
      alert("Please fill all required fields!");
      return;
    }
  
    try {
      toast.success("Registration successful:");
      onHide();
    } catch (error) {
      toast.error("Failed to register. Please try again later.");
    }
  };
  

  return (
    
    <Modal
    
      show={show}
      onHide={onHide}
      size="lg"
      centered
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Kid Registration
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Kid Name*</Form.Label>
            <Form.Control name="kidName" value={formData.kidName} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Father's Name*</Form.Label>
            <Form.Control name="kidFather" value={formData.kidFather} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mother's Name*</Form.Label>
            <Form.Control name="kidMother" value={formData.kidMother} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Father's Phone Number*</Form.Label>
            <Form.Control name="fatherNumber" value={formData.fatherNumber} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Father's Email</Form.Label>
            <Form.Control type="email" name="fatherMail" value={formData.fatherMail} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Kid Age*</Form.Label>
            <Form.Control type="number" name="kidAge" value={formData.kidAge} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address*</Form.Label>
            <Form.Control name="adresse" value={formData.adresse} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Extra Info (Zayad)</Form.Label>
            <Form.Control name="zayad" value={formData.zayad} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Parent Authorization (Tasrih Abawi)</Form.Label>
            <Form.Control name="tasrihAbawi" value={formData.tasrihAbawi} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Medical Certificate (Chada Tibiya)</Form.Label>
            <Form.Control name="chadaTibiya" value={formData.chadaTibiya} onChange={handleChange} />
          </Form.Group>

          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" type="submit">
            Submit Registration
          </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CampRegistrationModal;
