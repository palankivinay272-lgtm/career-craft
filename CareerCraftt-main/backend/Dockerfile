# Use official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Install system dependencies
# build-essential is often needed for installing python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container at /app
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download the spaCy model (assuming en_core_web_sm is used)
RUN python -m spacy download en_core_web_sm

# Copy the current directory contents into the container at /app
COPY . .

# Cloud Run injects the PORT environment variable
ENV PORT=8080

# Run the application
# Use 'exec' to ensure uvicorn receives signals correctly
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
