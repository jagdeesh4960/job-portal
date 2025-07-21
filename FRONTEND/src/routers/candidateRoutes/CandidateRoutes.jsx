import { Routes, Route } from "react-router-dom";
import SavedJobs from "../../pages/candidatePage/SavedJobs";
import AppliedJobs from "../../pages/candidatePage/AppliedJobs";

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
