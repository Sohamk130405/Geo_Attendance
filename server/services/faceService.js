const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

exports.compareFace = async (facePhoto, storedFaceId) => {
  const formData = new FormData();
  formData.append("face_id_encoding", JSON.stringify(storedFaceId));
  formData.append("face_photo", fs.createReadStream(facePhoto.path));

  const { data } = await axios.post(
    `${process.env.PYTHON_URL}/compare_faces`,
    formData,
    {
      headers: formData.getHeaders(),
    }
  );
  return data.match;
};


exports.getFaceId = async (facePhoto, prn) => {
  const formData = new FormData();
  formData.append("face_photo", fs.createReadStream(facePhoto.path));
  formData.append("prn", prn);

  try {
    const { data } = await axios.post(
      `${process.env.PYTHON_URL}/generate_faceid`,
      formData,
      { headers: formData.getHeaders(), timeout: 10000 }
    );

    return data.faceId;
  } catch (error) {
    console.error(
      "Face registration error:",
      error.response?.data || error.message
    );
    throw new Error("Face registration failed");
  } finally {
    fs.unlink(facePhoto.path, (err) => {
      if (err) console.error("Error removing file:", err.message);
    });
  }
};