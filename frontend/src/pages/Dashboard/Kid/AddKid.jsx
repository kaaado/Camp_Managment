import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import LoadingSubmit from '../../../Components/Loading/loading';
import { BASEURL } from '../../../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddKid = () => {
  // Form data state
  const [formData, setFormData] = useState({
    kidName: "",
    kidFather: "",
    kidMother: "",
    fatherNumber: "",
    fatherMail: "",
    kidAge: "",
    adresse: "",
  });

  // Files state with previews
  const [files, setFiles] = useState({
    zayad: null,
    tasrihAbawi: null,
    chadaTibiya: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    zayad: "",
    tasrihAbawi: "",
    chadaTibiya: "",
  });

  const [loading, setLoading] = useState(false);
  const focusRef = useRef(null);
  const nav=useNavigate()

  useEffect(() => {
    focusRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      const file = fileList[0];
      setFiles(prev => ({ ...prev, [name]: file }));
      
      // Create preview URL
      setFilePreviews(prev => ({
        ...prev,
        [name]: URL.createObjectURL(file)
      }));
    }
  };

  const validateForm = () => {
   
    formData.fatherNumber.length!== 10 && toast.error("Phone number must be 10 digits long");
    // Phone number validation (numbers only)
    if (!/^\d+$/.test(formData.fatherNumber)) {
      toast.error("Phone number should contain only numbers");
      return false;
    }

    // Email validation
    if (formData.fatherMail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.fatherMail)) {
      toast.error("Please enter a valid email address");
      return false;
    }


    // Required files check
    if (!files.zayad || !files.tasrihAbawi || !files.chadaTibiya) {
      toast.error("All documents are required");
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;


    setLoading(true);
    const data = new FormData();

    // Append form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    // Append files
    Object.entries(files).forEach(([key, file]) => {
      if (file) data.append(key, file);
    });

    try {
      const res = await axios.post(`${BASEURL}/kid/add`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Kid added successfully!");
      nav("/dashboard/kids");
      setFormData({
        kidName: "",
        kidFather: "",
        kidMother: "",
        fatherNumber: "",
        fatherMail: "",
        kidAge: "",
        adresse: "",
      });
      setFiles({
        zayad: null,
        tasrihAbawi: null,
        chadaTibiya: null,
      });
      setFilePreviews({
        zayad: "",
        tasrihAbawi: "",
        chadaTibiya: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
 
          
      {loading && <LoadingSubmit />}
      <div className="bg-white p-2 w-100">
      <h1>Add Kid</h1>
      <Form className="bg-white w-100 mx-2 p-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="kidName">
          <Form.Label>Kid Name</Form.Label>
          <Form.Control
            ref={focusRef}
            name="kidName"
            type="text"
            placeholder="Enter Kid Name"
            value={formData.kidName}
            onChange={handleChange}
            minLength="2"
            required
          />
          
        </Form.Group>

        <Form.Group className="mb-3" controlId="kidFather">
          <Form.Label>Father Name</Form.Label>
          <Form.Control
            name="kidFather"
            type="text"
            placeholder="Enter Father Name"
            value={formData.kidFather}
            onChange={handleChange}
            minLength="2"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="kidMother">
          <Form.Label>Mother Name</Form.Label>
          <Form.Control
            name="kidMother"
            type="text"
            placeholder="Enter Mother Name"
            value={formData.kidMother}
            onChange={handleChange}
            minLength="2"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="fatherNumber">
          <Form.Label>Father Phone Number</Form.Label>
          <Form.Control
            name="fatherNumber"
            type="number"
            min={0}
            placeholder="Enter Phone Number"
            value={formData.fatherNumber}
            onChange={handleChange}
            pattern="\d+"
            minLength={10}
            maxLength={10}
            required
          />
          
        </Form.Group>

        <Form.Group className="mb-3" controlId="fatherMail">
          <Form.Label>Father Email (Optional)</Form.Label>
          <Form.Control
            name="fatherMail"
            type="email"
            placeholder="Enter Email"
            value={formData.fatherMail}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="kidAge">
          <Form.Label>Kid Age</Form.Label>
          <Form.Control
            name="kidAge"
            type="number"
            placeholder="Enter Age"
            value={formData.kidAge}
            onChange={handleChange}
            min={0}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="adresse">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="adresse"
            placeholder="Enter Address"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </Form.Group>

        {/* File uploads with previews */}
        {['zayad', 'tasrihAbawi', 'chadaTibiya'].map((fileType) => (
          <Form.Group key={fileType} className="mb-3" controlId={fileType}>
            <Form.Label>{fileType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Form.Label>
            <div className="d-flex flex-row gap-2 align-items-center">
              {filePreviews[fileType] && (
                <img 
                  src={filePreviews[fileType]} 
                  width={80} 
                  height={80} 
                  alt={`${fileType} preview`} 
                  className="rounded fade-in" 
                  style={{ objectFit: 'cover' }}
                />
              )}
              <Form.Control
                name={fileType}
                type="file"
                onChange={handleFileChange}
                required
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <Form.Text className="text-muted">
              PDF, JPG, or PNG files only
            </Form.Text>
          </Form.Group>
        ))}

        <Button 
          type="submit" 
          className="mt-3 w-100"
          variant="outline-primary"
          disabled={loading || !formData.kidName.length>2 || !formData.kidFather.length>2 || !formData.kidMother.length>2 || !formData.fatherNumber.length==10 || !formData.kidAge || !formData.adresse.length>2}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </Form>
      </div>
    </>
  );
};

export default AddKid;