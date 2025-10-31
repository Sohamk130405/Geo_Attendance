// controllers/authController.js
const db = require("../config/db");
const { getFaceId } = require("../services/faceService");
const {
  createStudent,
  getStudentByPRN,
  getStudentByDevice,
} = require("../services/studentService");

exports.registerStudent = async (req, res) => {
  try {
    const { name, prn, rollNo, branch, division, deviceFingerprint } = req.body;
    const facePhoto = req.file;

    if (!(name && prn && rollNo && branch && division && facePhoto)) {
      return res
        .status(400)
        .json({ message: "Missing required fields or face photo." });
    }

    // 🧠 Check for existing student (by PRN or MAC)
    const existingStudent = await getStudentByPRN(prn);
    const existingDevice = await getStudentByDevice(deviceFingerprint);

    if (existingStudent) {
      return res
        .status(409)
        .json({ message: "Student with this PRN already exists." });
    }

    if (existingDevice) {
      return res.status(409).json({
        message: "This device is already registered with another student.",
      });
    }

    // Parallelize face ID generation and DB insert
    const faceId = await getFaceId(facePhoto, prn);

    await createStudent({
      name,
      prn,
      rollNo,
      branch,
      division,
      deviceFingerprint,
      faceId,
    });

    res.status(201).json({ message: "Student registered successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during registration.", error: error.message });
  }
};

// Faculty Login
exports.loginFaculty = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM faculty WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error logging in.", error: err.message });
    if (result.length === 0)
      return res.status(401).json({ message: "Invalid credentials." });
    res.status(200).json({ message: "Login successful.", faculty: result[0] });
  });
};
