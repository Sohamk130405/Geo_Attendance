import React, { useEffect, useState } from "react";
import { getAllStudents } from "../api"; // Import your API call

const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");

  // Fetch all students when the component is mounted
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getAllStudents(); // Call the API
        setStudents(response.data); // Set the students data
        setFilteredStudents(response.data); // Set initially filtered students
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search and filter logic
  useEffect(() => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.prn.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (branchFilter) {
      filtered = filtered.filter((student) => student.branch === branchFilter);
    }

    if (divisionFilter) {
      filtered = filtered.filter(
        (student) => student.division === divisionFilter
      );
    }

    setFilteredStudents(filtered);
  }, [searchQuery, branchFilter, divisionFilter, students]);

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>All Students</h1>

      {/* Flexbox container for search and filters */}
      <div style={searchFilterContainerStyle}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or PRN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={searchInputStyle}
        />

        {/* Branch Filter */}
        <select
          value={branchFilter}
          onChange={(e) => setBranchFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="">All Branches</option>
          <option value="Comp">Comp</option>
          <option value="AIDS">AIDS</option>
          <option value="CSAI">CSAI</option>
          <option value="CSAIML">CSAIML</option>
        </select>

        {/* Division Filter */}
        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          style={filterStyle}
        >
          <option value="">All Divisions</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>PRN</th>
            <th style={thStyle}>Roll No</th>
            <th style={thStyle}>Branch</th>
            <th style={thStyle}>Division</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={index}>
              <td style={tdStyle}>{student.name}</td>
              <td style={tdStyle}>{student.prn}</td>
              <td style={tdStyle}>{student.roll_no}</td>
              <td style={tdStyle}>{student.branch}</td>
              <td style={tdStyle}>{student.division}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Add styles
const containerStyle = {
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
};

const headerStyle = {
  fontSize: "2em",
  marginBottom: "20px",
  color: "#333",
  textAlign: "center", // Center align on all screen sizes
};

// Flex container to align filters and search input on large screens
const searchFilterContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap", // Allow wrapping on smaller screens
  marginBottom: "20px",
};

const searchInputStyle = {
  padding: "10px",
  marginBottom: "10px",
  width: "100%",
  maxWidth: "400px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  boxSizing: "border-box",
};

const filterStyle = {
  padding: "10px",
  margin: "0 10px 10px 0",
  borderRadius: "4px",
  border: "1px solid #ddd",
  width: "100%",
  maxWidth: "150px",
  boxSizing: "border-box",
};

const tableStyle = {
  marginTop: "10px",
  width: "100%",
  borderCollapse: "collapse",
  overflowX: "auto", // Add horizontal scroll for small screens
};

const thStyle = {
  borderBottom: "2px solid #ddd",
  padding: "10px",
  textAlign: "left",
  backgroundColor: "#f4f4f4",
  fontSize: "14px", // Reduce font size for mobile screens
};

const tdStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px",
  fontSize: "14px", // Reduce font size for mobile screens
  wordWrap: "break-word", // Ensure long text doesn't overflow
};

// Media query to adjust styles for smaller screens
const mediaQueryStyles = `
  @media (max-width: 600px) {

    .search-filter-container {
      flex-direction: column;
      align-items:center;
    }

    ${searchInputStyle} {
      width: 100%;
      marginBottom: 10px;
    }

    ${filterStyle} {
      width: 100%;
      margin: 0 0 10px 0;
    }
  }
`;

// Add the styles directly to the document (you can use styled-components or a separate CSS file in a real project)
const styleTag = document.createElement("style");
styleTag.innerHTML = mediaQueryStyles;
document.head.appendChild(styleTag);

export default ViewAllStudents;
