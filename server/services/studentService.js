// services/studentService.js
const db = require("../config/db");

// ✅ Create new student record
exports.createStudent = (studentData) => {
  const { name, prn, rollNo, branch, division, deviceFingerprint, faceId } =
    studentData;
  const sql = `
    INSERT INTO students (name, prn, roll_no, branch, division, device_fingerprint, face_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [name, prn, rollNo, branch, division, deviceFingerprint, JSON.stringify(faceId)],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// ✅ Get student by PRN
exports.getStudentByPRN = (prn) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM students WHERE prn = ?", [prn], (err, result) => {
      if (err) reject(err);
      else resolve(result[0]); // Return single student if found
    });
  });
};

// ✅ Optional: Get student by MAC address
exports.getStudentByDevice = (deviceFingerprint) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM students WHERE device_fingerprint = ?",
      [deviceFingerprint],
      (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      }
    );
  });
};
