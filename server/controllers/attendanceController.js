const attendanceService = require("../services/attendanceService");

exports.createSession = async (req, res) => {
  try {
    const session = await attendanceService.createSession(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const data = await attendanceService.getAttendance(req.params.sessionId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleAttendance = async (req, res) => {
  try {
    const message = await attendanceService.toggleAttendance(
      req.params.studentId,
      req.params.sessionId
    );
    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const result = await attendanceService.markAttendance(req, res);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFacultySessions = async (req, res) => {
  try {
    const sessions = await attendanceService.getFacultySessions(req.params.id);
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await attendanceService.getAllStudents();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
