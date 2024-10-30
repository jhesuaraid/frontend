import React, { useState, useEffect, useRef } from "react";

import VideoRecorder from "../components/VideoRecorder";

const VideoConference = () => {

  const cameraVideoRef = useRef(null);
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (cameraVideoRef.current) {
          cameraVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera: ', err);
      }
    };

    startCamera();
  }, []);

  const videoRefs = [useRef(null), useRef(null), useRef(null)];
  const videoSources = ['/videos/1.mp4', '/videos/2.mp4', '/videos/3.mp4'];
  const pauseDurations = [0, 0, 0]; // Duraciones de pausa en milisegundos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState([false, false, false]);
  const [isPaused, setIsPaused] = useState(true);
  const [isLastVideoPlaying, setIsLastVideoPlaying] = useState(false);

  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0); // Volumen para visualizar
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const microphoneRef = useRef(null);

  // Función para solicitar permisos del micrófono y analizar el volumen
  const requestMicPermission = async () => {
    if (videoRefs[0].current) {
      videoRefs[0].current.play();
      setIsMicAllowed(true);
    }

  };

  // Función para procesar el audio del micrófono
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

  // Detectar el volumen del micrófono en tiempo real
  const detectVolume = () => {
    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    const updateVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(average); // Actualiza el nivel de volumen
      requestAnimationFrame(updateVolume);
    };
    updateVolume();
  };

  const handleVideoEnded = (index) => {
    setVideoEnded((prev) => {
      const newVideoEnded = [...prev];
      newVideoEnded[index] = true;
      return newVideoEnded;
    });

    const nextVideoIndex = index + 1;
    if (nextVideoIndex < videoRefs.length) {
      setTimeout(() => {
        setCurrentVideoIndex(nextVideoIndex);
        setIsPaused(true); // Pausar el siguiente video
      }, pauseDurations[index]);
    }
  };
  
  const handleResponderClick = () => {
    setIsPaused(false);
    if (videoRefs[currentVideoIndex].current) {
      videoRefs[currentVideoIndex].current.play();
    }
  };

  const handleLastVideoPlay = () => {
    setIsLastVideoPlaying(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Panel de video */}
      <div className="flex-1 bg-gray-800 p-4 flex items-center justify-center ">
        <div className="grid grid-cols-10 gap-4 w-full h-full">
          <div className="col-span-7 bg-black rounded-lg shadow-lg flex items-center justify-center">
          <video ref={cameraVideoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="col-span-3 bg-black rounded-lg shadow-lg flex items-center justify-center aspect-square max-h-screen relative">
            {videoSources.map((source, index) => (
              <video
              key={index}
              ref={videoRefs[index]}
              className={`absolute w-full h-full object-cover transition-opacity duration-500 ease-in-out ${videoEnded[index] ? 'opacity-0' : 'opacity-100'}`}
              style={{ zIndex: videoSources.length - index }}
              onEnded={() => handleVideoEnded(index)}
              onPlay={() => {
                setVideoEnded((prev) => {
                  const newVideoEnded = [...prev];
                  newVideoEnded[index] = false;
                  return newVideoEnded;
                });
                if (index === videoSources.length - 1) {
                  handleLastVideoPlay();
                }
              }}
              onPause={() => setIsPaused(true)}
              autoPlay={!isPaused && index === currentVideoIndex}
            >
                <source src={source} type="video/mp4" />
                Tu navegador no soporta la etiqueta de video.
              </video>
            ))}
          </div>

        </div>
      </div>

      {/* Visualización del volumen del micrófono */}
      <VideoRecorder className={isLastVideoPlaying ? 'block' : 'hidden'} />
      
      {isMicAllowed ? (
        <button  
        className={`bg-blue-500 text-white p-3 shadow-lg ${isLastVideoPlaying ? 'hidden' : ''}`}
         onClick={handleResponderClick}>
          Responder
        </button>
      ) : (
        <button 
        className={`bg-blue-500 text-white p-3 shadow-lg ${isLastVideoPlaying ? 'hidden' : ''}`} 
        onClick={requestMicPermission}>
          Iniciar
        </button>
      )}
      
      <div className="fixed bottom-4 left-4 w-64 h-2 bg-gray-300 rounded-full">

        <div className="h-full bg-green-500 rounded-full" style={{ width: `${volume}%` }}></div>
      </div>
    </div>
  );
};

export default VideoConference;
