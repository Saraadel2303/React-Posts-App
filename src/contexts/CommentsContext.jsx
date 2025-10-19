import React, { createContext, useState } from "react";
import axios from "axios";

export const CommentsContext = createContext();

export const CommentsProvider = ({ children }) => {
  const [comments, setComments] = useState({});

  const getComments = async (postId) => {
    try {
      const { data } = await axios.get(
        `https://linked-posts.routemisr.com/posts/${postId}/comments`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );
      setComments((prev) => ({ ...prev, [postId]: data.comments }));
    } catch (err) {
      console.error("❌ Error fetching comments:", err);
    }
  };

  const addComment = async (postId, content) => {
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        { content, post: postId },
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      const newComment = data.comment || data.comments?.[0];
      if (newComment) {
        if (!newComment.user) {
          newComment.user = JSON.parse(localStorage.getItem("user"));
        }

        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment],
        }));
      }

      return newComment;
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      throw err;
    }
  };

  const updateComment = async (postId, commentId, content) => {
    try {
      const { data } = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        { content },
        {
          headers: {
            token: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.map((c) =>
          c._id === commentId ? data.comment : c
        ),
      }));

      return data.comment;
    } catch (err) {
      console.error("❌ Error updating comment:", err);
      throw err;
    }
  };

  const deleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        {
          headers: { token: localStorage.getItem("token") },
        }
      );

      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId]?.filter((c) => c._id !== commentId),
      }));
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
    }
  };

  return (
    <CommentsContext.Provider
      value={{
        comments,
        getComments,
        addComment,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};
