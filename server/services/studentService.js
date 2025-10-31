// services/studentService.js
const db = require("../config/db");

// ✅ Create new student record
exports.createStudent = (studentData) => {
  const { name, prn, rollNo, branch, division, macAddress, faceId } =
    studentData;
  const sql = `
    INSERT INTO students (name, prn, roll_no, branch, division, mac_address, face_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [name, prn, rollNo, branch, division, macAddress, JSON.stringify(faceId)],
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
exports.getStudentByMac = (macAddress) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM students WHERE mac_address = ?",
      [macAddress],
      (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      }
    );
  });
};
