import React, { useState, useRef, useEffect } from "react";

function VideoAudioSettings() {
  const videoRef = useRef(null);
  const [videoSettings, setVideoSettings] = useState({
    playbackRate: 1,
    volume: 1,
  });
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState("");
  const [selectedAudioDevice, setSelectedAudioDevice] = useState("");
  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isAudioActive, setIsAudioActive] = useState(true);

  useEffect(() => {
    async function fetchDevices() {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      const audioDevices = devices.filter(device => device.kind === "audioinput");
      setVideoDevices(videoDevices);
      setAudioDevices(audioDevices);
    }
    fetchDevices();
  }, []);

  useEffect(() => {
    async function getMediaStream() {
      const constraints = {};
      if (isVideoActive && selectedVideoDevice) {
        constraints.video = { deviceId: selectedVideoDevice };
      }
      if (isAudioActive && selectedAudioDevice) {
        constraints.audio = { deviceId: selectedAudioDevice };
      }
      if (constraints.video || constraints.audio) {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } else {
        if (videoRef.current) videoRef.current.srcObject = null;
      }
    }
    getMediaStream();
  }, [selectedVideoDevice, selectedAudioDevice, isVideoActive, isAudioActive]);

  const handleVideoPlaybackRateChange = (event) => {
    const rate = parseFloat(event.target.value);
    videoRef.current.playbackRate = rate;
    setVideoSettings({ ...videoSettings, playbackRate: rate });
  };

  const handleAudioVolumeChange = (event) => {
    const volume = parseFloat(event.target.value);
    videoRef.current.volume = volume;
    setVideoSettings({ ...videoSettings, volume });
  };

  const toggleVideo = () => {
    setIsVideoActive(!isVideoActive);
  };

  const toggleAudio = () => {
    setIsAudioActive(!isAudioActive);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Video Display */}
      <div className="mb-4">
        <video
          ref={videoRef}
          className="w-full max-w-3xl mx-auto rounded shadow-lg"
          controls
          autoPlay
        />
      </div>

      {/* Video Settings */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Video Settings</h2>
        <div className="flex items-center mt-2">
          <label className="mr-4">Playback Rate: </label>
          <select
            className="border p-2 rounded"
            value={videoSettings.playbackRate}
            onChange={handleVideoPlaybackRateChange}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      {/* Audio Settings */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Audio Settings</h2>
        <div className="flex items-center mt-2">
          <label className="mr-4">Volume: </label>
          <input
            className="w-full max-w-xs"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={videoSettings.volume}
            onChange={handleAudioVolumeChange}
          />
        </div>
      </div>

      {/* Device Selection */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">Device Selection</h2>
        <div className="flex flex-col md:flex-row items-center mt-2">
          <div className="mr-4 mb-2 md:mb-0">
            <label className="mr-2">Video Device: </label>
            <select
              className="border p-2 rounded"
              value={selectedVideoDevice}
              onChange={(e) => setSelectedVideoDevice(e.target.value)}
            >
              {videoDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Video Device ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mr-2">Audio Device: </label>
            <select
              className="border p-2 rounded"
              value={selectedAudioDevice}
              onChange={(e) => setSelectedAudioDevice(e.target.value)}
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Audio Device ${device.deviceId}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Toggle Buttons */}
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white p-2 rounded mr-2"
          onClick={toggleVideo}
        >
          {isVideoActive ? "Deactivate Video" : "Activate Video"}
        </button>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={toggleAudio}
        >
          {isAudioActive ? "Deactivate Audio" : "Activate Audio"}
        </button>
      </div>
    </div>
  );
}

export default VideoAudioSettings;