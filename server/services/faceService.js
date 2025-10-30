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
