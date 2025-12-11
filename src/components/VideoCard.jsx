import { Link } from "react-router-dom";

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval !== 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  return (
    <Link
      to={`/video/${video._id}`}
      className="no-underline text-white cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="relative w-full pb-[56.25%] bg-[#212121] rounded-xl overflow-hidden">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="py-3">
        <h3 className="text-sm font-medium leading-tight mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-xs text-gray-400 mb-0.5">
          {video.channelId?.channelName || "Unknown Channel"}
        </p>
        <div className="flex gap-1 text-xs text-gray-400">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{timeAgo(video.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
