
import { Routes, Route } from "react-router-dom";
import Applications from "../../pages/employerPage/Applications.jsx";
import PostedJobs from "../../pages/employerPage/PostedJobs.jsx";
import CreateJob from "../../pages/employerPage/CreateJob.jsx";


const EmployerRoutes = () => {
   return (
   <>
   <Routes>
    <Route path="/posted-jobs" element={<PostedJobs />} />
    <Route path="/create-job" element={<CreateJob />} />
    <Route path="/employer-applications" element={<Applications />} />
   </Routes>
   </>
  )
}

export default EmployerRoutes