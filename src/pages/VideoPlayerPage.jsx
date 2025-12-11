import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "../components/Comment";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import VideoPlayer from "../components/VideoPlayer";

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/videos/${id}`
      );
      setVideo(response.data);
    } catch (error) {
      console.error("Error fetching video:", error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVideo();
  }, [id]);

  return (
    <div>
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="main-container">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`video-page ${sidebarOpen ? "sidebar-open" : ""}`}>
          {video ? (
            <>
              <VideoPlayer video={video} onUpdate={fetchVideo} />
              <Comment videoId={video._id} />
            </>
          ) : (
            <div className="loading">Loading video...</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default VideoPage;
