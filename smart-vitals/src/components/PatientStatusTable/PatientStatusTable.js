import React, { useState, useEffect } from "react";
import "./PatientStatusTable.css";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8000';

const PatientStatusTable = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patients/general/`);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const toggleStatus = (id) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id
          ? { ...patient, status: patient.status === "Active" ? "Deactivate" : "Active" }
          : patient
      )
    );
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="header-cell">Patient</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">LLM Health Score</div>
      </div>
      {patients.map((patient) => (
        <div className="table-row" key={patient.id}>
          <div className="row-cell patient-id">{patient.id}</div>
          <div
            className={`row-cell status ${
              patient.status === "Active" ? "active" : "deactive"
            }`}
          >
            <button
              className={`status-button ${patient.status === "Active" ? "active-btn" : "deactive-btn"}`}
              onClick={() => toggleStatus(patient.id)}
            >
              {patient.status}
            </button>
          </div>
          <div
            className={`row-cell health-score ${
              patient.healthScore === "Normal"
                ? "normal"
                : patient.healthScore === "At Risk"
                ? "at-risk"
                : "unknown"
            }`}
          >
            {patient.healthScore}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientStatusTable;