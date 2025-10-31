// 📁 src/pages/Attendance.jsx
import { useState } from "react";
import { markAttendance } from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocationHandler } from "../hooks/useLocation";
import { getDeviceFingerprint } from "../getFingerprint";

/* ---------------------------- Main Component ---------------------------- */
const Attendance = () => {
  const navigate = useNavigate();
  const {
    location,
    loading: loadingLocation,
    error: locationError,
    refetch,
  } = useLocationHandler();

  const [formData, setFormData] = useState({
    prn: "",
    sessionId: "",
    facePhoto: null,
  });

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [previewUrl, setPreviewUrl] = useState(null);

  /* ---------------------------- Handlers ---------------------------- */

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, facePhoto: file }));
    setFileName("Face Uploaded");

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);

    e.target.value = ""; // reset input so same file can be uploaded again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.prn || !formData.sessionId) {
      toast.error("Please fill all fields.");
      return;
    }
    if (!formData.facePhoto) {
      toast.error("Please upload your face photo.");
      return;
    }
    if (!location) {
      toast.error("Location is required before marking attendance.");
      return;
    }

    setLoadingSubmit(true);
    try {
      const form = new FormData();
      const fingerprint = await getDeviceFingerprint();
      form.append("prn", formData.prn);
      form.append("sessionId", formData.sessionId);
      form.append("facePhoto", formData.facePhoto);
      form.append("studentLatitude", location.latitude);
      form.append("studentLongitude", location.longitude);
      form.append("deviceFingerprint", fingerprint);

      const response = await markAttendance(form);

      if (response.status === 201) {
        toast.success("✅ Attendance marked successfully!");
        navigate(`/view-attendance/${formData.sessionId}`);
      } else {
        toast.error(response?.data?.message || "Failed to mark attendance.");
      }
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      toast.error(message);
      console.error("Error marking attendance:", error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  /* ---------------------------- Render UI ---------------------------- */

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>📸 Mark Attendance</h1>

      {/* Location Loader */}
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

          {/* File Upload */}
          <div style={fileUploadContainer}>
            <label htmlFor="facePhoto" style={customFileInputButton}>
              Upload Face Photo
            </label>
            <input
              id="facePhoto"
              type="file"
              accept="image/*"
              name="facePhoto"
              onClick={(e) => e.stopPropagation()}
              onChange={handleFileChange}
              style={hiddenFileInput}
              capture
            />
            <span style={fileNameStyle}>{fileName}</span>
          </div>

          {previewUrl && (
            <img src={previewUrl} alt="Face Preview" style={previewStyle} />
          )}

          <button
            type="submit"
            style={{
              ...buttonStyle,
              backgroundColor: loadingSubmit ? "#aaa" : "#007bff",
              cursor: loadingSubmit ? "not-allowed" : "pointer",
            }}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? "Marking Attendance..." : "Mark Attendance"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Attendance;

/* ---------------------------- Styles ---------------------------- */

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  backgroundColor: "#f0f4f8", // Light blue-gray background
  textAlign: "center",
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  transition: "background 0.3s ease",
  width: "100%",
};

const errorContainerStyle = {
  backgroundColor: "#ffe6e6",
  color: "#b00020",
  padding: "20px",
  borderRadius: "10px",
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
const spinnerStyle = {
  width: "50px",
  height: "50px",
  border: "5px solid #ddd",
  borderTop: "5px solid #007bff",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  margin: "20px auto",
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

// Keyframes for spinner
const spin = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = spin;
  document.head.appendChild(styleTag);
}
