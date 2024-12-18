import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

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
            <Link to={`/patients/${patient.id}`}>{patient.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PatientDetails = ({ match }) => {
  console.log(match);
  const { patient_id } = 5;

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/19/general/`)
      .then((response) => setPatient(response.data))
      .catch((error) => console.error('Error fetching patient details:', error));

    axios
      .get(`${API_BASE_URL}/patients/19/vitals/status`)
      .then((response) => setVitals(response.data))
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
            {vitals.map((vital, index) => (
              <li key={index}>{vital.type}: {vital.value}</li>
            ))}
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
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const patient = { name, age: parseInt(age), gender };
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
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
      <Route path="/patients/:patient_id" exact element={<PatientDetails/>} />
    </Routes>
  </Router>
);

export default App;