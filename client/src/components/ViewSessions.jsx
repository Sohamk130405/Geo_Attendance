import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFacultySessions } from "../api"; // Assuming you have this API
import { toast } from "react-toastify";

const ViewSessions = ({ facultyId }) => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getFacultySessions(facultyId);
        setSessions(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load sessions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [facultyId]);

  const handleSessionClick = (sessionId) => {
    navigate(`/view-attendance/${sessionId}`);
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Your Attendance Sessions</h1>
      {sessions.length > 0 ? (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Session ID</th>
                <th style={thStyle}>Subject</th>
                <th style={thStyle}>Branch</th>
                <th style={thStyle}>Division</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>View</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td style={tdStyle}>{session.id}</td>
                  <td style={tdStyle}>{session.subject}</td>
                  <td style={tdStyle}>{session.branch}</td>
                  <td style={tdStyle}>{session.division}</td>
                  <td style={tdStyle}>
                    {new Date(session.created_at).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleSessionClick(session.id)}
                      style={viewButtonStyle}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No sessions found.</div>
      )}
    </div>
  );
};

export default ViewSessions;

// Add CSS styles
const containerStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const headerStyle = {
  fontSize: "2em",
  marginBottom: "20px",
  color: "#333",
};

const tableContainerStyle = {
  overflowX: "auto", // Allows horizontal scrolling on small screens
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const thStyle = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f4f4f4",
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
};

const viewButtonStyle = {
  padding: "5px 15px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

// Media Queries for Responsive Design
const mediaQueryStyles = {
  "@media (max-width: 768px)": {
    headerStyle: {
      fontSize: "1.5em",
    },
    tableStyle: {
      fontSize: "14px",
    },
    thStyle: {
      padding: "8px",
    },
    tdStyle: {
      padding: "8px",
    },
    viewButtonStyle: {
      padding: "4px 10px",
    },
  },
};

// Implement media queries by adding them to the style objects
Object.assign(tableStyle, mediaQueryStyles["@media (max-width: 768px)"]);
Object.assign(thStyle, mediaQueryStyles["@media (max-width: 768px)"].thStyle);
Object.assign(tdStyle, mediaQueryStyles["@media (max-width: 768px)"].tdStyle);
Object.assign(
  viewButtonStyle,
  mediaQueryStyles["@media (max-width: 768px)"].viewButtonStyle
);
