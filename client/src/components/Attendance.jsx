import React, { useState, useEffect } from "react";
import { markAttendance } from "../api";
import { toast } from "react-toastify";
import { getLocation } from "../getlocation";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [formData, setFormData] = useState({
    prn: "",
    sessionId: "",
    facePhoto: null,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(true); // New state for location loading

  useEffect(() => {
    const enableLocation = async () => {
      try {
        let result = await getLocation();
        setLocationEnabled(true);
      } catch (error) {
        setLocationError("Please enable location services to proceed.");
        toast.error(error);
      } finally {
        setLoadingLocation(false); 
      }
    };
    enableLocation();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, facePhoto: file });
    setFileName(file ? "Face Uploaded" : "No file chosen");

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!locationEnabled) {
      toast.error("Please enable location services before proceeding.");
      setLoading(false);
      return;
    }

    try {
      const form = new FormData();
      for (const key in formData) {
        form.append(key, formData[key]);
      }
      const location = await getLocation();
      form.append("studentLongitude", location.longitude);
      form.append("studentLatitude", location.latitude);
      const response = await markAttendance(form);

      if (response.status === 201) {
        toast.success("Attendance marked successfully!");
        navigate("/view-attendance/" + formData.sessionId);
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(
          `Failed to mark attendance: ${error.response.data.message}`
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: loading ? "not-allowed" : "pointer",
    borderRadius: "5px",
    backgroundColor: "beige",
    color: "black",
    border: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    opacity: loading ? 0.6 : 1,
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

  return (
    <div style={containerStyle}>
      {loadingLocation ? (
        <div>
          <div style={spinnerStyle}></div>
          <p>Detecting location...</p>
        </div>
      ) : !locationEnabled ? (
        <div style={errorContainerStyle}>
          <h2>
            {locationError ||
              "Location services are required to mark attendance."}
          </h2>
        </div>
      ) : (
        <>
          <h1 style={headerStyle}>Mark Attendance</h1>
          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              type="text"
              name="prn"
              placeholder="PRN"
              value={formData.prn}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="text"
              name="sessionId"
              placeholder="Session ID"
              value={formData.sessionId}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <div style={fileUploadContainer}>
              <label htmlFor="facePhoto" style={customFileInputButton}>
                Upload Face Photo
              </label>
              <span style={fileNameStyle}>{fileName}</span>
              <input
                id="facePhoto"
                type="file"
                name="facePhoto"
                onChange={handleFileChange}
                style={hiddenFileInput}
                capture
              />
            </div>
            {previewUrl && (
              <img src={previewUrl} alt="Face Preview" style={previewStyle} />
            )}

            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? "Marking Attendance..." : "Mark Attendance"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Attendance;

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f4f8", // Light blue-gray background
  textAlign: "center",
};

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

const inputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "300px",
};

const fileUploadContainer = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};

const hiddenFileInput = {
  display: "none", // Hide default input
};

const customFileInputButton = {
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
  transition: "background-color 0.3s ease",
};

const fileNameStyle = {
  color: "#ccc",
};

const previewStyle = {
  marginTop: "10px",
  maxWidth: "80%",
  maxHeight: "300px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  objectFit: "cover",
};

// Add the spinning animation
const spin = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

document.head.insertAdjacentHTML("beforeend", `<style>${spin}</style>`);
