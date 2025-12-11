import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

const ChannelPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [channel, setChannel] = useState(null);
  const [, setChannels] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showCreateVideo, setShowCreateVideo] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const [channelForm, setChannelForm] = useState({
    channelName: "",
    description: "",
    channelBanner: "",
  });

  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    category: "Technology",
  });

  const fetchUserChannels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/channels/user/${user._id}`
      );
      setChannels(response.data);

      if (response.data.length > 0) {
        const currentChannel = response.data[0];
        setChannel(currentChannel);
      }
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUserChannels();
  }, [user, id]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/channels", channelForm);

      Swal.fire({
        icon: "success",
        title: "Channel Created!",
        text: "Your channel has been successfully created.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowCreateChannel(false);
      setChannelForm({
        channelName: "",
        description: "",
        channelBanner: "",
      });

      fetchUserChannels();
    } catch (error) {
      console.error("Error creating channel:", error);

      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to create channel. Please try again.",
      });
    }
  };

  const handleCreateVideo = async (e) => {
    e.preventDefault();

    if (!channel) {
      Swal.fire({
        icon: "warning",
        title: "No Channel Found",
        text: "Please create a channel first!",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      if (editingVideo) {
        // UPDATE video
        await axios.put(
          `http://localhost:5000/api/videos/${editingVideo._id}`,
          videoForm
        );

        Swal.fire({
          icon: "success",
          title: "Video Updated!",
          text: "Your video has been successfully updated.",
          timer: 1500,
          showConfirmButton: false,
        });

        setEditingVideo(null);
      } else {
        // CREATE video
        await axios.post("http://localhost:5000/api/videos", {
          ...videoForm,
          channelId: channel._id,
        });

        Swal.fire({
          icon: "success",
          title: "Video Created!",
          text: "Your new video has been uploaded successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setShowCreateVideo(false);
      setVideoForm({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        category: "Technology",
      });

      fetchUserChannels();
    } catch (error) {
      console.error("Error saving video:", error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Something went wrong while saving the video.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleEditVideo = (video) => {
    Swal.fire({
      title: "Edit Video?",
      text: "Do you want to edit this video?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingVideo(video);
        setVideoForm({
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          category: video.category,
        });
        setShowCreateVideo(true);

        Swal.fire({
          icon: "info",
          title: "Editing Mode",
          text: "You can now edit your video details.",
          timer: 1200,
          showConfirmButton: false,
        });
      }
    });
  };

  const handleDeleteVideo = async (videoId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This video will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/videos/${videoId}`);

          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The video has been deleted.",
            timer: 1500,
            showConfirmButton: false,
          });

          fetchUserChannels(); // refresh UI
        } catch (error) {
          console.error("Error deleting video:", error);

          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Failed to delete video. Please try again.",
          });
        }
      }
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-xl">Please login to view this page</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          {channel ? (
            <div className="p-6">
              <div className="mb-8">
                <img
                  src={
                    channel.channelBanner ||
                    "https://via.placeholder.com/1200x300"
                  }
                  alt="Channel Banner"
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
                <div className="text-white">
                  <h1 className="text-4xl font-bold mb-2">
                    {channel.channelName}
                  </h1>
                  <p className="text-gray-400 mb-2">
                    {channel.subscribers} subscribers •{" "}
                    {channel.videos?.length || 0} videos
                  </p>
                  <p className="text-gray-300">{channel.description}</p>
                </div>
              </div>

              {/* Upload Video */}
              <div className="mb-8">
                <button
                  onClick={() => setShowCreateVideo(true)}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  + Upload Video
                </button>
              </div>

              {/* Create/Edit Video Modal */}
              {showCreateVideo && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => {
                    setShowCreateVideo(false);
                    setEditingVideo(null);
                  }}
                >
                  <div
                    className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl font-bold text-white mb-6">
                      {editingVideo ? "Edit Video" : "Upload New Video"}
                    </h2>
                    <form onSubmit={handleCreateVideo} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={videoForm.title}
                        onChange={(e) =>
                          setVideoForm({ ...videoForm, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                      <textarea
                        placeholder="Video Description"
                        value={videoForm.description}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[100px]"
                      />
                      <input
                        type="url"
                        placeholder="Video URL"
                        value={videoForm.videoUrl}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            videoUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Thumbnail URL"
                        value={videoForm.thumbnailUrl}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            thumbnailUrl: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <select
                        value={videoForm.category}
                        onChange={(e) =>
                          setVideoForm({
                            ...videoForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Education">Education</option>
                        <option value="Music">Music</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Sports">Sports</option>
                        <option value="Coding">Coding</option>
                      </select>
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          {editingVideo ? "Update" : "Upload"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCreateVideo(false);
                            setEditingVideo(null);
                          }}
                          className="flex-1 cursor-pointer bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Videos Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {channel.videos && channel.videos.length > 0 ? (
                    channel.videos.map((video) => (
                      <div
                        key={video._id}
                        className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors"
                      >
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="text-white font-semibold mb-2 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4">
                            {video.views} views
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditVideo(video)}
                              className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video._id)}
                              className="flex-1 cursor-pointer bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 col-span-full text-center py-12">
                      No videos uploaded yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-6">
                  You don't have a channel yet
                </h2>
                <button
                  onClick={() => setShowCreateChannel(true)}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                >
                  Create Channel
                </button>
              </div>

              {/* Create Channel Modal */}
              {showCreateChannel && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                  onClick={() => setShowCreateChannel(false)}
                >
                  <div
                    className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-2xl cursor-pointer font-bold text-white mb-6">
                      Create Your Channel
                    </h2>
                    <form onSubmit={handleCreateChannel} className="space-y-4">
                      <input
                        type="text"
                        placeholder="Channel Name"
                        value={channelForm.channelName}
                        onChange={(e) =>
                          setChannelForm({
                            ...channelForm,
                            channelName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                        required
                      />
                      <textarea
                        placeholder="Channel Description"
                        value={channelForm.description}
                        onChange={(e) =>
                          setChannelForm({
                            ...channelForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[100px]"
                      />
                      <input
                        type="url"
                        placeholder="Channel Banner URL (optional)"
                        value={channelForm.channelBanner}
                        onChange={(e) =>
                          setChannelForm({
                            ...channelForm,
                            channelBanner: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-red-600 cursor-pointer hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          Create
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowCreateChannel(false)}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 cursor-pointer text-white py-3 rounded-lg font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChannelPage;
