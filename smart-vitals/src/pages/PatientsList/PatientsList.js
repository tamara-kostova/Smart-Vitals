import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PatientsList.css";

const API_BASE_URL = "http://localhost:8000";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/general/`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Patients List</h2>
      <Link to="/patients/new" className="add-patient-link">
        Add New Patient
      </Link>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <ul className="patient-list">
        {filteredPatients.map((patient) => (
          <li key={patient.id} className="patient-item">
            <Link to={`/patients/${patient.id}/general`} className="patient-link">
              <button className="patient-button">{patient.name}</button>
            </Link>
            <Link to={`/patients/${patient.id}/edit`} className="edit-link">
              <button className="edit-button">Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsList;
