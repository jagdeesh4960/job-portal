import { Routes, Route } from "react-router-dom";
import Dashboard from "../../pages/commonPage/Dashboard";
import Profile from "../../pages/commonPage/Profile";
import JobList from "../../pages/commonPage/JobList";
import Navbar from "../../components/commonComponents/Navbar";
import JobDetail from "../../pages/commonPage/jobDetails";
import EditJob from "../../pages/commonPage/EditJob";
import ApplicationForm from "../../pages/commonPage/ApplicationForm";
import ViewApplication from "../../pages/commonPage/viewApplication";


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
