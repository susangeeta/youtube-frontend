import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";

const VideoPlayer = ({ video }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(video?.likes || 0);
  const [dislikes, setDislikes] = useState(video?.dislikes || 0);
  const [recommendedVideos, setRecommendedVideos] = useState([]);

  const fetchRecommendedVideos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/videos");
      const filtered = response.data
        .filter((v) => v._id !== video?._id)
        .slice(0, 4);
      setRecommendedVideos(filtered);
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecommendedVideos();
  }, [video]);

  const handleLike = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to like this video!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/videos/${video._id}/like`
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(response.data.liked);
      setDisliked(response.data.disliked);
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to dislike this video!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/videos/${video._id}/dislike`
      );
      setLikes(response.data.likes);
      setDislikes(response.data.dislikes);
      setLiked(response.data.liked);
      setDisliked(response.data.disliked);
    } catch (error) {
      console.error("Error disliking video:", error);
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now - videoDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-3 md:p-6 bg-[#0f0f0f] min-h-screen">
      <div className="flex-1">
        <div className="relative w-full bg-black rounded-xl overflow-hidden mb-4">
          <video
            controls
            autoPlay
            className="w-full aspect-video"
            src={video.videoUrl}
            key={video._id}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <h1 className="text-white text-xl font-semibold mb-4">{video.title}</h1>

        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img
              src={
                video.uploader?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={video.channelId?.channelName}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-white font-medium text-base">
                {video.channelId?.channelName || "Unknown Channel"}
              </h3>
              <p className="text-gray-400 text-sm">
                {video.channelId?.subscribers || 0} subscribers
              </p>
            </div>
            <button className="ml-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition-colors">
              Subscribe
            </button>
          </div>

          <div className="flex gap-2">
            <div className="flex gap-4 rounded-full overflow-hidden">
              <button
                className={`flex items-center bg-[#272727] cursor-pointer gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  liked
                    ? "bg-blue-500 text-white"
                    : "bg-[#272727] hover:bg-[#3f3f3f] text-white"
                }`}
                onClick={handleLike}
              >
                👍 {likes}
              </button>
              <button
                className={`flex items-center cursor-pointer bg-[#272727]  gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
                  disliked
                    ? "bg-blue-500 text-white"
                    : "bg-[#272727] hover:bg-[#3f3f3f] text-white"
                }`}
                onClick={handleDislike}
              >
                👎 {dislikes}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#272727] rounded-xl p-4">
          <div className="flex gap-3 text-sm text-white mb-2">
            <span className="font-medium">
              {formatViews(video.views)} views
            </span>
            <span>{formatDate(video.createdAt)}</span>
            <span className="px-2 py-0.5 bg-[#3f3f3f] rounded-md text-xs">
              {video.category}
            </span>
          </div>
          <p className="text-white whitespace-pre-wrap">
            {video.description || "No description available"}
          </p>
        </div>
      </div>

      <div className="w-[400px] flex-shrink-0">
        <h2 className="text-white text-lg font-semibold mb-4">Recommended</h2>
        <div className="space-y-3">
          {recommendedVideos.length > 0 ? (
            recommendedVideos.map((recVideo) => (
              <div
                key={recVideo._id}
                className="flex gap-2 cursor-pointer hover:bg-[#272727] p-2 rounded-lg transition-colors"
                onClick={() => handleVideoClick(recVideo._id)}
              >
                <img
                  src={recVideo.thumbnailUrl}
                  alt={recVideo.title}
                  className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium line-clamp-2 mb-1">
                    {recVideo.title}
                  </h3>
                  <p className="text-gray-400 text-xs mb-1">
                    {recVideo.channelId?.channelName || "Unknown Channel"}
                  </p>
                  <div className="flex gap-2 text-gray-400 text-xs">
                    <span>{formatViews(recVideo.views)} views</span>
                    <span>•</span>
                    <span>{formatDate(recVideo.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No recommended videos</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
