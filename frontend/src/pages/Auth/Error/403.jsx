import './403.css';
import { Link } from 'react-router-dom';

export default function Err403({ role }) {
  return (
    <div className="text-wrapper">
      <div className="title" data-content={403}>
        403 - ACCESS DENIED
      </div>
      <div className="subtitle">
        Oops, You don't have permission to access this page.
      </div>
      <Link 
        className="d-block text-center btn btn-primary" 
        to={role === "user" ? "/dashboard/camps" : "/"}
      >
        {role === "user" ? "Go to Dashboard" : "Go to Home Page"}
      </Link>
    </div>
  );
}