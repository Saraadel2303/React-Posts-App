import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { PostsContext } from "../contexts/PostsContext";
import { AuthContext } from "../contexts/AuthContext";
import CommentsSection from "../components/CommentsSection";

const Posts = () => {
  const { posts, getPosts, deletePost } = useContext(PostsContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    (async () => {
      await getPosts();
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 py-10 px-4 font-[Poppins]">
      <div className="max-w-2xl mx-auto space-y-8 relative">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-pink-200 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-pink-400 to-purple-500 opacity-20 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-500 opacity-20 rounded-full blur-2xl translate-x-10 translate-y-10"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        post.user?._id === user?._id
                          ? user?.photo || "/profile.jpg"
                          : post.user?.photo || "/profile.jpg"
                      }
                      alt="avatar"
                      className="w-12 h-12 rounded-full border-2 border-pink-400 shadow-lg hover:scale-105 transition-transform duration-300"
                      onError={(e) => (e.target.src = "/icon.jpg")}
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-lg">
                        {post.user?.name || "Anonymous"}
                      </p>
                      <span className="text-sm text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {user && post.user?._id === user._id && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setMenuOpen(menuOpen === post._id ? null : post._id)
                        }
                        className="px-2 text-2xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent hover:opacity-80"
                      >
                        ⋮
                      </button>
                      {menuOpen === post._id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-lg border z-10">
                          <button
                            onClick={() => navigate(`/edit/${post._id}`)}
                            className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-pink-100"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              setConfirmDelete(post._id);
                              setMenuOpen(null);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-pink-100"
                          >
                            🗑 Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="text-gray-800 text-lg mb-4 whitespace-pre-line">
                  {post.body}
                </p>

                {post.image && (
                  <div className="relative w-full flex justify-center mb-4">
                    <img
                      src={post.image}
                      alt="post"
                      className="w-64 h-64 object-cover rounded-xl shadow-md hover:scale-[1.02] transition-transform duration-300 opacity-0"
                      loading="lazy"
                      onLoad={(e) => e.target.classList.remove("opacity-0")}
                      onError={(e) => (e.target.src = "/fallback.jpg")}
                    />
                  </div>
                )}

                <CommentsSection postId={post._id} />
              </div>
            </div>
          ))
        )}

        <AnimatePresence>
          {confirmDelete && (
            <div
              className="fixed inset-0 min-h-screen w-full flex items-center justify-center bg-black/40 backdrop-blur-md z-50"
              onClick={() => setConfirmDelete(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-sm p-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-100 to-white opacity-70 rounded-3xl blur-xl"></div>

                <div className="relative z-10">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center mb-3">
                      <span className="text-2xl text-white">⚠️</span>
                    </div>
                    <h3 className="text-lg font-bold text-purple-600 mb-1">
                      Confirm Delete
                    </h3>
                    <p className="text-gray-600 mb-6 text-sm">
                      Are you sure you want to delete this post? <br />
                      This action cannot be undone.
                    </p>

                    <div className="flex w-full gap-3">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          deletePost(confirmDelete);
                          setConfirmDelete(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2.5 rounded-lg font-medium shadow-md hover:opacity-90"
                      >
                        Yes, Delete
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium hover:bg-gray-400"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <button
          onClick={() => navigate("/addposts")}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold w-16 h-16 rounded-full shadow-lg text-3xl flex items-center justify-center hover:opacity-90"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Posts;
