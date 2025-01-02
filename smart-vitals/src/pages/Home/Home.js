import { Link } from "react-router-dom";
import React from "react";
import "./Home.css";

const Home = () => (
  <div className="home-container">
    <h1 className="home-title">Welcome to the Patient Monitoring System</h1>
    <Link to="/patients" className="home-link">View Patients</Link>
  </div>
);

export default Home;
