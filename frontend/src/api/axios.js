import axios from 'axios';
import Cookie from 'cookie-universal';
import { BASEURL } from "./api";

const cookie = Cookie();
const token = cookie.get("camp");

const Axios = axios.create({
  baseURL: BASEURL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export default Axios; 
