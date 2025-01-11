import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // For styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-title">Patient Monitoring Dashboard</h1>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/patients">Patients List</Link></li>
          <li><Link to="/patients/new">Add Patient</Link></li>
          <li><Link to="/patients/table">Patient Status Table</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
