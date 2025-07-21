import { useSelector } from 'react-redux';
import EmployerDashboard from '../../components/userComponents/EmployerDashboard';
import CandidateDashboard from '../../components/userComponents/CandidateDashboard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const getDashboardByRole = () => {
    if (!user) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
            Find Your Dream Job or Internship
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
            Explore thousands of opportunities from top companies and startups. Start your career journey today!
          </p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Login to Get Started
          </Link>
        </motion.div>
      );
    }

    switch (user.role.toLowerCase()) {
      case 'admin':
        return <AdminDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      case 'candidate':
      default:
        return <CandidateDashboard />;
    }
  };

  return (
    <section className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      {getDashboardByRole()}
    </section>
  );
};

export default Dashboard;
