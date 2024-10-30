import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from "react-webcam";

function Test() {
  
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const handleDevices = useCallback((mediaDevices) => {
    setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
  }, [])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [])

  return (
    <div>
      <Webcam
        audio={false}
        ref={webcamRef}
        videoConstraints={{
          deviceId: selectedDevice,
        }}
      />
      {
        devices.length > 0 && (
          <select
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="p-2 border rounded"
          >
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {`Camera ${index + 1}`}
              </option>
            ))}
          </select>
        )
      }
    </div>
  );
}

export default Test;