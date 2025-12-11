import axios from "axios";
import { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (activeFilter !== "All") {
        params.append("category", activeFilter);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const queryString = params.toString();
      const url = `http://localhost:5000/api/videos${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching URL:", url);

      const response = await axios.get(url);
      setVideos(response.data);
      console.log("Fetched videos:", response.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(error.response?.data?.message || "Error fetching videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [activeFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      <Header
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />
      <div className="flex">
        <div className="">
          <Sidebar isOpen={sidebarOpen} />
        </div>
        <main
          className={`md:flex-1 p-6 transition-all duration-300 ${
            sidebarOpen ? "ml-" : "ml-0"
          }`}
        >
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-white text-lg">Loading videos...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500 text-lg">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {videos.length > 0 ? (
                videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))
              ) : (
                <p className="col-span-full text-center p-10 text-gray-400 text-lg">
                  No videos found for category "{activeFilter}"
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
