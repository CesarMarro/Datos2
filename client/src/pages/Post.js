// Post.js
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "../Post.css";
import { AuthContext } from "../helpers/AuthContext";

export default function Post() {
  const navigate = useNavigate();
  const { id } = useParams(); // Asegúrate de que la ruta define el parámetro 'id'
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const { authState } = useContext(AuthContext);

  // Agregar un log para verificar el id
  useEffect(() => {
    console.log("Post ID from useParams:", id);
  }, [id]);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!id) {
        console.error("Post ID is undefined");
        return;
      }

      try {
        // Obtener detalles del post
        const response = await axios.get(`http://localhost:5000/posts/byId/${id}`); // Ruta actualizada
        setPostObject(response.data);

        // Si el usuario está autenticado, obtener su calificación
        if (authState.status) {
          try {
            const ratingResponse = await axios.get(`http://localhost:5000/ratings/${id}`, {
              headers: { accessToken: localStorage.getItem("accessToken") },
            });
            setUserRating(ratingResponse.data?.ratingValue || 0);
          } catch (error) {
            console.error("Error fetching user rating:", error);
          }
        }

        // Obtener comentarios del post
        const commentsResponse = await axios.get(`http://localhost:5000/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };

    fetchPostData();
  }, [id, authState.status]);

  useEffect(() => {
    const fetchTags = async () => {
      if (postObject.Dare && postObject.Dare._id) { // Cambiado 'id' a '_id'
        try {
          const response = await axios.get(`http://localhost:5000/dares/${postObject.Dare._id}`);
          setTags(response.data.Tags || []);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      }
    };

    fetchTags();
  }, [postObject.Dare]);

  const handleCommentSubmit = async (values, { resetForm }) => {
    try {
      const newComment = {
        ...values,
        PostId: id,
      };
      const response = await axios.post(
        "http://localhost:5000/comments",
        newComment,
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      );

      // Actualizar el estado de comentarios agregando el nuevo comentario
      setComments((prevComments) => [...prevComments, response.data]);
      resetForm();
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/comments/delete/${commentId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      });

      // Actualizar el estado de comentarios eliminando el comentario borrado
      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId) // Cambiado 'id' a '_id'
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${postId}`, { // Ruta actualizada
        headers: { accessToken: localStorage.getItem("accessToken") },
      });
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleDareClick = () => {
    if (postObject.Dare && postObject.Dare._id) { // Cambiado 'id' a '_id'
      navigate(`/dare/${postObject.Dare._id}`);
    }
  };

  const handleTagClick = (tag) => {
    navigate(`/tag/${tag._id}`); // Cambiado 'id' a '_id'
  };

  const handleStarClick = async (rating) => {
    if (authState.status) {
      try {
        await axios.post(
          `http://localhost:5000/ratings`,
          { PostId: id, ratingValue: rating },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        );
        setUserRating(rating);

        // Actualizar el averageRating del post sin necesidad de hacer otra solicitud
        setPostObject((prevPost) => ({
          ...prevPost,
          averageRating: calculateNewAverageRating(rating),
        }));
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };

  // Función hipotética para calcular el nuevo averageRating localmente
  const calculateNewAverageRating = (newRating) => {
    // Esta función dependerá de cómo se maneja el averageRating en el backend.
    // Si tienes acceso a los ratings actuales, podrías recalcular el promedio.
    // Por simplicidad, aquí solo devolvemos el valor anterior.
    return postObject.averageRating;
  };

  const stars = [1, 2, 3, 4, 5].map((rating) => (
    <span
      key={rating}
      className={`star ${userRating >= rating ? "filled" : ""}`}
      onClick={() => handleStarClick(rating)}
    >
      ★
    </span>
  ));

  return (
    <div className="post-page">
      <div className="post-content">
        <div className="post-details">
          <div className="post-header">
            {/* Safely access username with optional chaining */}
            {postObject.User?.username && (
              <span>{postObject.User.username}</span>
            )}

            {/* Check if authState and postObject.User are available */}
            {authState.username === postObject.User?.username && (
              <button
                onClick={() => {
                  deletePost(postObject._id); // Cambiado 'id' a '_id'
                }}
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="post-photo">
            {postObject.photoUrl && (
              <img
                src={`http://localhost:5000${postObject.photoUrl}`}
                alt="Post"
                className="post-image"
              />
            )}
          </div>
          <div className="post-text">{postObject.postText}</div>
          <div
            className="post-dare"
            onClick={handleDareClick}
            style={{ cursor: "pointer" }}
          >
            {postObject.DareId?.dare || "No dare information"}
          </div>
          <div className="dare-description">
            {postObject.Dare && (
              <>
                <div className="description">{postObject.Dare.description}</div>
                <div className="tags-container">
                  {tags.map((tag) => (
                    <button
                      key={tag._id} // Cambiado 'id' a '_id'
                      className="tag-button"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag.tagName}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="post-footer">
            <div className="points">
              Points: {postObject.DareId?.points ?? "N/A"}
            </div>
            <div className="reactions">
              <div className="stars">My rating: {stars}</div>
              <div>
                A post is approved if its overall rating is over 2.5 -{" "}
                {postObject.averageRating >= 2.5 ? "Approved" : "Disapproved"}
              </div>
            </div>
          </div>
        </div>
        <div className="comment-section">
          <h2>Comments</h2>
          {authState.status ? (
            <Formik
              initialValues={{ commentBody: "" }}
              onSubmit={handleCommentSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="comment-form">
                    <Field
                      as="textarea"
                      name="commentBody"
                      placeholder="Add a comment..."
                      className="comment-input"
                    />
                    <ErrorMessage
                      name="commentBody"
                      component="div"
                      className="error-message"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="submit-button"
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <p>You must be logged in to comment.</p>
          )}
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment-item"> {/* Cambiado 'id' a '_id' */}
                {/* Username inside a styled square */}
                <div className="comment-username">
                  {comment.UserId?.username || "Yo"}
                </div>

                {/* Comment text */}
                <div className="comment-text">{comment.commentBody}</div>

                {authState.id === comment.UserId && (
                  <button
                    onClick={() => {
                      deleteComment(comment._id); // Cambiado 'id' a '_id'
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
