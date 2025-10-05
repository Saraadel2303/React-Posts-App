import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../contexts/PostsContext";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";

export default function AddPosts() {
   const { user} = useContext(AuthContext);
  const { createPost } = useContext(PostsContext);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) {
      toast.error("⚠️ Post content cannot be empty!");
      return;
    }
    try {
      setLoading(true);
      await createPost(newPost, imageFile);
      toast.success("✅ Post created successfully!");
      setNewPost("");
      setImageFile(null);
      setPreview(null);
      navigate("/posts", { replace: true });
    } catch (err) {
      toast.error("❌ Failed to create post!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-4 bg-white shadow-md rounded-2xl border border-gray-200">
  <Toaster position="top-right" />

  <h2 className="text-2xl font-bold text-purple-700 mb-5">Create Post</h2>
  <form onSubmit={handleSubmit} className="space-y-3">
    <div className="flex items-start gap-3">
      <img
        src={user.photo || "/icon.jpg"}
        alt="avatar"
        className="w-12 h-12 rounded-full border-2 border-pink-400 shadow-lg hover:scale-105 transition-transform duration-300"
      />

      <textarea
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="What's on your mind?"
        className="flex-1 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
        rows={3}
      />
    </div>

    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="w-full border border-gray-300 rounded-xl p-2 text-sm mb-5"
    />

    {preview && (
      <div className="mt-3">
        <img
          src={preview}
          alt="preview"
          className="w-full rounded-xl border"
        />
      </div>
    )}

    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        "Post"
      )}
    </button>
  </form>
</div>
  );
}
