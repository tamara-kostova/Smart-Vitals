import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import PatientsList from "./pages/PatientsList/PatientsList";
import AddPatient from "./pages/AddPatient/AddPatient";
import PatientDetails from "./pages/PatientDetails/PatientDetails";
import PatientStatusTable from "./components/PatientStatusTable/PatientStatusTable";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/patients" element={<PatientsList />} />
            <Route path="/patients/new" element={<AddPatient />} />
            <Route path="/patients/:patient_id/general" element={<PatientDetails />} />
            <Route path="/patients/table" element={<PatientStatusTable />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
