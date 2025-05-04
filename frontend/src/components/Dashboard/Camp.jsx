import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

import { Button } from 'react-bootstrap';
import { FaPen, FaTrash } from "react-icons/fa";
import { CiCircleMore } from "react-icons/ci";
import { BASEURL } from "../../api/api";
import { useUser } from "../../context/UserContext";
import toast from "react-hot-toast";

export default function Camps() {
  const { user } = useUser();

  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${BASEURL}/camp/all/all`)
      .then((response) => {
        setCamps(response.data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const headers = [
    { key: "name", name: "Camp Name" },
    { key: "type", name: "Type" },
    { key: "place", name: "Place" },
    { key: "datestart", name: "Start Date" },
    { key: "enddate", name: "End Date" },
    { key: "associatorName", name: "Associator Name" },

   
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASEURL}/camp/${id}`);
      setCamps(prev => prev.filter(camp => camp.id !== id));
      toast.success("Camp deleted successfully");
    } catch (err) {
      toast.error("Failed to delete camp");
      console.log(err);
    }
  };

  return (
    <div className="bg-white p-2 w-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1>Camps Page</h1>
        {user.type === "admin" && (
          <Link to="/dashboard/camp/add" className="btn btn-primary">Add Camp</Link>
        )}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : camps.length === 0 ? (
        <div className="text-center">No camps found.</div>
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
            {camps.map((camp, idx) => (
              <tr key={camp.id}>
                <td>{idx + 1}</td>
                {headers.map((header) => (
                  <td key={header.key}>{camp[header.key]}</td>
                ))}
                <td>
                  {user.type === "admin" ? (
                    <div className="d-flex align-items-center gap-4">
                      <Link to={`/dashboard/camp/${camp.id}`}>
                        <FaPen size={19} color="grey" />
                      </Link>
                      <FaTrash
                        size={19}
                        color="red"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleDelete(camp.id)}
                      />
                      <Link  to={`/dashboard/camp/detail/${camp.id}`}>
                      <CiCircleMore  color="black" size={19} />
                    </Link>
                    </div>
                  ) : (
                    <Link  to={`/dashboard/camp/detail/${camp.id}`}>
                      <CiCircleMore  color="black" size={19} />
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
