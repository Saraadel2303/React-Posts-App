import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostsContext } from "../contexts/PostsContext";
import toast, { Toaster } from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams(); // 🟢 ID البوست من الرابط
  const { posts, updatePost } = useContext(PostsContext);
  const navigate = useNavigate();

  // نجيب البوست الحالي من الـ Context
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
    return <p className="text-center text-gray-500">Loading post...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white shadow-md rounded-2xl border border-gray-200">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold text-purple-700 mb-3">✏️ Edit Post</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Edit your post..."
          className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
          rows={4}
        />

        {/* Upload Image */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded-xl p-2 text-sm"
        />

        {/* Preview Image */}
        {preview && (
          <div className="mt-3">
            <img
              src={preview}
              alt="preview"
              className="w-full rounded-xl border"
              onError={(e) => (e.target.src = "/fallback.jpg")}
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 rounded-xl shadow-md hover:opacity-90 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}
