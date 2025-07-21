
import { Routes, Route } from "react-router-dom";
import Applications from "../../pages/employerPage/Applications";
import PostedJobs from "../../pages/employerPage/PostedJobs";
import CreateJob from "../../pages/employerPage/CreateJob";


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