import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student"); // State to manage the selected role

  const handleViewAttendance = () => {
    const sessionId = prompt("Please enter the session ID:");

    if (sessionId) {
      // Redirect to the view attendance page with the session ID
      navigate(`/view-attendance/${sessionId}`);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Clear any tokens or session data
    localStorage.removeItem("facultyId");
    // Update the logged-in state
    setIsLoggedIn(false);
    // Redirect to the login page or home
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("facultyId")) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Attendance Portal</h1>
      {/* Role Selection Dropdown */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={dropdownStyle}
      >
        <option value="student">Student</option>
        <option value="faculty">Faculty</option>
      </select>

      {/* Button Container based on Role */}
      <div style={buttonContainerStyle}>
        {role === "faculty" ? (
          <>
            {/* Faculty Options */}
            {!isLoggedIn ? (
              <button onClick={() => navigate("/login")} style={buttonStyle}>
                Login
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/create-session")}
                  style={buttonStyle}
                >
                  Create Session
                </button>
                <button onClick={handleLogout} style={buttonStyle}>
                  Logout
                </button>
                <button
                  onClick={() => navigate("/view-sessions")}
                  style={buttonStyle}
                >
                  View Sessions
                </button>
                <button
                  onClick={() => navigate("/students")}
                  style={buttonStyle}
                >
                  View All Students
                </button>
              </>
            )}
          </>
        ) : (
          <>
            {/* Student Options */}
            <button onClick={() => navigate("/register")} style={buttonStyle}>
              Register
            </button>
            <button onClick={() => navigate("/attendance")} style={buttonStyle}>
              Mark Attendance
            </button>
            <button onClick={handleViewAttendance} style={buttonStyle}>
              View Attendance
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// Container style with white background
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f4f8", // Light blue-gray background
  textAlign: "center",
};

// Header style with blue text color
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

const buttonContainerStyle = {
  display: "flex",
  width: "100%",
  flexDirection: "column",
  alignItems: "center",
  gap: "15px",
};

// Dropdown style
const dropdownStyle = {
  padding: "10px",
  fontSize: "18px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  width: "60%",
  maxWidth: "400px",
};

// Button style with blue theme
const buttonStyle = {
  padding: "15px 30px",
  fontSize: "18px",
  cursor: "pointer",
  width: "60%",
  margin: "6px 0",
  borderRadius: "8px",
  backgroundColor: "#007bff", // Blue background for buttons
  color: "#fff", // White text for buttons
  border: "none",
  transition: "all 0.3s ease", // Smooth transition for hover effect
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow
};

// Hover effect for the buttons
buttonStyle[":hover"] = {
  backgroundColor: "#0056b3", // Darker blue on hover
  boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // More pronounced shadow on hover
};

export default Home;
