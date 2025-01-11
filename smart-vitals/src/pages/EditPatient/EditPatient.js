import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./EditPatient.css";

const API_BASE_URL = "http://localhost:8000";

const EditPatient = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [embg, setEmbg] = useState("");
  const [age, setAge] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/edit/`);
        const patient = response.data;
        
        setName(patient.name);
        setSurname(patient.surname);
        setDateOfBirth(patient.date_of_birth.split('T')[0]);
        setGender(patient.gender);
        setEmbg(patient.embg);
        setAge(patient.age);
      } catch (error) {
        console.error("Error fetching patient:", error);
        alert("Error loading patient data");
      }
    };

    fetchPatient();
  }, [patientId]);

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

      await axios.post(`${API_BASE_URL}/patients/${patientId}/edit/`, patient);
      alert("Patient updated successfully");
      navigate("/patients");
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Error updating patient");
    }
  };

  return (
    <div className="add-patient-container">
      <h2 className="add-patient-title">Edit Patient</h2>
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
            Update Patient
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

export default EditPatient;