import React, { useState, useEffect } from "react";
import "./PatientStatusTable.css";
import axios from "axios";
import {Link} from "react-router-dom";

const API_BASE_URL = 'http://localhost:8000';

const PatientStatusTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/general/`)
      .then((response) => {
        // You can transform the data here if needed
        const updatedPatients = response.data.map((patient) => ({
          ...patient,
          status: patient.active ? "Active" : "Inactive"  // Set status based on isActive
        }));
        setPatients(updatedPatients); // Set the patients with updated status
        setLoading(false);  // Set loading to false after the data is fetched
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false);  // Even on error, stop loading
      });
  }, []);

  useEffect(() => {
    console.log("Fetched patients:", patients);
  }, [patients]);

  const toggleStatus = (id) => {
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id
          ? { ...patient, status: patient.status === "Active" ? "Inactive" : "Active" }
          : patient
      )
    );
  };

  if (loading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="header-cell">Patient</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">LLM Health Score</div>
      </div>
      {patients.length > 0 ? (
        patients.map((patient) => (
            <div className="table-row" key={patient.id}>
              {/*<div className="row-cell patient-id" style={{visibility: "visible"}}>*/}
              {/*  {patient.id}*/}
              {/*</div>*/}
                <Link to={`/patients/${patient.id}/general`} className="patient-id row-cell">
                    <div className="row-cell patient-id" style={{visibility: "visible"}}>
                        {patient.id}
                    </div>
                </Link>
                <div
                    className={`row-cell status ${
                        patient.status === "Active" ? "active" : "inactive"
                  }`}
              >
                <button
                    className={`status-button ${patient.status === "Active" ? "active-btn" : "deactive-btn"}`}
                    onClick={() => toggleStatus(patient.id)}
                >
                    {patient.status || "No status"}
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
                {patient.healthScore || "No score"}
              </div>

            </div>
        ))
      ) : (
          <p>No patients found.</p>
      )}
    </div>
  );
};


export default PatientStatusTable;