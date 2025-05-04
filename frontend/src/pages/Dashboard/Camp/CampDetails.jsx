import { useEffect, useState } from 'react';
import campBg from '../../../assets/campBg.png';
import './CampDetails.css'; 
import CampRegistrationModal from './CampRegistrationModal'; 
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { BASEURL } from '../../../api/api';

const CampDetails = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [camp, setCamp] = useState("");
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

  return (
    <div className="camp-container">
      <div className="camp-header" style={{ backgroundImage: `url(${campBg})` }}></div>
      <div className="container">
        <h1 className="camp-title mt-4">{camp.name}</h1>

        <div className="camp-details">
          <div className="left-side">
            <h3>Associator Name</h3>
            <p>{camp.associatorName}</p>

            <h3>Location</h3>
            <p>{camp.place}</p>

            <h3>Date</h3>
            <p>{camp.datestart} - {camp.enddate}</p>

            <h3>Max Capacity</h3>
            <p>{camp.maxcap} child</p>

            <h3>Age Range</h3>
            <p>{camp.agecapmin} ans - {camp.agecapmax} ans</p>

           
          </div>

          <div className="right-side">
            <h3>Type</h3>
            <p>{camp.type}</p>
            <h3>Program</h3>
            <ul className="list-group">
              {camp.program 
                ? camp.program.split(",").map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item.trim()}
                  </li>
                ))
                : <li className="list-group-item">No program details</li>
              }
            </ul>

            <h3 className="mt-1">Rules</h3>
            <ul className="list-group">
              {camp.rules 
                ? camp.rules.split(",").map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item.trim()}
                  </li>
                ))
                : <li className="list-group-item">No rules specified</li>
              }
            </ul>

            <h3 className="mt-1">Team</h3>
            <ul className="list-group">
              {camp.team 
                ? camp.team.split(",").map((item, index) => (
                  <li key={index} className="list-group-item">
                    {item.trim()}
                  </li>
                ))
                : <li className="list-group-item">No team assigned</li>
              }
            </ul>
           
          </div>
        </div>

        <div className="mx-0  d-flex justify-content-center gap-3">
          <button onClick={() => navigate('/dashboard/camps')} className="register-btn bg-secondary">
            Back
          </button>
          <button onClick={() => setShowModal(true)} className="register-btn d-flex">
            Register Now
          </button>
        </div>

        <CampRegistrationModal
          show={showModal}
          onHide={() => setShowModal(false)}
        />
      </div>
    </div>
  );
};

export default CampDetails;
