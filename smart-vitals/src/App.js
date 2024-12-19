import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000';

const Home = () => (
  <div>
    <h1>Welcome to Patient Monitoring System</h1>
    <Link to="/patients">View Patients</Link>
  </div>
);

const PatientsList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/general/`)
      .then((response) => setPatients(response.data))
      .catch((error) => console.error('Error fetching patients:', error));
  }, []);

  return (
    <div>
      <h2>Patients List</h2>
      <Link to="/patients/new">Add New Patient</Link>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>
            <Link to={`/patients/${patient.id}/general`}>{patient.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PatientDetails = ({ match }) => {
  const { patient_id } = useParams();

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/general/`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error('Error fetching patient details:', error));

    axios
  .get(`${API_BASE_URL}/patients/${patient_id}/vitals/stats`)
  .then((response) => {
    console.log('Vitals API response:', response.data);
    setVitals(response.data);
  })
  .catch((error) => console.error('Error fetching vitals stats:', error));
  }, [patient_id]);

  const handleDelete = async () => {
    try {
      await axios.post(`${API_BASE_URL}/patients/${patient_id}/delete/`);
      alert('Patient deleted successfully');
      window.location.href = '/patients';
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  return (
    <div>
      {patient ? (
        <div>
          <h2>{patient.name}</h2>
          <p>Age: {patient.age}</p>
          <p>Gender: {patient.gender}</p>

          <button onClick={handleDelete}>Delete Patient</button>

          <h3>Vitals</h3>
          <ul>
            <li>Average Heart Rate: {vitals.avg_heart_rate}</li>
            <li>Maximum Heart Rate: {vitals.max_heart_rate}</li>
            <li>Minimum Heart Rate: {vitals.min_heart_rate}</li>
            <li>Average Oxygen Saturation: {vitals.avg_oxygen_saturation}</li>
            <li>Maximum Oxygen Saturation: {vitals.max_oxygen_saturation}</li>
            <li>Minimum Oxygen Saturation: {vitals.min_oxygen_saturation}</li>
            <li>Average Temperature: {vitals.avg_temperature}</li>
            <li>Maximum Temperature: {vitals.max_temperature}</li>
            <li>Minimum Temperature: {vitals.min_temperature}</li>
          </ul>
        </div>
      ) : (
          <p>Loading patient details...</p>
      )}
    </div>
  );
};

const AddPatient = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [embg, setEmbg] = useState('');
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
        embg
      };
      const response = await axios.post(`${API_BASE_URL}/patients/store/`, patient);
      alert(`Patient created successfully with ID: ${response.data.patient_id}`);
      window.location.href = '/patients';
    } catch (error) {
      console.error('Error creating patient:', error);
    }
  };

  return (
    <div>
      <h2>Add New Patient</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
              type="date"
              value={dateOfBirth}
              onChange={handleDateOfBirthChange}
              required
          />
        </div>
        <div>
        <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <label>EMBG:</label>
          <input
            type="text"
            value={embg}
            onChange={(e) => setEmbg(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

const App = () => (
  <Router>
    <Routes>
      <Route path="/" exact element={<Home/>} />
      <Route path="/patients" exact element={<PatientsList/>} />
      <Route path="/patients/new" exact element={<AddPatient/>} />
      <Route path="/patients/:patient_id/general"  exact element={<PatientDetails/>} />
    </Routes>
  </Router>
);

export default App;