import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/commonPage/Dashboard.jsx";
import Profile from "../../pages/commonPage/Profile.jsx";
import JobList from "../../pages/commonPage/JobList.jsx";
import Navbar from "../../components/commonComponents/Navbar.jsx";
import JobDetail from "../../pages/commonPage/jobDetails.jsx";
import EditJob from "../../pages/commonPage/EditJob.jsx";
import ApplicationForm from "../../pages/commonPage/ApplicationForm.jsx";
import ViewApplication from "../../pages/commonPage/viewApplication.jsx";


const CommonRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/job/:jobId" element={<JobDetail />} />
        <Route path="/edit-job/:id" element={<EditJob />} />
        <Route path="/apply/:jobId" element={<ApplicationForm/>} />
        <Route path="/view-application/:id" element={<ViewApplication/>} />
      </Routes>
    </>
  );
};

export default CommonRoutes;
