import React, { createContext, useState } from "react";
import axios from "axios";

export const PostsContext = createContext();

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://linked-posts.routemisr.com/posts",
        {
          headers: { token: localStorage.getItem("token") },
          params: { limit: 15, sort: "-createdAt" },
        }
      );
      setPosts(data.posts);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  const createPost = async (body, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("body", body);
      if (imageFile) formData.append("image", imageFile);

      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPosts((prev) => [data.post, ...prev]); // ضيف الجديد فوق
      return data.post;
    } catch (err) {
      console.error("❌ Error creating post:", err);
      throw err;
    }
  };

const updatePost = async (postId, body, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("body", body);
    if (imageFile) formData.append("image", imageFile);

    const { data } = await axios.put(
      `https://linked-posts.routemisr.com/posts/${postId}`,
      formData,
      {
        headers: {
          token: localStorage.getItem("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setPosts((prev) =>
      prev.map((post) => (post._id === postId ? data.post : post))
    );

    return data.post;
  } catch (err) {
    console.error("❌ Error updating post:", err);
    throw err;
  }
};

  const deletePost = async (postId) => {
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/posts/${postId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("❌ Error deleting post:", err);
    }
  };



  return (
    <PostsContext.Provider
      value={{ posts, getPosts, createPost, updatePost, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
