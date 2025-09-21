import { Routes, Route } from "react-router-dom";
import SavedJobs from "../../pages/candidatePage/SavedJobs.jsx";
import AppliedJobs from "../../pages/candidatePage/AppliedJobs.jsx";

const CandidateRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/saved-jobs" element={<SavedJobs />} />
        <Route path="/applied-jobs" element={<AppliedJobs />} />
      </Routes>
    </>
  );
};

export default CandidateRoutes;
