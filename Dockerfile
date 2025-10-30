# Use a Python image with Debian base (works best for dlib)
FROM python:3.10-slim

# Prevent interactive prompts during install
ENV DEBIAN_FRONTEND=noninteractive

# Install build tools and libraries needed by dlib and OpenCV
RUN apt-get update && apt-get install -y \
    cmake \
    build-essential \
    libboost-all-dev \
    libopenblas-dev \
    liblapack-dev \
    libx11-dev \
    libgtk-3-dev \
    libjpeg-dev \
    libpng-dev \
    libtiff-dev \
    libavcodec-dev \
    libavformat-dev \
    libswscale-dev \
    libv4l-dev \
    pkg-config \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the app source code
COPY . .

# Flask will run on port 8080
ENV PORT=8080

# Expose the port for external access
EXPOSE 8080

# Run Flask
CMD ["python", "app.py"]
