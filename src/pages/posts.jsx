import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../contexts/PostsContext";
import { AuthContext } from "../contexts/AuthContext";

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
    <div className="max-w-2xl mx-auto mt-6 space-y-6 font-[Poppins] relative">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="bg-white shadow-sm rounded-2xl p-5 border border-gray-100 relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.user?.photo}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border shadow-sm"
                  onError={(e) => (e.target.src = "/icon.jpg")}
                />
                <div>
                  <p className="font-semibold text-gray-700 text-base">
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
                        className="w-full text-left px-4 py-2 text-sm text-purple-700 hover:bg-pink-200"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          setConfirmDelete(post._id);
                          setMenuOpen(null);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-pink-200"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <p className="text-gray-800 text-xl mb-3 whitespace-pre-line">
              {post.body}
            </p>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full rounded-xl mb-3 border shadow-sm"
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
            )}

            <div className="flex justify-between text-sm text-gray-600 mb-2 px-1">
              <span>💓12 Likes</span>
              <span>💬10 Comments</span>
            </div>

            <div className="flex justify-around mt-2 text-md font-bold">
              <button className="flex items-center gap-1 flex-1 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent hover:opacity-80">
                💓 Like
              </button>
              <button className="flex items-center gap-1 flex-1 py-2 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hover:opacity-80">
                💬 Comment
              </button>
              <button className="flex items-center gap-1 flex-1 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80">
                🔗 Share
              </button>
            </div>
          </div>
        ))
      )}

      <button
        onClick={() => navigate("/addposts")}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold w-16 h-16 rounded-full shadow-lg text-3xl flex items-center justify-center hover:opacity-90"
      >
        +
      </button>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <h3 className="text-lg font-bold text-purple-500 mb-2">
              ⚠️ Confirm Delete
            </h3>
            <p className="text-pink-600 mb-4">
              Are you sure you want to delete this post?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  deletePost(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:opacity-80"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 bg-gray-400 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
