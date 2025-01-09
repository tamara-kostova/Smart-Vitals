import React, { useState, useEffect } from "react";
import "./PatientStatusTable.css";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

const PatientStatusTable = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingScores, setLoadingScores] = useState({}); // Per-patient loading state
  const [healthScores, setHealthScores] = useState({}); // Store health scores for patients

  // Fetch all patients on component mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/general/`)
      .then((response) => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        setLoading(false); // Stop loading on error
      });
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus
        ? `${API_BASE_URL}/patients/${id}/deactivate`
        : `${API_BASE_URL}/patients/${id}/activate`;

      // Send the request to update the patient's status
      await axios.post(endpoint);

      // Update the local state to reflect the new status
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === id ? { ...patient, active: !currentStatus } : patient
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleGenerateHealthScore = async (patient_id) => {
    setLoadingScores((prev) => ({ ...prev, [patient_id]: true })); // Set loading for the specific patient
    try {
      const response = await axios.get(
        `${API_BASE_URL}/patients/${patient_id}/status`
      );

      // Update health scores with the response
      setHealthScores((prev) => ({ ...prev, [patient_id]: response.data }));
    } catch (error) {
      console.error("Error generating health score:", error);
    } finally {
      setLoadingScores((prev) => ({ ...prev, [patient_id]: false })); // Reset loading
    }
  };

  if (loading) {
    return <div>Loading patients...</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="header-cell">Patient Id</div>
        <div className="header-cell">Patient Name</div>
        <div className="header-cell">Status</div>
        <div className="header-cell">LLM Health Score</div>
      </div>
      {patients.length > 0 ? (
          patients.map((patient) => (
          <div className="table-row" key={patient.id}>
            <Link to={`/patients/${patient.id}/general`} className="row-cell1">
              {patient.id}
            </Link>
            <Link to={`/patients/${patient.id}/general`} className="row-cell2">
              {patient.name}
            </Link>


            <div
              className={`row-cell status ${
                patient.active ? "active" : "deactive"
              }`}
            >
              <button
                className={`status-button ${
                  patient.active ? "active-btn" : "deactive-btn"
                }`}
                onClick={() => toggleStatus(patient.id, patient.active)}
              >
                {patient.active ? "Active" : "Deactivated"}
              </button>
            </div>
            <div
              className="row-cell health-score"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "5px",
                backgroundColor: "#f4f4f4",
              }}
            >
              {/* Health score text */}
              <span
                style={{
                  fontWeight: "800",
                  color: "#333",
                  fontSize: "18px",
                  textTransform: "capitalize",
                }}
              >
                {healthScores[patient.id] || "No score"}
              </span>

              {/* Generate health score button */}
              <button
                className="generate-health-score-button"
                onClick={() => handleGenerateHealthScore(patient.id)} // Pass function reference
                disabled={loadingScores[patient.id]} // Disable button during loading
              >
                {loadingScores[patient.id] ? "Generating..." : "Generate Health Score"}
              </button>
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
