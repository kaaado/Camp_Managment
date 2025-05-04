import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import LoadingSubmit from '../../../components/Loading/loading';
import toast from 'react-hot-toast';
import { BASEURL } from '../../../api/api';
import axios from 'axios';

export default function AddCamp() {
  const [formData, setFormData] = useState({
    name: "",
    place: "",
    dateStart: "",
    endDate: "",
    associatorName: "",
    type: "",
    customType: "",
    maxcap: "",
    agecapmax: "",
    agecapmin: "",
    team: "",
    program: "",
    rules: ""
  });

  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const focus = useRef(null);

  useEffect(() => {
    focus.current.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    
    if (name === "type" && value !== "other") {
      setFormData(prev => ({
        ...prev,
        customType: "" 
      }));
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    
    const submissionData = {
      ...formData,
      type: formData.type === "other" ? formData.customType : formData.type
    };
  
    try {
      const res = await axios.post(`${BASEURL}/camp/add`, submissionData);
      toast.success(res.data.message || "Camp created successfully");
      nav("/dashboard/camps");
    } catch (err) {
      setLoading(false);
      console.log(err);
      toast.error(err.response?.data?.error || "Failed to create camp");
    }
  }

  // Required fields validation
  const isFormValid = () => {
    return (
      formData.name.length > 0 &&
      formData.place.length > 0 &&
      formData.dateStart &&
      formData.endDate &&
    formData.associatorName.length > 0 
    );
  };

  return (
    <>
      {loading && <LoadingSubmit />}
      <div className="bg-white p-2 w-100">
        <h1>Add Camp</h1>
      <Form className="bg-white w-100 mx-2 p-3" onSubmit={handleSubmit}>
        {/* Required Fields */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Camp Name*</Form.Label>
          <Form.Control
            name="name"
            type="text"
            placeholder="Enter camp name"
            value={formData.name}
            onChange={handleChange}
            required
            ref={focus}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="place">
          <Form.Label>Place*</Form.Label>
          <Form.Control
            name="place"
            type="text"
            placeholder="Enter place"
            value={formData.place}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="dateStart">
          <Form.Label>Start Date*</Form.Label>
          <Form.Control
            name="dateStart"
            type="date"
            max={formData.endDate} 
            value={formData.dateStart}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="endDate">
          <Form.Label>End Date*</Form.Label>
          <Form.Control
            name="endDate"
            type="date"
            min={formData.dateStart} 
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="associatorName">
          <Form.Label>Associator Name*</Form.Label>
          <Form.Control
            name="associatorName"
            type="text"
            placeholder="Enter associator name"
            value={formData.associatorName}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="type">
  <Form.Label>Camp Type</Form.Label>
  <div className="d-flex">
    <Form.Select
      name="type"
      value={formData.type}
      onChange={handleChange}
      style={{ flex: 1 }}
    >
      <option value="">Select camp type</option>
      <option value="summer">Summer Camp</option>
      <option value="winter">Winter Camp</option>
      <option value="sports">Sports Camp</option>
      <option value="other">Other (specify)</option>
    </Form.Select>
    {formData.type === "other" && (
      <Form.Control
        name="customType"
        type="text"
        value={formData.customType}
        onChange={handleChange}
        placeholder="Enter custom type"
        style={{ flex: 1, marginLeft: "10px" }}
      />
    )}
  </div>
</Form.Group>

        <Form.Group className="mb-3" controlId="maxcap">
          <Form.Label>Maximum Capacity</Form.Label>
          <Form.Control
            name="maxcap"
            type="number"
            min={1}
            placeholder="Enter maximum capacity"
            value={formData.maxcap}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="agecapmin">
          <Form.Label>Minimum Age</Form.Label>
          <Form.Control
            name="agecapmin"
            type="number"
            min={0}
            max={formData.agecapmax} 
            placeholder="Enter minimum age"
            value={formData.agecapmin}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="agecapmax">
          <Form.Label>Maximum Age</Form.Label>
          <Form.Control
            name="agecapmax"
            type="number"
            min={formData.agecapmin} 
            placeholder="Enter maximum age"
            value={formData.agecapmax}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="team">
          <Form.Label>Team</Form.Label>
          <Form.Control
            name="team"
            type="text"
            placeholder="Enter team details"
            value={formData.team}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="program">
          <Form.Label>Program</Form.Label>
          <Form.Control
            name="program"
            as="textarea"
            rows={3}
            placeholder="Enter program details"
            value={formData.program}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="rules">
          <Form.Label>Rules</Form.Label>
          <Form.Control
            name="rules"
            as="textarea"
            rows={3}
            placeholder="Enter camp rules"
            value={formData.rules}
            onChange={handleChange}
          />
        </Form.Group>

        <Button
          disabled={!isFormValid() || loading}
          className="mt-3 w-100"
          variant="outline-primary"
          type="submit"
        >
          {loading ? "Adding..." : "Add Camp"}
        </Button>

       
      </Form>
      </div>
    </>
  );
}