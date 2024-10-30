import React, { useState, useRef,useEffect } from 'react';

const Microphone = () => {

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Mic settings and refs
  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const microphoneRef = useRef(null);

  const requestMicPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicAllowed(true);
    } catch (error) {
      console.error('Microphone permission denied', error);
    }
  };
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleAudioStream)
      .catch((err) => console.error('Error accessing audio stream:', err));
  }, []);

  const handleAudioStream = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current.fftSize = 256;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
    microphoneRef.current.connect(analyserRef.current);
    detectVolume();
  };

  const detectVolume = () => {
    if (analyserRef.current) {
      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
      const average = sum / dataArrayRef.current.length;
      setVolume(average);
    }
  };

  const handleMuteClick = () => {
    if(isMuted){
        setIsMuted(!isMuted);
        setIsMicAllowed(!true);
    }
    if(!isMuted)
    {
        setIsMuted(isMuted);
        setIsMicAllowed(true);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
      {isMicAllowed ? (
        <button className="relative w-32 h-12 bg-gray-300">
          <div className="absolute top-0 left-0 h-full bg-blue-500" style={{ width: `${volume * 0.5}%` }}></div>
          Mic Speaking
        </button>
      ) : (
        <button onClick={requestMicPermission} className="w-32 h-12 bg-gray-300">
          Allow Mic
        </button>
      )}

      <button onClick={handleMuteClick} className="relative w-32 h-12 bg-gray-300">
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
};

export default Microphone;