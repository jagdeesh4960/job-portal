import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes"; // We split route logic here

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
