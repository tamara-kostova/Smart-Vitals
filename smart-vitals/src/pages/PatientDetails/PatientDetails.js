import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PatientDetails.css";

const API_BASE_URL = "http://localhost:8000";

const PatientDetails = () => {
  const { patient_id } = useParams();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [loadingScore, setLoadingScore] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/general/`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error("Error fetching patient details:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/stats`)
      .then((response) => {
        setVitals(response.data);
      })
      .catch((error) => console.error("Error fetching vitals stats:", error));
  }, [patient_id]);

  const handleGenerateHealthScore = async () => {
    setLoadingScore(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/patients/${patient_id}/opinion`
      );
      setHealthScore(response.data);
    } catch (error) {
      console.error("Error generating health score:", error);
    } finally {
      setLoadingScore(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.post(`${API_BASE_URL}/patients/${patient_id}/delete/`);
      alert("Patient deleted successfully");
      window.location.href = "/patients";
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  return (
    <div className="patient-details-container">
      {patient && vitals ? (
        <div>
          <h2 className="patient-name">{patient.name}</h2>
          <div className="patient-info">
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
          </div>

            <h3 className="vitals-heading">Vitals</h3>
            <ul className="vitals-list">
              <li><strong>Average Heart Rate:</strong> <span
                  className="vital-value">{vitals.avg_heart_rate?.toFixed(2)}</span></li>
              <li><strong>Maximum Heart Rate:</strong> <span
                  className="vital-value">{vitals.max_heart_rate?.toFixed(2)}</span></li>
              <li><strong>Minimum Heart Rate:</strong> <span
                  className="vital-value">{vitals.min_heart_rate?.toFixed(2)}</span></li>
              <li><strong>Average Oxygen Saturation:</strong> <span
                  className="vital-value">{vitals.avg_oxygen_saturation?.toFixed(2)}</span></li>
              <li><strong>Maximum Oxygen Saturation:</strong> <span
                  className="vital-value">{vitals.max_oxygen_saturation?.toFixed(2)}</span></li>
              <li><strong>Minimum Oxygen Saturation:</strong> <span
                  className="vital-value">{vitals.min_oxygen_saturation?.toFixed(2)}</span></li>
              <li><strong>Average Temperature:</strong> <span
                  className="vital-value">{vitals.avg_temperature?.toFixed(3)}</span></li>
              <li><strong>Maximum Temperature:</strong> <span
                  className="vital-value">{vitals.max_temperature?.toFixed(3)}</span></li>
              <li><strong>Minimum Temperature:</strong> <span
                  className="vital-value">{vitals.min_temperature?.toFixed(3)}</span></li>
            </ul>


          <button className="delete-button" onClick={handleDelete}>
            Delete Patient
          </button>

          <button
            className="generate-health-score-button"
            onClick={handleGenerateHealthScore}
            disabled={loadingScore}
          >
            {loadingScore ? "Generating..." : "Generate Health Score"}
          </button>

          {healthScore && (
            <div className="health-score-container">
              <h4>Health Score:</h4>
              <p>{healthScore}</p>
            </div>
          )}
        </div>
      ) : (
          <p className="loading-text">Loading patient details...</p>
      )}
    </div>
  );
};

export default PatientDetails;
