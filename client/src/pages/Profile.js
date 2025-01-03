import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import axios from "axios";
import "../styles/Profile.css"; // Asegúrate de importar el archivo CSS

export default function Profile() {
  let { id } = useParams();
  const [username, setUsername] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [userRatings, setUserRatings] = useState({});
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/auth/basicinfo/${id}`).then((response) => {
      setUsername(response.data.username);
      setTotalPoints(response.data.totalPoints);
    });
    axios.get(`http://localhost:5000/posts/byuserid/${id}`).then((response) => {
      setListOfPosts(response.data);
    });
  }, [id]);

  useEffect(() => {
    if (authState.status) {
      // Only fetch ratings if the user is logged in
      axios
        .get("http://localhost:5000/ratings", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          const ratingsData = response.data.reduce((acc, rating) => {
            acc[rating.PostId] = rating.ratingValue;
            return acc;
          }, {});
          setUserRatings(ratingsData);
        });
    }
  }, [authState.status]);

  const handlePostClick = (post) => {
    navigate(`/post/${post._id}`);
  };

  const rateAPost = (postId, ratingValue) => {
    if (authState.status) {
      // Check if user is logged in before submitting
      axios
        .post(
          "http://localhost:5000/ratings",
          { PostId: postId, ratingValue },
          { headers: { accessToken: localStorage.getItem("accessToken") } }
        )
        .then(() => {
          setUserRatings((prevRatings) => ({
            ...prevRatings,
            [postId]: ratingValue,
          }));
        })
        .catch((error) => {
          console.error("Error submitting rating:", error);
        });
    }
  };

  const renderStars = (postId) => {
    if (!authState.status) return null; // Don't render stars if user is not logged in

    const currentRating = userRatings[postId] || 0;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? "filled" : ""}`}
          onClick={() => rateAPost(postId, i)}
        >
          ★
        </span>
      );
    }

    return <div className="stars">{stars}</div>;
  };

  return (
    <div className="profile-container">
      <div className="points-display">
        Points: {totalPoints}
      </div>
      {/* Conditionally render text based on the user's id */}
      <h1>
        {authState.id === parseInt(id) ? "My profile" : `Page of: ${username}`}
      </h1>

      <div className="post-container">
        {listOfPosts.map((post, key) => (
          <div className="post-box" key={key}>
            <div className="post-header">
              <span>{post.UserId.username}</span>
            </div>
            <div className="post-content" onClick={() => handlePostClick(post)}>
              <div className="post-photo">
                <img
                  src={`http://localhost:5000${post.photoUrl}`}
                  alt="Post"
                  className="post-image"
                />
              </div>
              <div className="post-details">
                <div className="post-text">{post.postText}</div>
                <div className="post-dare">{post.DareId.dare}</div>
              </div>
            </div>
            <div className="post-footer">
              {renderStars(post.id)} {/* Render star rating if logged in */}
              <div className="points">
                Points: {post.DareId ? post.DareId.points : "N/A"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
