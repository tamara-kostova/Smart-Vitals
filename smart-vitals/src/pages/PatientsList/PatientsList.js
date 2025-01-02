import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./PatientsList.css";

const API_BASE_URL = "http://localhost:8000";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/general/`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  return (
    <div className="container">
      <h2>Patients List</h2>
      <Link to="/patients/new" className="add-patient-link">
        Add New Patient
      </Link>
      <ul className="patient-list">
        {patients.map((patient) => (
          <li key={patient.id}>
            <Link to={`/patients/${patient.id}/general`} className="patient-link">
              <button className="patient-button">{patient.name}</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientsList;
