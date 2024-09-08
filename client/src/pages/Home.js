import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import "../Home.css";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    axios
      .get("http://localhost:5000/posts")
      .then((response) => {
        setListOfPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  const handlePostClick = (post) => {
    console.log("Post clicked:", post);
    navigate(`/post/${post.id}`); // Use navigate to change the route
  };

  return (
    <div className="post-container">
      {listOfPosts.map((post, key) => (
        <div
          className="post-box"
          key={key}
          onClick={() => handlePostClick(post)} // Add onClick event
        >
          <div className="post-header">
            <span>{post.username}</span>
          </div>
          <div className="post-content">
            <div className="post-photo">
              <img
                src={`http://localhost:5000${post.photoUrl}`}
                alt="Post"
                className="post-image"
              />
            </div>
            <div className="post-details">
              <div className="post-text">{post.postText}</div>
              <div className="post-dare">{post.dare}</div>
              <div className="post-footer">
                <div className="points">
                  Points: {post.approvals - post.disapproval}
                </div>
                <div className="reactions">
                  <span className="approve">👍 {post.approvals}</span>
                  <span className="disapprove">👎 {post.disapproval}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
