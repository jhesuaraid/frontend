import React, { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const VideoUpload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setUploadStatus('Please select a video file first.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);

    try {
      const response = await fetch(`${backendUrl}/videos/upload-video/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadStatus(`Video uploaded successfully: ${JSON.stringify(data.data)}`);
      } else {
        setUploadStatus(`Failed to upload video: ${data.error}`);
      }
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Upload Video</h2>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};

export default VideoUpload;
