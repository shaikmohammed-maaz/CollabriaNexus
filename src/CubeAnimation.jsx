// CubeAnimation.jsx
import React from "react";
import "./CubeAnimation.css";

const CubeAnimation = ({ isMining }) => {
  return (
    <div className="cube-container">
      <div className={`cube ${isMining ? "rotate" : ""}`}>
        <div className="s1"></div>
        <div className="s2"></div>
        <div className="s3"></div>
        <div className="s4"></div>
        <div className="s5"></div>
        <div className="s6"></div>
      </div>
    </div>
  );
};

export default CubeAnimation;
