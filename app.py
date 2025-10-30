from flask import Flask
from face_routes import face_bp

app = Flask(__name__)

# Register Blueprint
app.register_blueprint(face_bp, url_prefix="/api")

if __name__ == "__main__":
    # Run in production mode (no reloader or debugger)
    app.run(host="0.0.0.0", port=8080, debug=False)
