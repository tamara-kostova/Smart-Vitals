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
        console.log("Server response:", response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

//   const toggleStatus = (id) => {
//   setPatients((prevPatients) =>
//     prevPatients.map((patient) =>
//       patient.id === id
//         ? { ...patient, active: !patient.active }
//         : patient
//     )
//   );
// };
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
            {/*<h1>{patient.id}</h1>*/}
            <div
                className={`row-cell status ${patient.active ? "active" : "deactive"}`}
            >
              <button
                  className={`status-button ${patient.active ? "active-btn" : "deactive-btn"}`}
                  onClick={() => toggleStatus(patient.id,patient.active)}
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
              {patient.healthScore}
            </div>
          </div>
      ))}
    </div>
  );
};

export default PatientStatusTable;