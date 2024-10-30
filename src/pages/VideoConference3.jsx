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
  const pauseDurations = [1000, 2000, 3000]; // Duraciones de pausa en milisegundos
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoEnded, setVideoEnded] = useState([false, false, false]);
  const [isPaused, setIsPaused] = useState(true);
  const [isLastVideoPlaying, setIsLastVideoPlaying] = useState(false);
  const [videoVolume, setVideoVolume] = useState(0);
  const [showVideoComponent, setShowVideoComponent] = useState(true);

  const [isMicAllowed, setIsMicAllowed] = useState(false);
  const [error, setError] = useState("");
  const [volume, setVolume] = useState(0); // Volumen para visualizar
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const microphoneRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showText, setShowText] = useState(false);

  // Función para solicitar permisos del micrófono y analizar el volumen
  const requestMicPermission = async () => {
    if (videoRefs[0].current) {
      videoRefs[0].current.play();
      setIsMicAllowed(true);
    }

  };

    // Detectar el volumen del micrófono en tiempo real
    const detectVolume = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const sum = dataArrayRef.current.reduce((a, b) => a + b, 0);
        const average = sum / dataArrayRef.current.length;
        setVolume(average);
        requestAnimationFrame(detectVolume);
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

  const handleMuteClick = () => {
    if (isMuted) {
      microphoneRef.current.connect(analyserRef.current);
    } else {
      microphoneRef.current.disconnect();
    }
    setIsMuted(!isMuted);
  };

  const handleVideoAudioStream = (videoElement) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(videoElement);
  
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
  
    source.connect(analyser);
    analyser.connect(audioContext.destination);
  
    const detectVideoVolume = () => {
      analyser.getByteFrequencyData(dataArray);
      const sum = dataArray.reduce((a, b) => a + b, 0);
      const average = sum / dataArray.length;
      setVideoVolume(average);
      requestAnimationFrame(detectVideoVolume);
    };
  
    detectVideoVolume();
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(handleAudioStream)
      .catch((err) => console.error('Error accessing audio stream:', err));
  }, []);


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

  const handleLastVideoPlay2 = () => {
    setShowVideoComponent(false);
  };

  const handleBlinking = () => {
    setIsBlinking(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Panel de video */}
      <div className="flex-1 bg-gray-800 p-4 flex items-center justify-center ">
        <div className="grid grid-cols-10 gap-4 w-full h-full justify-center content-center items-center">
        <div className="col-span-7 bg-black shadow-lg rounded-lg flex items-center justify-center aspect-video h-full">
          <div className="relative w-full h-full">
          <video ref={cameraVideoRef} autoPlay className={`absolute inset-0 w-full h-full object-contain rounded-lg ${volume > 20 ? 'outline outline-4 outline-teal-400' : ''}`} />
          <svg className={`absolute top-2 left-2 w-8 h-8 ${isBlinking ? 'animate-blink' : ''}`} fill="#0000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 415 415" xmlSpace="preserve" stroke="#ff0000">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path d="M174.848,188.711c2.407-2.068,3.577-5.109,3.577-9.297c0-4.133-1.193-7.307-3.647-9.701 c-2.431-2.369-6.148-3.571-11.048-3.571h-15.915v25.73h15.576C168.552,191.872,172.407,190.809,174.848,188.711z"></path>
                <path d="M0,65.241v284.518h415V65.241H0z M70.675,238.253c-18.293,0-33.123-14.83-33.123-33.123 c0-18.293,14.83-33.123,33.123-33.123s33.123,14.83,33.123,33.123C103.798,223.423,88.968,238.253,70.675,238.253z M206.768,249.556h-22.422l-0.411-0.328c-2.099-1.679-3.467-4.433-4.067-8.185c-0.552-3.451-0.832-6.769-0.832-9.859v-6.979 c0-4.492-1.212-8.003-3.602-10.435c-2.417-2.456-5.779-3.65-10.28-3.65h-17.337v39.437h-22.787v-101.66h38.701 c11.546,0,20.743,2.699,27.335,8.023c6.688,5.403,10.078,13.012,10.078,22.614c0,5.404-1.442,10.124-4.285,14.028 c-2.217,3.044-5.267,5.647-9.089,7.767c4.433,1.864,7.785,4.556,9.99,8.029c2.696,4.247,4.063,9.533,4.063,15.711v7.25 c0,2.622,0.361,5.407,1.074,8.278c0.66,2.664,1.774,4.637,3.309,5.864l0.563,0.451V249.556z M287.335,249.556h-70.558v-101.66 h70.422v18.246h-47.636v21.801h40.859v18.246h-40.859v25.121h47.771V249.556z M374.201,183.193l-0.552,1.65h-21.824v-1.5 c0-6.092-1.443-10.781-4.29-13.937c-2.805-3.111-7.331-4.688-13.454-4.688c-5.458,0-9.671,2.155-12.879,6.589 c-3.273,4.522-4.933,10.41-4.933,17.501v19.699c0,7.167,1.743,13.091,5.182,17.607c3.39,4.452,7.854,6.617,13.646,6.617 c5.714,0,9.953-1.507,12.602-4.479c2.693-3.022,4.059-7.668,4.059-13.808v-1.5h21.756l0.552,1.65l0.004,0.23 c0.187,11.009-3.245,19.89-10.199,26.396c-6.92,6.473-16.601,9.755-28.772,9.755c-12.247,0-22.344-4.006-30.01-11.906 c-7.655-7.887-11.537-18.155-11.537-30.521v-19.583c0-12.311,3.785-22.573,11.25-30.504c7.488-7.957,17.34-11.991,29.28-11.991 c12.524,0,22.485,3.289,29.605,9.776c7.166,6.531,10.705,15.519,10.519,26.714L374.201,183.193z"></path>
              </g>
            </g>
          </svg>
          </div>
        </div>
        <div className="col-span-3 bg-black rounded-lg shadow-lg flex items-center justify-center aspect-[4/3] max-h-screen relative">
          {videoSources.map((source, index) => (
            <>
            <video
              key={index}
              ref={videoRefs[index]}
              className={`absolute w-full h-full object-cover transition-opacity rounded-lg duration-500 ease-in-out ${videoEnded[index] ? 'opacity-0' : 'opacity-100'} ${isPaused ? 'blur-sm' : ''} ${videoVolume > 30 && !isPaused ? 'outline outline-4 outline-teal-400' : ''}`}
              style={{ zIndex: videoSources.length - index }}
              onEnded={() => handleVideoEnded(index)}
              onPlay={(e) => {
                setVideoEnded((prev) => {
                  const newVideoEnded = [...prev];
                  newVideoEnded[index] = false;
                  return newVideoEnded;
                });
                if (index === videoSources.length - 1) {
                  handleLastVideoPlay();
                  handleLastVideoPlay2();
                }
                setIsPaused(false); // Asegurarse de que isPaused se actualice correctamente
                handleVideoAudioStream(e.target);
              }}
              onPause={() => {
                setIsPaused(true);
                if (index === 0) {
                  setShowText(true);
                }
              }}
              autoPlay={!isPaused && index === currentVideoIndex}
            >
              <source src={source} type="video/mp4" />
              Tu navegador no soporta la etiqueta de video.
            </video>
            </>
          ))}
          </div>

        </div>
      </div>

      {/* Visualización del volumen del micrófono */}
      <VideoRecorder className={isLastVideoPlaying ? 'block' : 'hidden'} />
      
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {isMicAllowed ? (
          <>
          <button  
            className={`bg-blue-500 text-white p-3 shadow-lg rounded-full hover:bg-blue-600 ${isLastVideoPlaying ? 'hidden' : ''}`}
            onClick={handleResponderClick}>
            <span className="flex items-center space-x-2">
              <span>Reply</span>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </span>
          </button>
            <button  
              className={`${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white p-3 shadow-lg rounded-full`}
              onClick={handleMuteClick}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              )}
            </button>
          </>
        ) : (
          <>
            <button 
              className={`bg-blue-500 text-white p-3 shadow-lg rounded-full hover:bg-blue-600 ${isLastVideoPlaying ? 'hidden' : ''}`} 
              onClick={() => {
                requestMicPermission();
                handleBlinking();
              }}>
              Start
            </button>
            <button  
              className={`${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-500 hover:bg-gray-600'} text-white p-3 shadow-lg rounded-full`}
              onClick={handleMuteClick}>
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
              )}
            </button>
          </>
        )}
      </div>
      
      {/* <div className="fixed bottom-4 left-4 w-64 h-2 bg-gray-300 rounded-full">

        <div className="h-full bg-green-500 rounded-full" style={{ width: `${volume}%` }}></div>
      </div> */}
    </div>
  );
};

export default VideoConference;
