import { createAttendanceSession } from "../api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocationHandler } from "../hooks/useLocation"; // ✅ use modular hook

const CreateSession = () => {
  const [formData, setFormData] = useState({
    subject: "",
    branch: "",
    division: "",
  });
  const [branches, setBranches] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const navigate = useNavigate();

  // ✅ Use centralized location hook
  const {
    location,
    locationError,
    loading: loadingLocation,
    refetch,
  } = useLocationHandler();

  // ✅ Preload dropdown data once
  useEffect(() => {
    setBranches(["Comp", "CSAI", "AIDS", "CSAIML"]);
    setDivisions(["A", "B", "C", "D"]);
    setSubjects([
      "Internet Of Things",
      "Database Management System",
      "Data Science",
      "Object Oriented Programming",
      "Mobile App Development",
      "Problem Solving And Programming",
    ]);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      toast.error("Please enable location services before proceeding.");
      return;
    }

    const facultyId = localStorage.getItem("facultyId");
    if (!facultyId) {
      toast.error("Faculty ID is not available. Please log in again.");
      navigate("/");
    }
    setLoadingSubmit(true);
    try {
      const response = await createAttendanceSession({
        ...formData,
        facultyId,
        ...location,
      });
      toast.success("✅ Attendance session created successfully!");
      navigate(`/view-attendance/${response.data.sessionId}`);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(message);
      console.error("Error creating attendance session:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Create Session</h1>
      <button onClick={() => navigate("/")} style={homeButtonStyle}>
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

      {/* ✅ Loading Spinner */}
      {loadingLocation ? (
        <div style={loaderBox}>
          <div style={spinnerStyle}></div>
          <p>Detecting your location...</p>
        </div>
      ) : locationError ? (
        <div style={errorContainerStyle}>
          <h3>{locationError}</h3>
          <button onClick={refetch} style={retryButtonStyle}>
            Retry Location
          </button>
        </div>
      ) : (
        // ✅ Form
        <>
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
            <button
              type="submit"
              style={{
                ...buttonStyle,
                backgroundColor: loadingSubmit ? "#aaa" : "#007bff",
                cursor: loadingSubmit ? "not-allowed" : "pointer",
              }}
              disabled={loadingSubmit}
            >
              {loadingSubmit ? "Creating Session..." : "Create Session"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default CreateSession;

/* ----------------------------- Styling Section ----------------------------- */

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f4f8",
  textAlign: "center",
};

const retryButtonStyle = {
  marginTop: "10px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  padding: "8px 16px",
  cursor: "pointer",
};

const loaderBox = { textAlign: "center" };

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
  border: "5px solid #f3f3f3",
  borderTop: "5px solid #3498db",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "0 auto",
};

const homeButtonStyle = {
  position: "absolute",
  top: "20px",
  right: "20px",
  color: "#fff",
  display: "flex",
  cursor: "pointer",
  alignItems: "center",
  gap: "4px",
  padding: "10px 15px",
  backgroundColor: "#007bff",
  borderRadius: "4px",
  border: "none",
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
  top: "10%",
  fontSize: "2rem",
  color: "#111",
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
