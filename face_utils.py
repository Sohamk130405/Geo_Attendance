import cv2
import face_recognition
import numpy as np
from functools import lru_cache


@lru_cache(maxsize=1)
def get_face_recognition():
    """Load the face_recognition module once (caches dlib model)."""
    return face_recognition


def encode_face(file_bytes):
    """Detect and encode a single face from an image file (bytes)."""
    try:
        # Decode bytes → image (OpenCV BGR)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        if image is None:
            return None, "Invalid image data"

        # Convert to RGB for face_recognition
        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # ✅ Use cached face_recognition model
        face_rec = get_face_recognition()
        encodings = face_rec.face_encodings(rgb_image)

        if not encodings:
            return None, "No face found"

        return encodings[0], "success"

    except Exception as e:
        return None, f"Encoding error: {str(e)}"


def compare_face_encodings(stored_encoding, new_encoding, tolerance=0.45):
    """Compare stored encoding with new face encoding."""
    try:
        face_rec = get_face_recognition()
        result = face_rec.compare_faces([stored_encoding], new_encoding, tolerance=tolerance)
        return bool(result[0])
    except Exception as e:
        print(f"Face comparison error: {e}")
        return False
