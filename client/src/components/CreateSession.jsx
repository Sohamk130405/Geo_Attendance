import { createAttendanceSession } from "../api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getLocation } from "../getlocation";

const CreateSession = () => {
  const [formData, setFormData] = useState({
    subject: "",
    branch: "",
    division: "",
  });
  const [branches, setBranches] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for location detection
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranchesAndDivisions = () => {
      const branchesData = ["Comp", "CSAI", "AIDS", "CSAIML"];
      const divisionsData = ["A", "B", "C", "D"];
      const subjectData = [
        "Internet Of Things",
        "Database Management System",
        "Data Science",
        "Object Oriented Programming",
        "Mobile App Development",
        "Problem Solving And Programming",
      ];
      setBranches(branchesData);
      setDivisions(divisionsData);
      setSubjects(subjectData);
    };
    fetchBranchesAndDivisions();

    // Force location access when the component is mounted
    const enableLocation = async () => {
      try {
        let result = await getLocation();
        setLocationEnabled(true);
        setLoading(false); // Stop loading after fetching location
        toast.success(result.latitude + "," + result.longitude);
      } catch (error) {
        setLocationError("Please enable location services to proceed.");
        setLoading(false); // Stop loading even if location fetching fails
        toast.error(error);
      }
    };
    enableLocation();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!locationEnabled) {
      toast.error("Please enable location services before proceeding.");
      return;
    }

    const facultyId = localStorage.getItem("facultyId");

    if (!facultyId) {
      toast.error("Faculty ID is not available. Please log in again.");
      return;
    }

    try {
      const location = await getLocation();
      const response = await createAttendanceSession({
        ...formData,
        facultyId,
        ...location,
      });
      toast.success("Attendance session created successfully!");
      navigate(`/view-attendance/${response.data.sessionId}`);
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create attendance session.");
    }
  };

  const errorContainerStyle = {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#ffdddd",
    borderRadius: "5px",
    color: "#d8000c",
    marginBottom: "20px",
    fontSize: "18px",
  };

  const spinnerStyle = {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3", // Light gray
    borderTop: "5px solid #3498db", // Blue
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  };

  const homeButtonStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    padding: "10px",
    color: "#fff",
    backgroundColor: "transparent",
    border: "none",
    display: "flex",
    cursor: "pointer",
    alignItems: "center",
    gap: "4px",
    padding: "10px 15px",
    backgroundColor: "#007bff",
    borderRadius: "4px",
  };

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate("/")} style={homeButtonStyle}>
        {" "}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="20px"
          height="20px"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
        Home
      </button>
      {loading ? (
        <div>
          <div style={spinnerStyle}></div>
          <p>Detecting location...</p>
        </div>
      ) : !locationEnabled ? (
        <div style={errorContainerStyle}>
          <h2>
            {locationError ||
              "Location services are required to create a session."}
          </h2>
        </div>
      ) : (
        <>
          <h1 style={headerStyle}>Create Attendance Session</h1>
          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={divStyle}>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                style={dropDownStyle}
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <select
                name="division"
                value={formData.division}
                onChange={handleChange}
                required
                style={dropDownStyle}
              >
                <option value="" disabled>
                  Select Division
                </option>
                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>
            </div>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={inputStyle}
            >
              <option value="" disabled>
                Select Subject
              </option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            <button type="submit" style={buttonStyle}>
              Create Session
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateSession;

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f4f8", // Light blue-gray background
  textAlign: "center",
};

const spin = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${spin}</style>`);

const headerStyle = {
  position: "absolute",
  top: "5%",
  fontSize: "2rem",
  color: "#111", // Primary blue color for text
  marginBottom: "40px",
  border: "2px solid #444",
  padding: "10px",
  borderRadius: "10px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
};

const divStyle = {
  display: "flex",
  width: "100%",
  gap: "5px",
};

const dropDownStyle = {
  flex: "1",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "300px",
};

const buttonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "5px",
  backgroundColor: "beige",
  color: "black",
  border: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};
