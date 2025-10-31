const db = require("../config/db");
const faceService = require("./faceService");
const geoService = require("./geoService");
const fileUtils = require("../utils/fileUtils");
const { promisify } = require("util");
const query = promisify(db.query).bind(db);

exports.createSession = async ({
  facultyId,
  subject,
  branch,
  division,
  latitude,
  longitude,
}) => {
  const sql = `INSERT INTO sessions (faculty_id, subject, branch, division, latitude, longitude)
               VALUES (?, ?, ?, ?, ?, ?)`;
  const result = await query(sql, [
    facultyId,
    subject,
    branch,
    division,
    latitude,
    longitude,
  ]);
  return {
    message: "Session created successfully",
    sessionId: result.insertId,
  };
};

exports.getAttendance = async (sessionId) => {
  const sql = `
    SELECT s.id, s.prn, s.name, s.roll_no, a.distance, COALESCE(a.timestamp, 'Absent') AS timestamp
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id AND a.session_id = ?
    JOIN sessions ses ON ses.id = ?
    WHERE s.branch = ses.branch AND s.division = ses.division
    ORDER BY s.roll_no`;
  return await query(sql, [sessionId, sessionId]);
};

exports.toggleAttendance = async (studentId, sessionId) => {
  const exists = await query(
    "SELECT * FROM attendance WHERE student_id = ? AND session_id = ?",
    [studentId, sessionId]
  );
  if (exists.length > 0) {
    await query(
      "DELETE FROM attendance WHERE student_id = ? AND session_id = ?",
      [studentId, sessionId]
    );
    return "Attendance marked as Absent.";
  } else {
    await query(
      "INSERT INTO attendance (student_id, session_id, distance) VALUES (?, ?, ?)",
      [studentId, sessionId, 0]
    );
    return "Attendance marked as Present.";
  }
};

exports.markAttendance = async (req) => {
  const {
    prn,
    sessionId,
    studentLatitude,
    studentLongitude,
    deviceFingerprint,
    maxDistance = 500,
  } = req.body;
  
  const facePhoto = req.file;

  const [student] = await query("SELECT * FROM students WHERE prn = ?", [prn]);
  if (!student) throw new Error("Student not found");

  const [session] = await query("SELECT * FROM sessions WHERE id = ?", [
    sessionId,
  ]);
  if (!session) throw new Error("Session not found");

  if (
    student.branch !== session.branch ||
    student.division !== session.division
  )
    throw new Error("Branch/division mismatch");

  const distance = geoService.getDistance(
    studentLatitude,
    studentLongitude,
    session.latitude,
    session.longitude
  );
  if (distance > maxDistance) throw new Error("Not within allowed distance");

  const [marked] = await query(
    "SELECT * FROM attendance WHERE student_id = ? AND session_id = ?",
    [student.id, sessionId]
  );
  if (marked) throw new Error("Attendance already marked");

  if (student.device_fingerprint !== deviceFingerprint)
    throw new Error("Device mismatch");

  const faceMatch = await faceService.compareFace(facePhoto, student.face_id);
  if (!faceMatch) throw new Error("Face mismatch");

  await query(
    "INSERT INTO attendance (student_id, session_id, distance) VALUES (?, ?, ?)",
    [student.id, sessionId, Math.floor(distance)]
  );

  await fileUtils.deleteFile(facePhoto.path);

  return { message: "Attendance marked successfully." };
};

exports.getFacultySessions = async (facultyId) => {
  return await query("SELECT * FROM sessions WHERE faculty_id = ?", [
    facultyId,
  ]);
};

exports.getAllStudents = async () => {
  return await query(
    "SELECT name, prn, roll_no, branch, division FROM students"
  );
};
