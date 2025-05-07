import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../../../api/api';
import LoadingSubmit from '../../../Components/Loading/loading';
import { Card, Button, Row, Col, ListGroup, Image, Modal } from 'react-bootstrap';
import { FaFilePdf, FaFileImage, FaArrowLeft } from 'react-icons/fa';
import kidBg from '../../../assets/campBg.png';
import './KidDetails.css';
import toast from 'react-hot-toast';

const DetailsKid = () => {
  const navigate = useNavigate();
  const [kid, setKid] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showDocument, setShowDocument] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [camp, setCamp] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const kidResponse = await axios.get(`${BASEURL}/kid/${id}`);
        setKid(kidResponse.data);
        
        if (kidResponse.data.idCamp) {
          const campResponse = await axios.get(`${BASEURL}/camp/${kidResponse.data.idCamp}`);
          setCamp(campResponse.data);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDocumentClick = (docUrl, docType) => {
    setCurrentDoc({ url: docUrl, type: docType });
    setShowDocument(true);
  };
  const renderFilePreview = (filePath, docType) => {
    if (!filePath) return <div className="text-muted">No document uploaded</div>;
    
    // Extract just the filename (remove "storage/kids/" prefix if present)
    const filename = filePath.replace(/^.*[\\\/]/, '');
    const extension = filename.split('.').pop().toLowerCase();
    const fileUrl = `${BASEURL}/kid/documents/${encodeURIComponent(filename)}`;
    
    return (
      <div 
        className="file-preview-container"
        onClick={() => handleDocumentClick(fileUrl, docType)}
        style={{ cursor: 'pointer' }}
      >
        {['pdf'].includes(extension) ? (
          <div className="file-preview">
            <FaFilePdf size={50} className="text-danger" />
            <div className="mt-2">View PDF</div>
          </div>
        ) : (
          <div className="file-preview">
            <img 
              src={fileUrl} 
              alt={`${docType} preview`} 
              className="preview-thumbnail"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "placeholder-image.jpg";
              }}
            />
            <div className="mt-2">View Document</div>
          </div>
        )}
      </div>
    );
  };

  if (loading) return <LoadingSubmit />;
  if (!kid) return <div className="text-center py-5">Loading kid details...</div>;

  const handleDownload = async () => {
    try {
      const filename = currentDoc.url.split('/').pop();
      const downloadUrl = `${BASEURL}/kid/documents/${encodeURIComponent(filename)}`;
      
      // Use fetch API to get the file as blob
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `${currentDoc.type}_${kid.kidName}.${filename.split('.').pop()}`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }, 100);
      
      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <div className="kid-details-container">
      <div className="kid-header" style={{ backgroundImage: `url(${kidBg})` }}></div>
      
      <div className="container py-4">
        <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
          <FaArrowLeft /> Back to Kids List
        </Button>

        <Card className="shadow-sm mb-4">
          <Card.Header as="h2" className="text-center bg-primary text-white">
            {kid.kidName}'s Details
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Father's Name:</strong> {kid.kidFather}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Mother's Name:</strong> {kid.kidMother}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Father's Phone:</strong> {kid.fatherNumber}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Father's Email:</strong> {kid.fatherMail || 'N/A'}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
              <Col md={6}>
                <ListGroup variant="flush">
                <ListGroup.Item>
        <strong>Camp:</strong> {camp ? camp.name : 'No camp assigned'}
      </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Age:</strong> {kid.kidAge} years
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Address:</strong> {kid.adresse}
                  </ListGroup.Item>
                </ListGroup>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <h3 className="mt-4 mb-3">Documents</h3>

        <Row>
        <Col md={3} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
              Personal Photo
              </Card.Header>
              <Card.Body className="text-center">
                {renderFilePreview(kid.photo, "Personal Photo")}
              </Card.Body>
            </Card>
          </Col>
          <Col md={3} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
              Birth Certificate
              </Card.Header>
              <Card.Body className="text-center">
                {renderFilePreview(kid.zayad, "Birth Certificate")}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
              Paternal Authorization 
              </Card.Header>
              <Card.Body className="text-center">
                {renderFilePreview(kid.tasrihAbawi, "Paternal Authorization ")}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={3} className="mb-4">
            <Card>
              <Card.Header className="bg-info text-white">
              Medical Certificate
              </Card.Header>
              <Card.Body className="text-center">
                {renderFilePreview(kid.chadaTibiya, "Medical Certificate")}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button 
            variant="primary" 
           onClick={() => navigate(`/dashboard/kid/add?campId=${id}`)}
          >
            Add Another Kid
          </Button>
        </div>
      </div>

      {/* Modal for document viewing */}
      <Modal 
        show={showDocument} 
        onHide={() => setShowDocument(false)}
        size="lg"
        centered
        fullscreen="md-down"
      >
        <Modal.Header closeButton>
          <Modal.Title>{currentDoc?.type} Document</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
  {currentDoc?.url && (
    currentDoc.url.split('.').pop().toLowerCase() === 'pdf' ? (
      <embed 
        src={currentDoc.url} 
        type="application/pdf" 
        width="100%" 
        height="500px" 
      />
    ) : (
      <img 
        src={currentDoc.url} 
        alt={currentDoc.type} 
        style={{ maxWidth: '100%', maxHeight: '80vh' }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "placeholder-image.jpg"; // Fallback image
        }}
      />
    )
  )}
</Modal.Body>
        <Modal.Footer>
  <Button 
    variant="primary" 
    onClick={handleDownload}
  >
    Download Document
  </Button>
  <Button variant="secondary" onClick={() => setShowDocument(false)}>
    Close
  </Button>
</Modal.Footer>
      </Modal>
    </div>
  );
};

export default DetailsKid;