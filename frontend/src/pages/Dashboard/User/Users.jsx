import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { BASEURL } from "../../../api/api";
import { useUser } from '../../../context/UserContext';
import { Button } from 'react-bootstrap';
import { FaPen,FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASEURL}/user/all/all`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const headers = [
    { key: "name", name: "Username" },
    { key: "mail", name: "Email" },
    { key: "type", name: "Role" },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASEURL}/user/${id}`);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error("Something went wrong!");
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-2 w-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1>Users Page</h1>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center">No users found.</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              {headers.map((header) => (
                <th key={header.key}>{header.name}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter(u => u.id !== user.id)
              .map((u, idx) => (
                <tr key={u.id}>
                  <td>{idx + 1}</td>
                  {headers.map((header) => (
                    <td key={header.key}>{u[header.key]}</td>
                  ))}
                  <td>
                    <div className="d-flex align-items-center gap-4">
                      {user.id === u.id ? (
                        <Button style={{ fontSize: '0.95rem', padding: '0px 10px' }} variant="primary" size="sm" disabled>
                          You
                        </Button>
                      ) : (
                        <>
                          <Link to={`/dashboard/user/${u.id}`}>
                            <FaPen  size={19} color="grey" />
                          </Link>
                          <FaTrash
                            size={19}
                            color="red"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleDelete(u.id)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
