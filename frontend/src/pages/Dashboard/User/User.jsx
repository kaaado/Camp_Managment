import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL } from "../../../api/api";
import toast from "react-hot-toast";
import { Button } from "react-bootstrap";
import LoadingSubmit from "../../../components/Loading/loading";


export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);


  
  
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const response = await axios.get(`${BASEURL}/user/${id}`);
        const user = response.data;
        setName(user.name);
        setMail(user.mail);
        setType(user.type);

       
      } catch (err) {
        console.error(err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);
 
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(`${BASEURL}/user/${id}`, {
        name,
        mail,
        password,
        type,
      });

      
      toast.success("User updated successfully!");
    
        navigate("/dashboard/users"); 
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className=" bg-white w-100 mx-2 p-3">
      <h1>Update User</h1>

      {loading && <LoadingSubmit />}
      

      <form onSubmit={handleSubmit} className="mt-3">

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={mail} 
            onChange={(e) => setMail(e.target.value)} 
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password (leave blank to keep unchanged)</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select 
            className="form-select" 
            value={type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <Button
          type="submit" 
           className="mt-3 w-100"
          variant="outline-primary"
          disabled={loading}
        >
          {loading ? "Saving..." : "Update User"}
        </Button>

      </form>
    </div>
  );
}