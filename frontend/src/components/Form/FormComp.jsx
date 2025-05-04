import { Link, useLocation } from "react-router-dom";
import "./FormComp.css";
import axios from "axios";
import { BASEURL } from "../../api/api";
import toast from "react-hot-toast";
import Cookie from "cookie-universal";
import { useMutation } from "react-query";
import useForm from "../../hooks/useForm"; 
import { FaCampground } from "react-icons/fa6";

import Spinner from "react-bootstrap/Spinner";
import campBg from "../../assets/campBg.png";

function FormComp(props) {
  // Set up Coockie for storing the token 
  const cookie = Cookie();
  // Set up navigation & location
  
  const location = useLocation();

  // Using useForm Hook
  const { values: formData, handleChange, resetForm } = useForm(
    props.dataInput.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );

  const sanitizeUser = (userData) => {
    if (!userData) return null;
    const { password, ...safeUserData } = userData;
    return safeUserData;
  };
  // React Query Mutation for form submission 
  // Success : Store token in Coockie and navigate dashboard page
  // Error : show the error
  const mutation = useMutation(
    async () => {
      const response = await axios.post(`${BASEURL}/${props.endApi}`, formData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        const token = data.token;
        const user = data.user;
        
        cookie.set("camp", token);
        cookie.set("user", sanitizeUser(data.user)); 
        
        toast.success(`Welcome ${data?.user?.name?.slice(0, 15)}`);

        if (user.type === "user") {
        window.location.pathname = "/dashboard/camps";

        } else {
            window.location.pathname = "/dashboard/users";

        }
        
        resetForm();
      },
      onError: (error) => {
              
      },
    }
  );
// Function to run the mutation &  submit the Form
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="w-100 vh-100 d-flex align-items-center justify-content-center p-0">
      <div className="row w-100 g-0">
        <div className="left-side col-lg-8 d-none d-lg-flex justify-content-center align-items-center w-50 ">
          <img
            loading="lazy"
            src={campBg}
            className="img-fluid"
            alt="Background"
            style={{ width: "100%", height: "100vh", objectFit: "cover" }}
          />
        </div>

        <div className="w-50 px-5 right-side col-lg-4 col-md-12 col-sm-12 mx-auto d-flex flex-column align-items-start justify-content-center py-4 shadow-sm rounded bg-white form-container vh-100">
       <h2 className="mt-4 fw-bold text-start text-sm-center flex align-items-center gap-3">
       
       <FaCampground
 style={{ fontSize: "2rem",color:"#FFA500" }}  /> Summer Camp
 
</h2>


          <h3 className="mt-2  text-start mb-1 text-capitalize flex align-items-center gap-3">
            Welcome to Summer Camp! 👋
          </h3>
          <h4 className="text-secondary mb-4 fs-6 w-100">
            Please {props.type} to your account and start the adventure
          </h4>

          <form className="w-100" onSubmit={handleSubmit}>
            {props.dataInput.map((field, index) => (
              <div className="mb-3" key={index}>
                <label htmlFor={field} className="form-label text-capitalize">
                  {field}
                </label>
                <input
                  type={field === "name" ? "text" : field === "mail" ? "email" : "password"}
                  id={field}
                  name={field}
                  className="form-control outline-none px-3 py-2 w-100"
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={`Enter your ${field} ...`}
                  minLength={field === "password" ? "8" : "4"}
                  required
                />
              </div>
            ))}

            <button className="btn btn-primary w-100 mb-2 text-capitalize" disabled={mutation.isLoading}>
              {mutation.isLoading ? <Spinner animation="border" size="sm" /> : props.type}
            </button>

            <p className="my-2">
              {props.type === "register" ? "Already have an account?" : "Don't have an account?"}
              <Link
                to={props.type === "register" ? "/login" : "/register"} state={{from:location.pathname}}
                className="text-decoration-none text-primary text-capitalize ms-1"
              >
                {props.type === "register" ? "login" : "register"}
              </Link>
            </p>

           {mutation.isError && (
              <p className="error">{mutation.error?.response?.status !== 201 ? mutation.error?.response?.data?.error : "Something went wrong!"}</p>
            )}
          </form>          
        </div>
      </div>
    </div>
  );
}

export default FormComp;
