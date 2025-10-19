import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PostsContext } from "../contexts/PostsContext";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/AuthContext";
import { PhotoIcon } from "@heroicons/react/24/solid";

export default function AddPosts() {
  const { user } = useContext(AuthContext);
  const { createPost } = useContext(PostsContext);
  const [newPost, setNewPost] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 shadow-2xl rounded-3xl border border-purple-200">
      <Toaster position="top-right" />

      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-8 text-center">
        ✨ Create a New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-start gap-4">
          <img
            src={user.photo || "/icon.jpg"}
            alt="avatar"
            className="w-14 h-14 rounded-full border-2 border-pink-400 shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 border border-purple-200 rounded-2xl p-4 focus:ring-2 focus:ring-pink-400 focus:outline-none resize-none text-gray-700 shadow-inner"
            rows={3}
          />
        </div>

        <div className="relative group">
          <label
            htmlFor="imageUpload"
            className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-2xl p-6 bg-white/70 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
          >
            <PhotoIcon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            <p className="text-sm text-gray-500 mt-2">Click or drag to upload an image</p>
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {preview && (
          <div className="mt-3 relative rounded-2xl overflow-hidden border-2 border-purple-200 shadow-md">
            <img src={preview} alt="preview" className="w-full h-auto object-cover" />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                setImageFile(null);
              }}
              className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md hover:bg-pink-600 transition"
            >
              ✕ Remove
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-2xl shadow-md hover:opacity-90 transition flex items-center justify-center"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Post ✨"
          )}
        </button>
      </form>
    </div>
  );
}
