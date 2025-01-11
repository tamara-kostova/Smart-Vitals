import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddPatient.css";

const API_BASE_URL = "http://localhost:8000";

const AddPatient = () => {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [embg, setEmbg] = useState("");
  const [age, setAge] = useState(null);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  };

  const handleDateOfBirthChange = (e) => {
    const dob = e.target.value;
    setDateOfBirth(dob);
    setAge(calculateAge(dob));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patient = {
        name,
        surname,
        gender,
        date_of_birth: dateOfBirth,
        age,
        embg,
      };
      const response = await axios.post(`${API_BASE_URL}/patients/store/`, patient);
      alert(`Patient created successfully with ID: ${response.data.patient_id}`);
      navigate("/patients");
    } catch (error) {
      console.error("Error creating patient:", error);
    }
  };

  return (
    <div className="add-patient-container">
      <h2 className="add-patient-title">Add New Patient</h2>
      <form onSubmit={handleSubmit} className="add-patient-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dateOfBirth}
            onChange={handleDateOfBirthChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="form-input"
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div className="form-group">
          <label>EMBG:</label>
          <input
            type="text"
            value={embg}
            onChange={(e) => setEmbg(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">
            Add Patient
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/patients")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPatient;