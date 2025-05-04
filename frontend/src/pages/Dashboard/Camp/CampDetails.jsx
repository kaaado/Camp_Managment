import { useEffect, useState } from 'react';
import campBg from '../../../assets/campBg.png';
import './CampDetails.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../../../api/api';
import LoadingSubmit from '../../../Components/Loading/loading';
import { FaArrowLeft, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaChild, FaClipboardList, FaRegListAlt, FaUserFriends } from 'react-icons/fa';
import { Card, Button, Row, Col, ListGroup, Badge } from 'react-bootstrap';

const CampDetails = () => {
  const navigate = useNavigate();
  const [camp, setCamp] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASEURL}/camp/${id}`)
      .then((response) => {
        setCamp(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSubmit />;
  if (!camp) return <div className="text-center py-5">Loading camp details...</div>;

  return (
    <>
      <div className="camp-container">
        <div className="camp-header" style={{ backgroundImage: `url(${campBg})` }}>
          <div className="header-overlay">
            <h1 className="camp-title">{camp.name}</h1>
          </div>
        </div>
        
        <div className="container py-4">
          <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
            <FaArrowLeft /> Back to Camps List
          </Button>

          <Row className="g-4">
            {/* Left Column - Basic Info */}
            <Col md={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h3>Camp Information</h3>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaUserFriends className="me-3 text-primary" size={20} />
                        <div>
                          <strong>Associator Name</strong>
                          <div>{camp.associatorName}</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaMapMarkerAlt className="me-3 text-primary" size={20} />
                        <div>
                          <strong>Location</strong>
                          <div>{camp.place}</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-3 text-primary" size={20} />
                        <div>
                          <strong>Date</strong>
                          <div>{camp.datestart} - {camp.enddate}</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaUsers className="me-3 text-primary" size={20} />
                        <div>
                          <strong>Max Capacity</strong>
                          <div>{camp.maxcap} children</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <FaChild className="me-3 text-primary" size={20} />
                        <div>
                          <strong>Age Range</strong>
                          <div>{camp.agecapmin} - {camp.agecapmax} years</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                    
                    <ListGroup.Item>
                      <div className="d-flex align-items-center">
                        <Badge bg="info" className="me-3">
                          Type
                        </Badge>
                        <div>{camp.type}</div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Program, Rules, Team */}
            <Col md={6}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h3><FaClipboardList className="me-2" /> Program</h3>
                </Card.Header>
                <Card.Body>
                  {camp.program ? (
                    <ListGroup>
                      {camp.program.split(",").map((item, index) => (
                        <ListGroup.Item key={index}>
                          <div className="d-flex">
                            <span className="me-2">•</span>
                            {item.trim()}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-muted">No program details available</div>
                  )}
                </Card.Body>
              </Card>

              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <h3><FaRegListAlt className="me-2" /> Rules</h3>
                </Card.Header>
                <Card.Body>
                  {camp.rules ? (
                    <ListGroup>
                      {camp.rules.split(",").map((item, index) => (
                        <ListGroup.Item key={index}>
                          <div className="d-flex">
                            <span className="me-2">•</span>
                            {item.trim()}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-muted">No rules specified</div>
                  )}
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h3><FaUserFriends className="me-2" /> Team</h3>
                </Card.Header>
                <Card.Body>
                  {camp.team ? (
                    <ListGroup>
                      {camp.team.split(",").map((item, index) => (
                        <ListGroup.Item key={index}>
                          <div className="d-flex">
                            <span className="me-2">•</span>
                            {item.trim()}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <div className="text-muted">No team assigned</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => navigate("/dashboard/kid/add")}
            >
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampDetails;