import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../context/AuthContext";
const CommentSection = ({ videoId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/comments/video/${videoId}`
      );
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchComments();
  }, [videoId]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login to comment",
      });
      return;
    }

    if (!commentText.trim()) return;

    try {
      const response = await axios.post("http://localhost:5000/api/comments", {
        videoId,
        text: commentText,
      });

      setComments([response.data, ...comments]);
      setCommentText("");

      Swal.fire({
        icon: "success",
        title: "Comment added!",
        text: "Your comment has been posted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error adding comment:", error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add comment. Try again!",
      });
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        {
          text: editText,
        }
      );

      setComments(
        comments.map((c) => (c._id === commentId ? response.data : c))
      );
      setEditId(null);
      setEditText("");

      Swal.fire({
        icon: "success",
        title: "Comment updated!",
        text: "Your comment has been edited successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error editing comment:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to edit",
        text: "Could not update your comment. Try again!",
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This comment will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`);

      setComments(comments.filter((c) => c._id !== commentId));

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your comment has been deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error deleting comment:", error);

      Swal.fire({
        icon: "error",
        title: "Failed to delete",
        text: "Something went wrong. Try again!",
      });
    }
  };

  const edit = (comment) => {
    setEditId(comment._id);
    setEditText(comment.text);
  };

  return (
    <div className="py-6 px-5 bg-[#0f0f0f] text-white">
      <h3 className=" text-xl font-medium ">{comments.length} Comments</h3>

      {user && (
        <form
          onSubmit={handleAddComment}
          className="flex gap-3 pt-7 items-center"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-10 h-10 rounded-full"
          />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 py-2 bg-transparent border-b placeholder:text-white border-[#3f3f3f] text-white text-sm outline-none focus:border-blue-500 transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 rounded-full text-white font-medium transition-colors"
          >
            Comment
          </button>
        </form>
      )}

      <div className="flex flex-col gap-6 pt-7">
        {comments.map((comment) => (
          <div key={comment._id} className="flex gap-3">
            <img
              src={
                comment.userId?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt={comment.userId?.username}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex gap-2 items-center ">
                <span className="font-medium text-sm">
                  {comment.userId?.username || "Unknown"}
                </span>
                <span className="text-gray-400 text-xs">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>

              {editId === comment._id ? (
                <div className="flex gap-2 items-center w-[60%] py-4">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 py-2 px-3  bg-white border border-[#3f3f3f] text-black rounded text-sm outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleEditComment(comment._id)}
                    className="px-3 py-1 bg-blue-500 cursor-pointer hover:bg-blue-600 rounded text-white text-sm font-medium transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-3 py-1 bg-blue-600 hover:bg-[#272727] rounded text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed ">{comment.text}</p>
                  {user && user._id === comment.userId?._id && (
                    <div className="flex gap-2 pt-3">
                      <button
                        onClick={() => edit(comment)}
                        className="border px-4 rounded-full cursor-pointer py-1 text-gray-400 hover:text-blue-500 text-xs font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="border px-4 rounded-full cursor-pointer py-1 text-gray-400 hover:text-red-500 text-xs font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
