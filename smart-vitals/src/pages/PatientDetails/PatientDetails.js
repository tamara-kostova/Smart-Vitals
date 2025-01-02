import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "./PatientDetails.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = "http://localhost:8000";

const PatientDetails = () => {
  const { patient_id } = useParams();
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [temperatures, setTemperatures] = useState([]);
  const [temperatureCategories, setTemperatureCategories] = useState([]);
  const [heartRate, setHeartRate] = useState([]);
  const [heartRateCategories, setHeartRateCategories] = useState([]);
  const [saturation, setSaturation] = useState([]);
  const [saturationCategories, setSaturationCategories] = useState([]);
  const [systolic, setSystolic] = useState([]);
  const [systolicCategories, setSystolicCategories] = useState([]);
  const [diastolic, setDiastolic] = useState([]);
  const [diastolicCategories, setDiastolicCategories] = useState([]);
  const [isActive, setIsActive] = useState();

  const categorizeTemperatures = (temperatures) => {
  const ranges = {
    Low: [0, 36.0],
    Normal: [36.0, 37.5],
    High: [37.5, 38.0],
    Fever: [38.0, Infinity],
  };

  const counts = {
    Low: 0,
    Normal: 0,
    High: 0,
    Fever: 0,
  };

  temperatures.forEach((temp) => {
    if (temp >= ranges.Low[0] && temp < ranges.Low[1]) counts.Low++;
    else if (temp >= ranges.Normal[0] && temp < ranges.Normal[1]) counts.Normal++;
    else if (temp >= ranges.High[0] && temp < ranges.High[1]) counts.High++;
    else if (temp >= ranges.Fever[0]) counts.Fever++;
  });

  return counts;
};

  const categorizeHeartRates = (heartRates) => {
  const ranges = {
    Resting: [60, 100],
    Moderate: [101, 130],
    Vigorous: [131, Infinity],
  };

  const counts = {
    Resting: 0,
    Moderate: 0,
    Vigorous: 0,
  };

  heartRates.forEach((heartRate) => {
    if (heartRate >= ranges.Resting[0] && heartRate < ranges.Resting[1]) counts.Resting++;
    else if (heartRate >= ranges.Moderate[0] && heartRate < ranges.Moderate[1]) counts.Moderate++;
    else if (heartRate >= ranges.Vigorous[0]) counts.Vigorous++;
  });

  return counts;
};

   const categorizeSaturations = (saturations) => {
  const ranges = {
    Normal: [95.0, 100.0],
    Insufficient: [90.0, 95.0],
    Decreased: [85.0, 90.0],
    Critical: [80.0, 85.0],
    Severe: [75.0, 80.0],
    Acute: [0.0, 75.0],
  };

  const counts = {
    Normal: 0,
    Insufficient: 0,
    Decreased: 0,
    Critical: 0,
    Severe: 0,
    Acute: 0,
  };

  saturations.forEach((sat) => {
    if (sat >= ranges.Normal[0] && sat < ranges.Normal[1]) counts.Normal++;
    else if (sat >= ranges.Insufficient[0] && sat < ranges.Insufficient[1]) counts.Insufficient++;
    else if (sat >= ranges.Decreased[0] && sat < ranges.Decreased[1]) counts.Decreased++;
    else if (sat >= ranges.Critical[0] && sat < ranges.Critical[1]) counts.Critical++;
    else if (sat >= ranges.Severe[0] && sat < ranges.Severe[1]) counts.Severe++;
    else if (sat >= ranges.Acute[0]) counts.Acute++;
  });

  return counts;
};

    const categorizeSystolic = (systolic) => {
  const ranges = {
    Normal: [0, 120],
    Elevated: [121, 130],
    ISH1: [131, 140],
    ISH2: [141, 150],
    Mild: [151, 160],
    Moderate: [161, 170],
    Severe: [171, Infinity],
  };

  const counts = {
    Normal: 0,
    Elevated: 0,
    ISH1: 0,
    ISH2: 0,
    Mild: 0,
    Moderate: 0,
    Severe: 0,
  };

  systolic.forEach((sys) => {
    if (sys >= ranges.Normal[0] && sys < ranges.Normal[1]) counts.Normal++;
    else if (sys >= ranges.Elevated[0] && sys < ranges.Elevated[1]) counts.Elevated++;
    else if (sys >= ranges.ISH1[0] && sys < ranges.ISH1[1]) counts.ISH1++;
    else if (sys >= ranges.ISH2[0] && sys < ranges.ISH2[1]) counts.ISH2++;
    else if (sys >= ranges.Mild[0] && sys < ranges.Mild[1]) counts.Mild++;
    else if (sys >= ranges.Moderate[0] && sys < ranges.Moderate[1]) counts.Moderate++;
    else if (sys >= ranges.Severe[0]) counts.Severe++;
  });

  return counts;
};

    const categorizeDiastolic = (diastolic) => {
  const ranges = {
    Normal: [61, 70],
    ISH1: [51, 60],
    ISH2: [41, 50],
    Mild: [71, 80],
    Moderate: [81, 90],
    Severe: [91, Infinity],
  };

  const counts = {
    Normal: 0,
    ISH1: 0,
    ISH2: 0,
    Mild: 0,
    Moderate: 0,
    Severe: 0,
  };

  diastolic.forEach((dia) => {
    if (dia >= ranges.Normal[0] && dia < ranges.Normal[1]) counts.Normal++;
    else if (dia >= ranges.ISH1[0] && dia < ranges.ISH1[1]) counts.ISH1++;
    else if (dia >= ranges.ISH2[0] && dia < ranges.ISH2[1]) counts.ISH2++;
    else if (dia >= ranges.Mild[0] && dia < ranges.Mild[1]) counts.Mild++;
    else if (dia >= ranges.Moderate[0] && dia < ranges.Moderate[1]) counts.Moderate++;
    else if (dia >= ranges.Severe[0]) counts.Severe++;
  });

  return counts;
};

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/general/`)
      .then((response) => {
        setPatient(response.data[0]);
        setIsActive(response.data[0].active);
      })
      .catch((error) => console.error("Error fetching patient details:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/stats`)
      .then((response) => {
        setVitals(response.data);
      })
      .catch((error) => console.error("Error fetching vitals stats:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/heartrate`)
      .then((response) => {
      const heartRatesOnly = response.data.map((item) => item.heart_rate);
      setHeartRate(heartRatesOnly);

      const categorized = categorizeHeartRates(heartRatesOnly);
      setHeartRateCategories(categorized);
      })
      .catch((error) => console.error("Error fetching heart rates:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/saturation`)
      .then((response) => {
      const saturationsOnly = response.data.map((item) => item.oxygen_saturation);
      setSaturation(saturationsOnly);

      const categorized = categorizeSaturations(saturationsOnly);
      setSaturationCategories(categorized);
      })
      .catch((error) => console.error("Error fetching saturation:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/systolic`)
      .then((response) => {
      const systolicsOnly = response.data.map((item) => item.blood_pressure_systolic);
      setSystolic(systolicsOnly);

      const categorized = categorizeSystolic(systolicsOnly);
      setSystolicCategories(categorized);
      })
      .catch((error) => console.error("Error fetching systolic:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/diastolic`)
      .then((response) => {
      const diastolicsOnly = response.data.map((item) => item.blood_pressure_diastolic);
      setDiastolic(diastolicsOnly);

      const categorized = categorizeDiastolic(diastolicsOnly);
      setDiastolicCategories(categorized);
      })
      .catch((error) => console.error("Error fetching diastolic:", error));

    axios
      .get(`${API_BASE_URL}/patients/${patient_id}/vitals/temperature`)
      .then((response) => {
      const temperaturesOnly = response.data.map((item) => item.temperature);
      setTemperatures(temperaturesOnly);

      const categorized = categorizeTemperatures(temperaturesOnly);
      setTemperatureCategories(categorized);
      })
      .catch((error) => console.error("Error fetching temperatures:", error));
  }, [patient_id]);

  const handleDelete = async () => {
    try {
      await axios.post(`${API_BASE_URL}/patients/${patient_id}/delete/`);
      alert("Patient deleted successfully");
      window.location.href = "/patients";
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const handleDeactivate = async () => {
  try {
    await axios.post(`${API_BASE_URL}/patients/${patient_id}/deactivate/`);
    setIsActive(false);
  } catch (error) {
    console.error("Error deactivating patient:", error);
  }
};

  const chartTemperature = (categories) => ({
  labels: ["Low", "Normal", "High", "Fever"],
    textColor: "#FFF",
  datasets: [
    {
      label: "Temperature Distribution",
      data: [
        categories.Low || 0,
        categories.Normal || 0,
        categories.High || 0,
        categories.Fever || 0,
      ],
      backgroundColor: ["#D3D3D3", "#A9A9A9", "#FF474C", "#8B0000"],
      textColor: "#FFF",
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: "Temperature Distribution",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Temperature Distribution',
    },
  },
});

  const chartHeartRate = (categories) => ({
  labels: ["Resting", "Moderate", "Vigorous"],
  datasets: [
    {
      label: "Temperature Distribution",
      data: [
        categories.Resting || 0,
        categories.Moderate || 0,
        categories.Vigorous || 0,
      ],
      backgroundColor: ["#A9A9A9", "#FF474C", "#8B0000"],
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: "Heart Rate Distribution",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Heart Rate Distribution',
    },
  },
});

   const chartSaturation = (categories) => ({
  labels: ["Normal", "Insufficient", "Decreased", "Critical", "Severe", "Acute"],
  datasets: [
    {
      label: "Saturation Distribution",
      data: [
        categories.Normal || 0,
        categories.Insufficient || 0,
        categories.Decreased || 0,
        categories.Critical || 0,
        categories.Severe || 0,
        categories.Acute || 0,
      ],
      backgroundColor: ["#A9A9A9", "#FF474C", "#8B0000", "#111111", "#AC8787", "#FFCCFF"],
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: "Saturation Distribution",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Saturation Distribution',
    },
  },
});

  const chartData = (data) => ({
    labels: ["Low", "Normal", "High", "Fever"],
    datasets: [
      {
        label: "Temperature",
        data: [data, 100 - data],
        backgroundColor: ["#D3D3D3", "#A9A9A9", "#FF474C", "#8B0000"],
        borderWidth: 1,
      },
    ],
    options: {
      responsive: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Temperature'
      }
    },
  });

  const chartSystolic = (categories) => ({
  labels: ["Normal", "Elevated", "ISH1", "ISH2", "Mild", "Moderate", "Severe"],
  datasets: [
    {
      label: "Systolic Distribution",
      data: [
        categories.Normal || 0,
        categories.Elevated || 0,
        categories.ISH1 || 0,
        categories.ISH2 || 0,
        categories.Mild || 0,
        categories.Moderate || 0,
        categories.Severe || 0,
      ],
      backgroundColor: ["#A9A9A9", "#FF474C", "#8B0000", "#123456", "#289183", "#AACCFF", "#876532"],
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
        },
      },
      title: {
        display: true,
        text: "Systolic Distribution",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Systolic Distribution',
    },
  },
});

  const chartDiastolic = (categories) => ({
  labels: ["Normal", "ISH1", "ISH2", "Mild", "Moderate", "Severe"],
  datasets: [
    {
      label: "Systolic Distribution",
      data: [
        categories.Normal || 0,
        categories.ISH1 || 0,
        categories.ISH2 || 0,
        categories.Mild || 0,
        categories.Moderate || 0,
        categories.Severe || 0,
      ],
      backgroundColor: ["#A9A9A9", "#FF474C", "#8B0000", "#123456", "#289183", "#AACCFF"],
      borderWidth: 1,
    },
  ],
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
        },
      },
      title: {
        display: true,
        text: "Diastolic Distribution",
      },
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
  },
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Diastolic Distribution',
    },
  },
});

  return (
    <div className="patient-details-container">
      {patient ? (
        <>
          <div className="patient-header">
            <div className="patient-photo">
              {/*<img src="/public/person.png" alt="Patient"/>*/}
              <img src={require('.//person.png')} alt="Patient"/>
            </div>
            <div className="patient-info">
              <h2>
                {patient.name} {patient.surname}
              </h2>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Date of Birth:</strong> {patient.date_of_birth}
              </p>
              <div>
                <button
                    className={`deactivate-button ${!isActive ? "disabled" : ""}`}
                    onClick={isActive ? handleDeactivate : null}
                    disabled={!isActive}
                >
                  {isActive ? "Deactivate Patient" : "Deactivated"}
                </button>
              </div>
            </div>
          </div>

          <div className="vitals-section">
            <div className="vitals-left">
              <h3>Vitals</h3>
              <div className="vitals-list">
                <div className="vital-item">
                  <div className="vital-circle"></div>
                  <div className="vital-name">Heart Rate</div>
                  <div className="vital-value-box">
                    <span className="vital-value">{vitals.avg_heart_rate}</span>
                    <span className="vital-metric">bpm</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-circle"></div>
                  <div className="vital-name">Oxygen Saturation</div>
                  <div className="vital-value-box">
                    <span className="vital-value">
                      {vitals.avg_oxygen_saturation}
                    </span>
                    <span className="vital-metric">  % </span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-circle"></div>
                  <div className="vital-name">Temperature</div>
                  <div className="vital-value-box">
                    <span className="vital-value">{vitals.avg_temperature}</span>
                    <span className="vital-metric">C</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-circle"></div>
                  <div className="vital-name">Systolic Pressure</div>
                  <div className="vital-value-box">
                    <span className="vital-value">{vitals.avg_blood_pressure_systolic}</span>
                    <span className="vital-metric">bpm</span>
                  </div>
                </div>
                <div className="vital-item">
                  <div className="vital-circle"></div>
                  <div className="vital-name">Diastolic Pressure</div>
                  <div className="vital-value-box">
                    <span className="vital-value">{vitals.avg_blood_pressure_diastolic}</span>
                    <span className="vital-metric">bpm</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="vitals-right">
              <h3>Charts</h3>
              <div className="vitals-charts">
                <div className="chart-container">
                  <Doughnut data={chartHeartRate(heartRateCategories)}/>
                  <p>Heart Rate</p>
                </div>
                <div className="chart-container">
                  <Doughnut data={chartSaturation(saturationCategories)}/>
                  <p>Oxygen Saturation</p>
                </div>
                <div className="chart-container">
                  <Doughnut data={chartTemperature(temperatureCategories)}/>
                  <p>Temperature</p>
                </div>
                <div className="chart-container">
                  <Doughnut data={chartSystolic(systolicCategories)}/>
                  <p>Systolic Pressure</p>
                </div>
                <div className="chart-container">
                  <Doughnut data={chartDiastolic(diastolicCategories)}/>
                  <p>Diastolic Pressure</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div>
          <button className="delete-button" onClick={handleDelete}>
            Delete Patient
          </button>
            </div>
            </div>
        </>
      ) : (
          <p className="loading-text">Loading patient details...</p>
      )}
    </div>
  );
};

export default PatientDetails;
