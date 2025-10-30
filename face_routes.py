from flask import Blueprint, request, jsonify
import numpy as np
from face_utils import encode_face, compare_face_encodings

face_bp = Blueprint("face_bp", __name__)

@face_bp.route("/generate_faceid", methods=["POST"])
def generate_faceid():
    """Generate face encoding from uploaded image."""
    if "face_photo" not in request.files:
        return jsonify({"error": "No face photo uploaded"}), 400

    prn = request.form.get("prn")
    if not prn:
        return jsonify({"error": "PRN is missing"}), 400

    face_photo = request.files["face_photo"]
    file_bytes = np.frombuffer(face_photo.read(), np.uint8)

    face_encoding, message = encode_face(file_bytes)
    if face_encoding is None:
        return jsonify({"error": message}), 400

    return jsonify({"faceId": face_encoding.tolist(), "prn": prn}), 200


@face_bp.route("/compare_faces", methods=["POST"])
def compare_faces():
    """Compare a live photo with stored encoding."""
    if "face_photo" not in request.files or "face_id_encoding" not in request.form:
        return jsonify({"error": "Missing required fields"}), 400

    face_photo = request.files["face_photo"]
    try:
        # Convert JSON list (string) back to NumPy array
        stored_encoding = np.array(eval(request.form["face_id_encoding"]))
    except Exception:
        return jsonify({"error": "Invalid encoding format"}), 400

    file_bytes = np.frombuffer(face_photo.read(), np.uint8)
    face_encoding, message = encode_face(file_bytes)
    if face_encoding is None:
        return jsonify({"error": message}), 400

    match = compare_face_encodings(stored_encoding, face_encoding)
    return jsonify({"match": match}), 200
