import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CommentsContext } from "../contexts/CommentsContext";
import { AuthContext } from "../contexts/AuthContext";

const CommentsSection = ({ postId }) => {
  const { comments, getComments, addComment, deleteComment } =
    useContext(CommentsContext);
  const { user } = useContext(AuthContext);

  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [showComments, setShowComments] = useState(false);

  // Confirmation modal state
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    commentId: null,
  });

  useEffect(() => {
    (async () => {
      await getComments(postId);
      setLoadingComments(false);
    })();
  }, [postId]);

  const handleAdd = async () => {
    if (!newComment.trim()) return;
    await addComment(postId, newComment);
    setNewComment("");
  };

  const handleDeleteClick = (commentId) => {
    setConfirmDelete({ show: true, commentId });
  };

  const handleConfirmDelete = () => {
    deleteComment(postId, confirmDelete.commentId);
    setConfirmDelete({ show: false, commentId: null });
  };

  const postComments = comments[postId] || [];

  return (
    <div className="mt-4 bg-white/70 rounded-xl p-4 shadow-inner border border-pink-100 relative">
      <h4
        className="text-lg font-semibold text-purple-600 mb-2 cursor-pointer flex items-center gap-2 select-none"
        onClick={() => setShowComments((prev) => !prev)}
      >
        💬 Comments
        <span className="text-sm text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full shadow-sm">
          {postComments.length}
        </span>
      </h4>

      <AnimatePresence>
        {showComments && (
          <motion.div
            key="comments"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : postComments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet.</p>
            ) : (
              postComments.map((c) => (
                <motion.div
                  key={c._id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-pink-100 py-2 flex justify-between items-start"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={c.user?.photo || "/profile.jpg"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full border border-pink-300"
                      onError={(e) => (e.target.src = "/profile.jpg")}
                    />
                    <p className="text-sm text-gray-700 leading-tight">
                      <span className="font-semibold text-purple-700">
                        {c.user?.name || "User"}
                      </span>
                      : {c.content}
                    </p>
                  </div>

                  {user &&
                    (c.user?._id === user._id || c.user?.id === user._id) && (
                      <button
                        onClick={() => handleDeleteClick(c._id)}
                        className="text-xs text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    )}
                </motion.div>
              ))
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 flex gap-2 items-center"
            >
              <img
                src={user?.photo || "/profile.jpg"}
                alt="me"
                className="w-8 h-8 rounded-full border border-pink-300"
                onError={(e) => (e.target.src = "/profile.jpg")}
              />
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90"
              >
                Send
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDelete.show && (
          <motion.div
            key="confirmModal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Confirm Deletion
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete this comment?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    setConfirmDelete({ show: false, commentId: null })
                  }
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentsSection;
