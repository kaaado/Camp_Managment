import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { FaPen, FaTrash } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";
import toast from "react-hot-toast";
import { BASEURL } from "../../../api/api";
import { useUser } from "../../../context/UserContext";

export default function Kids() {
  const { user } = useUser();
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASEURL}/kid/all/all`)
      .then((response) => {
        setKids(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const headers = [
    { key: "kidName", name: "Kid Name" },
    { key: "kidFather", name: "Father Name" },
    { key: "kidMother", name: "Mother Name" },
    { key: "fatherNumber", name: "Father Phone" },
    { key: "kidAge", name: "Age" },
    { key: "adresse", name: "Address" },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASEURL}/kid/${id}`);
      setKids(prev => prev.filter(kid => kid.id !== id));
      toast.success("Kid deleted successfully");
    } catch (err) {
      toast.error("Failed to delete kid");
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-2 w-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1>Kids Page</h1>
        {user.type === "admin" && (
          <Link to="/dashboard/kid/add" className="btn btn-primary">Add Kid</Link>
        )}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : kids.length === 0 ? (
        <div className="text-center">No kids found.</div>
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
            {kids.map((kid, idx) => (
              <tr key={kid.id}>
                <td>{idx + 1}</td>
                {headers.map((header) => (
                  <td key={header.key}>{kid[header.key]}</td>
                ))}
                <td>
                  {user.type === "admin" ? (
                    <div className="d-flex align-items-center gap-4">
                      <FaTrash
                        size={19}
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(kid.id)}
                      />
                      <Link to={`/dashboard/kid/detail/${kid.id}`}>
                        <CiCircleMore color="black" size={19} />
                      </Link>
                    </div>
                  ) : (
                    <Link className="fs-7 bg-secondary text-white rounded py-1 px-2" to={`/dashboard/kid/detail/${kid.id}`}>
                      More
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}