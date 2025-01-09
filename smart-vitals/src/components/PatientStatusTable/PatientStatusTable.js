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
        const updatedPatients = response.data.map((patient) => ({
          ...patient,
          status: patient.active ? "Active" : "Inactive"  // Set status based on isActive
        }));
        setPatients(updatedPatients);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false);  // Even on error, stop loading
      });
  }, []);

  useEffect(() => {
    console.log("Fetched patients:", patients);
  }, [patients]);

  const toggleStatus = async (id, currentStatus) => {
  try {
    let endpoint = '';
    let newStatus = false;

    // Check if the current status is Active or Deactive
    if (currentStatus) {
      // If active, send the request to deactivate
      endpoint = `http://localhost:8000/patients/${id}/deactivate`;
      newStatus = false;  // Set the new status to inactive
    } else {
      // If deactivated, send the request to activate
      endpoint = `http://localhost:8000/patients/${id}/activate`;
      newStatus = true;  // Set the new status to active
    }

    // Send the appropriate request to the backend to update the patient's status
    await axios.post(endpoint);

    // Update the local state to reflect the new status
    setPatients((prevPatients) =>
      prevPatients.map((patient) =>
        patient.id === id
          ? { ...patient, active: newStatus }
          : patient
      )
    );
  } catch (error) {
    console.error("Error toggling status:", error);
  }
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
                  className={`row-cell status ${patient.active ? "active" : "deactive"}`}
              >
                <button
                    className={`status-button ${patient.active ? "active-btn" : "deactive-btn"}`}
                    onClick={() => toggleStatus(patient.id, patient.active)}
                >
                  {patient.active ? "Active" : "Deactivated"}
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