import React, { useRef, useState, useEffect, useCallback } from 'react';
import Waveform from './Waveform';
import CameraRecorder from './cameraRecorder';
import { AiFillVideoCamera, AiOutlineVideoCamera, AiFillAudio, AiOutlineAudio, AiTwotonePicture } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Webcam from "react-webcam";

const VideoPlayer = ({ videos, videoId }) => {
    const webcamRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    
    const [showInitialButton, setShowInitialButton] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentVideoIndex2, setCurrentVideoIndex2] = useState(0);
    const [allVideosPlayed, setAllVideosPlayed] = useState(false);
    const videoRefs = useRef([]);
    //Video
    useEffect(() => {
        alert(facingMode);
    }, [facingMode]);

    const cameraRecorderRef = useRef(null);

    const waveformRef = useRef(null);

    const startMic = () => {
        if (waveformRef.current) {
            waveformRef.current.startToggleMic();
        }
    };

    const startRecording = () => {
        if (cameraRecorderRef.current) {
            cameraRecorderRef.current.startRecording();
        }
    };

    const stopRecording = () => {
        if (cameraRecorderRef.current) {
            cameraRecorderRef.current.stopRecording();
        }
    };

    // waveform
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [silentSeconds, setSilentSeconds] = useState(0);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
    const playNextVideo = () => {
        if (isPlaying || currentVideoIndex2 >= videos.length) {
            return;
        }
        setIsPlaying(true);
        const currentVideo = videoRefs.current[currentVideoIndex2];
        currentVideo.play();
        currentVideo.onended = () => {
            setIsPlaying(false);
            setCurrentVideoIndex2((prevIndex) => prevIndex + 1);
            if (currentVideoIndex + 1 >= videos.length) {
                setAllVideosPlayed(true);
            }
        };
    };

    const handleVideoEnd = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1 < videos.length ? prevIndex + 1 : prevIndex));
    };

    const handleInitialButtonClick = () => {
        setShowInitialButton(false);
        startRecording();
        startMic();
        playNextVideo();
        setJoined(false);
    };

    const toggleMicrophone = () => {
        if (waveformRef.current) {
            try {
                waveformRef.current.startToggleMic();
                setIsMicrophoneActive(!isMicrophoneActive);
            } catch (err) {
                console.error("Error al alternar el micrófono: ", err);
                alert("Ocurrió un error al alternar el micrófono. Por favor, inténtalo de nuevo.");
            }
        } else {
            console.warn("waveformRef.current es nulo. Asegúrate de que el componente esté montado correctamente.");
            alert("No se pudo acceder al micrófono. Asegúrate de que el componente esté montado correctamente.");
        }
    };

    useEffect(() => {
        if (silentSeconds >= 5 && audioStarted) {
            if ((!isPlaying && !showInitialButton) || (!allVideosPlayed && !showInitialButton)) {
                playNextVideo();
            }
        }
        if (isPlaying) {
            setSilentSeconds(0);
        }
    }, [silentSeconds, isPlaying]);

    useEffect(() => {

        if (allVideosPlayed && silentSeconds >= 5) {
            stopRecording();
            console.log('Recording stopped');
        }
    }, [silentSeconds, allVideosPlayed]);



    const navigate = useNavigate();

    useEffect(() => {
        if (allVideosPlayed && !isPlaying) {
            /*if (silentSeconds >= 5) {
                window.location.href = '/';
            }*/
        }
    }, [allVideosPlayed, isPlaying, silentSeconds]);

    const [isChecked, setIsChecked] = useState(false);
    //VIDEO 
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);

    

    const handleDevices = useCallback((mediaDevices) => {
        setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
    }, [])

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
    }, [])

    const [selectedDeviceId, setSelectedDeviceId] = useState('');
    const audioStreamRef = useRef(null);
    const [joined, setJoined] = useState(false);
    const [streamVideo, setStreamVideo] = useState(null);

    const handleJoin = () => {
        setJoined(true);
    };



    //si hay dispositivos, seleccionar el primero
    useEffect(() => {
        if (devices.length > 0) {
            setSelectedDeviceId(devices[0].deviceId);
        }
    }, [devices]);

    useEffect(() => {

    }, [selectedDeviceId])

    /*const toggleCamera = async () => {
        if (isCameraOn) {
            // Detener la transmisión de la cámara y quitar los permisos
            if (videoRef.current && videoRef.current.srcObject) {
                let stream = videoRef.current.srcObject;
                let tracks = stream.getTracks();

                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        } else {
            try {
                // Solicitar permisos para la cámara
                const constraints = {
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        frameRate: { ideal: 60 },
                        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
                    }
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                setStreamVideo(stream);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                    alert("Permisos denegados. Por favor, permite el acceso a la cámara y el micrófono.");
                } else {
                    console.error("Error al acceder a la cámara: ", err);
                    alert("Error al acceder a la cámara: " + err.message);
                }
            }
        }
        setIsCameraOn(!isCameraOn);
    };
    */

    return (
        <div className="h-screen w-screen overflow-y flex items-center justify-center">

            <p className="inline-block absolute top-2 left-2 text-2xl font-bold text-white p-2">TrustReel</p>
            {/* */}
            <div className={`flex flex-wrap h-screen absolute ${showInitialButton && !joined ? '' : 'hidden'}`}>
                <div className="w-full h-1/2 md:w-1/2 md:h-full md:p-20">
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='p-10 text-white'>
                            Gracias por tu interés en dar feedback sobre la charla que dio Gonzalo Arzuaga en tu grupo Vistage. Te voy a hacer 3 preguntas cortitas acerca de como fue tu experiencia para compartir con otros coordinadores que estén buscando un expositor para sus grupos.
                            Ah…
                        </p>
                    </div>
                </div>
                <div className="w-full h-1/2 md:w-1/2 md:h-full md:p-20">
                    <div className='flex flex-col items-center justify-center h-full'>
                        <div className="relative transform rounded-lg text-left shadow-xl sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
                            <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 as="h3" className="text-base font-semibold leading-6 text-white ">
                                            How it Works
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-white">
                                                Our human avatar will ask you a few short questions about our service and how satisfied you're.
                                            </p>
                                            <p className="text-sm text-white">
                                                After you accept our terms, just click the Start Recording button.
                                            </p>
                                            <div class="flex items-center mb-4 pt-2">
                                                <input
                                                    id="default-checkbox"
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={(e) => setIsChecked(e.target.checked)}
                                                    class="w-4 h-4 text-[#f230aa] bg-gray-100 border-gray-300 rounded focus:ring-[#f230aa] dark:focus:ring-[#f230aa] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label for="default-checkbox" class="ms-2 text-sm font-medium text-white select-none">
                                                    Accept Terms and Conditions. Basically we can use the recording in social networks, emails, etc. <a href='#' className='text-[#f230aa] font-bold'> Link to T&C</a>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 flex flex-col sm:px-6">
                                <button
                                    type="button"
                                    className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto   ${isChecked ? 'hover-grow btnx' : 'bg-gray-400 cursor-not-allowed btnxd '
                                        }`}
                                    disabled={!isChecked}
                                    onClick={() => { handleJoin(); /*toggleCamera();*/ }}
                                >
                                    Let's Go
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/**/}
            <div className={`flex flex-wrap absolute w-full ${joined ? '' : 'hidden'}`}>
                <div className="w-full flex flex-col items-center justify-center">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg max-h-screen max-w-screen overflow-auto">
                        <div className="bg-white p-2 flex items-center justify-around">
                            <p>Are you ready to join?</p>
                            <button disabled={!isCameraOn} onClick={handleInitialButtonClick} className={`relative w-40 h-10 rounded-full border border-4 ${!isCameraOn ? 'border-gray-400 text-gray-400 cursor-not-allowed' : 'border-[#f230aa] text-[#f230aa]'
                                }`}>
                                Join
                            </button>
                        </div>
                        <div className="bg-gray-500">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                videoConstraints={{
                                    facingMode: facingMode,
                                    deviceId: selectedDevice,
                                }}
                            />
                        </div>
                        <div className="bg-white p-2 sm:p-6 flex items-center ">
                            <button className="mr-2 w-12 h-12 bg-gray-500 text-white rounded flex items-center justify-center">
                                {isCameraOn ? <AiFillVideoCamera className="" /> : <AiOutlineVideoCamera />}
                            </button>
                            <button onClick={toggleMicrophone} className="w-12 h-12 bg-gray-500 text-white rounded flex items-center justify-center">
                                {isMicrophoneActive ? <AiFillAudio /> : <AiOutlineAudio />}
                            </button>
                        </div>
                        <div className="bg-white p-2 flex flex-col sm:flex-row items-center justify-around">
                            <label htmlFor="cameraSelect" className="block mb-2 sm:mb-0">Selecciona una cámara:</label>
                            {
                                devices.length === 0 && (
                                    <select
                                        id="cameraSelect"
                                        value={selectedDeviceId}
                                        onChange={(e) => setSelectedDevice(e.target.value)}
                                        className="p-2 border rounded"
                                    >

                                        {devices.map((device, index) => (
                                            <option key={index} value={device.deviceId}>
                                                {device.label || `Cámara ${index+1}`}
                                            </option>
                                        ))}
                                    </select>
                                )
                            }

                        </div>
                    </div>
                </div>
            </div>

            {/*Esto se muestra despues que el boto desaparece*/}

            <div className={`grid grid-cols-1 md:grid-cols-2 h-screen w-screen ${!showInitialButton ? '' : 'hidden'} `}>
                <div className="relative overflow-hidden w-full h-full">
                    {videos.map((video, index) => (
                        <video
                            key={index}
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={video.url}
                            onEnded={() => {
                                handleVideoEnd();
                                videoRefs.current[index].classList.add('blur-sm');
                            }}
                            onPlay={() => {
                                videoRefs.current[index].classList.remove('blur-sm');
                            }}
                            className={`absolute w-[150%] h-[150%] min-h-[50vh] max-w-none max-h-none object-cover ${index === currentVideoIndex ? 'block' : 'hidden'} blur-sm`}
                            style={{ ...video.style, transform: 'translate(-14%, 0%)' }}
                            onLoadedMetadata={() => {
                                console.log(video);
                            }}
                        />
                    ))}
                </div>
                
                <div className="flex flex-col">

                    <CameraRecorder selectedDeviceId={selectedDeviceId} ref={cameraRecorderRef} videoId={videoId} />

                    <div className='flex absolute items-center bottom-5 right-5 z-20'>
                        <div>
                            <button
                                className={`mr-2 ${isMicrophoneActive ? 'bg-gray-600 hover:bg-gray-600 h-10 w-10' : 'bg-[#f230aa] hover:bg-[#f46bbd] w-10 h-10'} text-white p-3 shadow-lg rounded-full flex items-center justify-center`}
                                onClick={toggleMicrophone}
                            >
                                {isMicrophoneActive ? (
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                        <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                        <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="#ffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div>
                            <Waveform
                                ref={waveformRef}
                                isSpeaking={isSpeaking}
                                setIsSpeaking={setIsSpeaking}
                                silentSeconds={silentSeconds}
                                setSilentSeconds={setSilentSeconds}
                                audioStarted={audioStarted}
                                setAudioStarted={setAudioStarted}
                            />

                            <button
                                className='text-[#fbd8e7] relative w-40 h-10 rounded-full border border-4 border-[#f230aa]'
                                style={{
                                    background: `linear-gradient(to right, #f230aa ${silentSeconds * 20}%, transparent 0%)`
                                }}
                            >
                                {silentSeconds >= 5 ? 'Respuesta enviada' : 'Repondiendo'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VideoPlayer;