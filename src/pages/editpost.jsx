import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PostsContext } from "../contexts/PostsContext";
import toast, { Toaster } from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams();
  const { posts, updatePost } = useContext(PostsContext);
  const navigate = useNavigate();

  const existingPost = posts.find((p) => p._id === id);
  const [body, setBody] = useState(existingPost?.body || "");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(existingPost?.image || null);

  useEffect(() => {
    if (existingPost) {
      setBody(existingPost.body);
      setPreview(existingPost.image);
    }
  }, [existingPost]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(existingPost?.image || null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!body.trim()) {
      toast.error("⚠️ Post content cannot be empty!");
      return;
    }

    try {
      await updatePost(id, body, imageFile);
      toast.success("✅ Post updated successfully!");
      navigate("/posts", { replace: true });
    } catch (err) {
      toast.error("❌ Failed to update post!");
    }
  };

  if (!existingPost) {
    return (
      <p className="text-center text-gray-500 mt-10 animate-pulse">
        Loading post...
      </p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-3xl border border-gray-200"
    >
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
        ✏️ Edit Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Textarea */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Edit your post..."
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
          rows={4}
        />

        {/* Upload Image */}
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Upload Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-xl p-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer"
          />
        </div>

        {/* Preview Image */}
        {preview && (
          <div className="flex justify-center mt-4">
            <img
              src={preview}
              alt="preview"
              className="w-[300px] h-[300px] object-cover rounded-2xl border border-gray-300 shadow-md"
              onError={(e) => (e.target.src = "/fallback.jpg")}
            />
          </div>
        )}

        {/* Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2.5 rounded-xl shadow-md hover:opacity-90 transition"
        >
          Update Post
        </motion.button>
      </form>
    </motion.div>
  );
}
