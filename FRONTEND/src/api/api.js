import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL|| 'https://job-portal-vc0m.onrender.com'|| process.env.BACKEND_URL ,
  withCredentials: true, 
});

export default API;
