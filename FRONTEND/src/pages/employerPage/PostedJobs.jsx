import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { deleteJob, fetchUserJobs } from '../../features/jobs/jobThunks';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import useDebounce from '../../hooks/useDebounce';

const PostedJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userPostedJobs } = useSelector((state) => state.jobs);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [typeFilter, setTypeFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchUserJobs());
  }, [dispatch]);

  const fuse = new Fuse(userPostedJobs, {
    keys: ['title', 'company', 'location'],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
  });

  const fuseResults = debouncedSearchTerm
    ? fuse.search(debouncedSearchTerm)
    : userPostedJobs.map((job) => ({ item: job }));

  const filteredJobs = useMemo(() => {
    return fuseResults
      .filter(({ item }) => typeFilter === 'All' || item.type === typeFilter);
  }, [fuseResults, typeFilter]);

  const highlightText = (text, matches, key) => {
    if (!matches) return text;
    const match = matches.find((m) => m.key === key);
    if (!match) return text;
    const indices = match.indices;
    let result = '';
    let lastIndex = 0;
    indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<mark class='bg-yellow-200 font-semibold'>${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });
    result += text.slice(lastIndex);
    return result;
  };

  const handleDelete = (id) => {
    dispatch(deleteJob(id));
  };

  const handleEdit = (id) => {
    navigate(`/common/edit-job/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-[64px] w-screen h-[calc(100vh-64px)] overflow-hidden px-4 md:px-8 bg-gray-50"
    >
      <div className="max-w-6xl mx-auto h-full overflow-y-auto py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Posted Jobs</h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by title, company, or location..."
            className="border px-4 py-2 rounded-md w-full md:w-1/2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border px-4 py-2 rounded-md text-sm"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {filteredJobs.length === 0 ? (
          <p className="text-gray-600 text-center">No jobs match your criteria.</p>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map(({ item, matches }) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm"
              >
                <h3
                  className="text-xl font-semibold text-blue-600"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.title, matches, 'title'),
                  }}
                ></h3>
                <p
                  className="text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.company, matches, 'company'),
                  }}
                ></p>
                <p className="text-gray-500">
                  {item.location} — {item.type}
                </p>

                <div className="mt-4 flex flex-col md:flex-row md:justify-between gap-3">
                  <div className="flex gap-4 text-sm">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>

                  <Link
                    to={`/common/job/${item._id}`}
                    className="text-blue-500 hover:underline text-sm self-start md:self-center"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostedJobs;
