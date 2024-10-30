import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AiFillVideoCamera, AiOutlineVideoCamera, AiFillAudio, AiOutlineAudio } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import Webcam from "react-webcam";
import Waveform from './Waveform';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function VideoApp() {
    //videos del backend
    const videoRefs = useRef([]);
    //camara de conferencia
    const webcamRef = useRef(null);
    //grabacion de video
    const mediaRecorderRef = useRef(null);
    //video de loop
    const videoLoop = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCameraActive, setIsCameraActive] = useState(false);
    //CAMARA-----------------------------------------
    const [camaraFrontalTracera, setCamaraFrontalTracera] = useState("user");
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [tienePermisosCamara, setTienePermisosCamara] = useState(false);
    //captura de video
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    //subir video
    const [videoResponseId, setVideoResponseId] = useState(null);
    const [videoResponsePartId, setVideoResponsePartId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    //END CAMARA-------------------------------------
    //Microfono
    const waveformRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [silentSeconds, setSilentSeconds] = useState(0);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
    //TERMS AND CONDITIONS
    const [isChecked, setIsChecked] = useState(false);
    //END TERMS AND CONDITIONS

    //MENSAJE DE DESPEDIDA
    const [respuestFinal, SetRespuestaFinal] = useState(false);
    //END MENSAJE DE DESPEDIDA

    //PAGINAS
    const [configCameraDone, setConfigCameraDone] = useState(false);
    const [termsAndConditions, setTermsAndConditions] = useState(false);
    //END PAGINAS
    //videos y grabaciones
    const [isPlaying, setIsPlaying] = useState(false);
    const [inicioReproduccion, SetInicioReproduccion] = useState(false);
    const [allVideosPlayed, setAllVideosPlayed] = useState(false);

    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [currentVideoIndex2, setCurrentVideoIndex2] = useState(0);
    const [path, setPath] = useState("");
    const location = useLocation();
    const [items, setItems] = useState([]);
    const [videoId, setVideoId] = useState(null)
    //FUNCION PARA LA CREACION DEL VIDEO EN EL SERVIDOR

    const createVideoResponse = async () => {
        try {
            const response = await axios.post(`${backendUrl}/videos/create-video-response/`, {
                video: videoId,  // Reemplaza con el ID del VideoGenerationQueue correspondiente
                url: 'http://example.com/video.mp4',
                status: false
            });
            setVideoResponseId(response.data.id);
            return (response.data.id);
        } catch (error) {
            console.error('Error creating VideoResponse:', error);
        }
    };

    const createVideoResponsePart = async () => {
        console.log(videoResponseId)
        try {
            const response = await axios.post(`${backendUrl}/videos/create-video-response-part/`, {
                video: videoResponseId,
                url: "test",
                status: false
            });
            setVideoResponsePartId(response.data.id);
            console.log('VideoResponsePart created:', response.data.id);
        } catch (error) {
            console.error('Error creating VideoResponse:', error);
        }
    };

    //Funcion para subida de archivos
    const uploadVideo = async (blob) => {
        setIsUploading(true);
        const fileName = `${videoResponsePartId}.webm`;
        console.log(`Uploading video...${fileName}`);
        const formData = new FormData();
        
        formData.append('video', blob, fileName); // Cambia 'recording.webm' por el nombre que desees
        formData.append('videogenerationqueue_id', videoId); // Reemplaza '12345' con el ID real
        formData.append('videoResponse_id', videoResponseId);

        try {
            const response = await fetch(`${backendUrl}/videos/upload-video/`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('Failed to upload video');
            }
            const result = await response.json();
            console.log(`Video uploaded successfully:${fileName}`, result);
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setIsUploading(false); // Ocultar el spinner y el mensaje
        }
    };

    const handleUploadVideo = async () => {
        if (recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            uploadVideo(blob);
        }
    }
    //END FUNCION PARA LA CREACION DEL VIDEO EN EL SERVIDOR

    //FUNCION PARA CAMBIAR DE VIDEO
    const handleVideoEnd = () => {
        setCurrentVideoIndex((prevIndex) => (prevIndex + 1 < items.length ? prevIndex + 1 : prevIndex));
    };
    //FUNCION PARA OBTENER LOS DISPOSITIVOS DE VIDEO
    const handleDevices = useCallback((mediaDevices) => {
        setDevices(mediaDevices.filter(({ kind }) => kind === 'videoinput'));
    });
    //FUNCION PARA VERIFICAR PERMISOS DE CAMARA
    const checkCameraPermissions = async () => {
        //optienes los permisos de la camara
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });
        //si los permisos cambian, recarga la pagina
        permissionStatus.onchange = () => {
            window.location.reload();
        }
        //si los permisos estan permitidos, esto se utilizara para mostrar el loading
        if (permissionStatus.state === 'granted') {
            setTienePermisosCamara(true);
            //se coloca que ya se aceptaron los terminos y condiciones si ya tiene permisos de la camara
            setTermsAndConditions(true);
        }
    };
    //FUNCION PARA INICIAR EL VIDEO DE LOOP
    const handlePlayVideo = () => {
        if (videoLoop.current) {
            videoLoop.current.play();
        }
    };

    //FUNCION PARA INICIAR EL MICROFONO
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
    //FUNCION QUE REPORDUCE LOS VIDEOS SIGUIENTES
    const playNextVideo = () => {
        if (isPlaying || currentVideoIndex2 >= items.length) {
            return;
        }
        setIsPlaying(true);
        //handleStartCapture();
        const currentVideo = videoRefs.current[currentVideoIndex2];
        currentVideo.play();
        setAudioStarted(false)
        currentVideo.onended = () => {
            setIsPlaying(false);
            setAudioStarted(false)
            setCurrentVideoIndex2((prevIndex) => prevIndex + 1);
            if (currentVideoIndex + 1 >= items.length) {
                setAllVideosPlayed(true);
            }
        };
    };
    const startMic = () => {
        if (waveformRef.current) {
            waveformRef.current.startToggleMic();
        }
    };
    //FUNCION PARA COMENZAR A REPRODUCIR LOS VIDEOS Y GRABAR LA CAMARA
    const handleSetConfigCameraDone = () => {
        setConfigCameraDone(true)
        startMic();

        SetInicioReproduccion(true);
    }
    //FUNCIONES PARA GRABAR LA CAMARA
    const attemptMediaRecorder = async () => {
        if (!capturing) {
            for (let i = 0; i < 10; i++) {
                try {
                    setCapturing(true);
                    const stream = webcamRef.current.stream;
                    const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    const combinedStream = new MediaStream([...stream.getVideoTracks(), ...audioStream.getAudioTracks()]);
                    mediaRecorderRef.current = new MediaRecorder(combinedStream, {
                        mimeType: "video/webm"
                    });
                    mediaRecorderRef.current.addEventListener(
                        "dataavailable",
                        handleDataAvailable
                    );
                    mediaRecorderRef.current.start();
                    console.log("MediaRecorder started successfully");
                    setIsCameraActive(true);
                    break; // Exit the loop if successful
                } catch (error) {
                    if (i < 9) { // Wait only if it's not the last attempt
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
                    }
                }
            }
        }
    };

    const handleStartCapture = (() => {
        attemptMediaRecorder();
    });

    const handleCreateVideoResponsePart = (() => {
        createVideoResponsePart();
    })
    const handleStopCapture = (() => {
        mediaRecorderRef.current.stop();
        setCapturing(false);
        setRecordedChunks([]);
    });

    //Verifica si esta grabando
    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );
    //Descarga la respuesta
    useEffect(() => {

        const baseUrl = "/app/";
        const currentPath = location.pathname;
        if (currentPath.startsWith(baseUrl)) {
            const extractedPath = currentPath.slice(baseUrl.length);
            setPath(extractedPath);
        }
        setIsMobile(window.innerWidth <= 768);
        navigator.mediaDevices.enumerateDevices().then(handleDevices);
        checkCameraPermissions();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);
    //MONITOREO DE MICROFONO
    useEffect(() => {
        if (silentSeconds >= 4 && audioStarted) {
            if ((!isPlaying && inicioReproduccion) || (!allVideosPlayed && inicioReproduccion)) {
                //handleDownload();
                handleStopCapture();
                handleUploadVideo();
                handleCreateVideoResponsePart();
                handleStartCapture();
                playNextVideo();
            }
            if (allVideosPlayed && respuestFinal === false) {
                SetRespuestaFinal(true);
                handleStopCapture();
                //handleDownload();
                handleUploadVideo();
                //handleStartCapture();
            }
        }
        if (isPlaying) {
            setSilentSeconds(0);
            setAudioStarted(true)
        }
    }, [silentSeconds, isPlaying, audioStarted]);

    useEffect(() => {
        if (videoId && !videoResponseId) {
            createVideoResponse();
        }
    }, [videoId]);

    useEffect(() => {
        if (isCameraActive) {
            playNextVideo();
        }
    }, [isCameraActive])

    useEffect(() => {
        if (videoResponseId && !videoResponsePartId) {
            createVideoResponsePart();
        }
    }, [videoResponseId])

    useEffect(() => {
        if (respuestFinal) {
            handleStopCapture();
        }
    }, [respuestFinal])

    useEffect(() => {
        setAudioStarted(true)
    }, [isSpeaking])

    //ENDMONITOREO DE MICROFONO
    useEffect(() => {
        const fetchVideoQueues = async () => {
            try {
                const response = await fetch(`${backendUrl}/videos/app/viedo-url?customeURL=${path}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response)
                const data = await response.json();
                setItems(data[0].items);
                setVideoId(data[0].id);
                console.log(data[0].items);
            } catch (error) {
                console.log(error);
            }
        };
        fetchVideoQueues();
    }, [path]);


    return (
        <div className="bg-fondo">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="up-down-animation">
                        <p className="text-4xl font-bold text-white animate__animated animate__fadeInUp">
                            TrustReel
                        </p>
                        <p className="text-2xl text-white animate__animated animate__fadeInUp">
                            TrustReel Video Testimonial
                        </p>
                    </div>
                    <div className="w-full max-w-md mt-4">
                        <div className="h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-[#f230aa] animate-progress"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/*TERMS AND CONDITIONS*/}
                    {(termsAndConditions === false && configCameraDone === false) ? (
                        <div className={`flex flex-wrap h-screen absolute bg-fondo`}>
                            <div className="w-full h-1/2 md:w-1/2 md:h-full md:p-20 animate__animated animate__fadeInUp">
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <p className='p-10 text-white'>
                                        Thank you for your interest in providing feedback on the talk given by Gonzalo Arzuaga in your Vistage group. I’m going to ask you 3 short questions about your experience to share with other coordinators who may be looking for a speaker for their groups. Ah…
                                    </p>
                                </div>
                            </div>
                            <div className="w-full h-1/2 md:w-1/2 md:h-full md:p-20 animate__animated animate__fadeInUp">
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
                                                        <div className="flex items-center mb-4 pt-2">
                                                            <input
                                                                id="default-checkbox"
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={(e) => { setIsChecked(e.target.checked); }}
                                                                className="w-4 h-4 text-[#f230aa] bg-gray-100 border-gray-300 rounded focus:ring-[#f230aa] dark:focus:ring-[#f230aa] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                            <label htmlFor="default-checkbox" className="ms-2 text-sm font-medium text-white select-none">
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
                                                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto   ${isChecked ? 'bg-good' : 'bg-base cursor-not-allowed '
                                                    }`}
                                                disabled={!isChecked}
                                                onClick={() => setTermsAndConditions(true)}
                                            >
                                                Let's Go
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                    {/*ENDTERMS AND CONDITIONS*/}
                    {/*CONFIG CAMERA*/}
                    {(configCameraDone === false && termsAndConditions === true) ? (
                        <div className="flex items-center justify-center min-h-screen  py-12 bg-pepe">
                            <div className="max-w-lg mx-auto p-6 rounded-lg shadow-md space-y-6 md:max-w-lg">
                                {/*<!-- Row 1: Video/Text Container -->*/}
                                <div className="flex justify-center items-center h-64 w-[22rem] bg-gray-100 rounded-lg overflow-hidden">
                                    <div className="relative w-full h-full">
                                        {isCameraOn ? (
                                            <Webcam
                                                className={`absolute inset-0 w-full h-full object-cover`}
                                                videoConstraints={{
                                                    width: 1280,
                                                    height: 720,
                                                    facingMode: camaraFrontalTracera,
                                                    deviceId: selectedDevice
                                                }} />) :
                                            (
                                                <p className={`absolute inset-0 flex items-center justify-center text-gray-700 text-lg`}>
                                                    Camera Off
                                                </p>)
                                        }
                                    </div>
                                </div>
                                {/*<!-- Row 2: Two Buttons -->*/}
                                <div className="flex justify-left space-x-4">
                                    <button onClick={() => setIsCameraOn(!isCameraOn)} className={`mr-2 w-12 h-12 text-white rounded flex items-center justify-center ${isCameraOn ? 'bg-good' : 'bg-danger'}`}>
                                        {isCameraOn ? <AiFillVideoCamera className="" /> : <AiOutlineVideoCamera />}
                                    </button>
                                    <button onClick={() => setIsMicrophoneActive(!isMicrophoneActive)} className={`w-12 h-12 text-white rounded flex items-center justify-center ${isMicrophoneActive ? 'bg-good' : 'bg-danger'}`}>
                                        {isMicrophoneActive ? <AiFillAudio /> : <AiOutlineAudio />}
                                    </button>
                                </div>
                                {/*<!-- Row 3: Select Box -->*/}
                                <div>
                                    {isMobile ? (
                                        <select

                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                            onChange={(e) => setCamaraFrontalTracera(e.target.value)}
                                            value={camaraFrontalTracera}>
                                            <option value="user">Front Camera</option>
                                            <option value="environment">Rear camera</option>
                                        </select>
                                    ) : (
                                        devices.length > 0 && (
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200"
                                                onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
                                                {devices.map((device, index) => (
                                                    <option key={index} value={device.deviceId}>
                                                        {device.label || `Camera ${index + 1}`}
                                                    </option>
                                                ))}
                                            </select>
                                        )
                                    )}
                                </div>
                                {/*<!-- Row 4: Label and Button -->*/}
                                <div className="flex justify-between items-center">
                                    <label htmlFor="inputField" className="text-gray-700">Are you ready to join?</label>
                                    <button
                                        disabled={!isCameraOn && !tienePermisosCamara}
                                        onClick={() => { handleSetConfigCameraDone(); handlePlayVideo(); handleStartCapture(); }}
                                        className="ml-4 py-2 px-4 text-white font-semibold rounded-lg bg-base hover:bg-good">
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                    {/*END CONFIG CAMERA*/}
                    {/*MENSAJE DE DESPEDIDA*/}
                    {(respuestFinal === true) ? (
                        <div className={`flex flex-wrap h-screen absolute bg-fondo min-w-full`}>
                            <div className="w-full h-1/2 md:h-full md:p-20 animate__animated animate__fadeInUp">
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <p className='p-10 text-white'>
                                        Thank you for taking the time to fill out this questionnaire. Any feedback or comments will be greatly appreciated! You can write to us at @TrustReel.
                                    </p>
                                    <a
                                        href="/"
                                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto hover-grow btnx`}
                                    >
                                        Goodbye!
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                    {/*END MENSAJE DE DESPEDIDA*/}
                </>
            )}
            {/*Lo siguiente es para que comience a cargar los videos desde el principio*/}
            <div className={`flex items-center justify-center min-h-screen bg-fondo ${((termsAndConditions === true && configCameraDone === true)) ? "" : "hidden"} ${(respuestFinal === true) ? "hidden" : ""}`}>
                <div className="relative w-full max-w-4xl rounded-lg shadow-md">
                    <div className="absolute top-4 left-4 w-[36%] z-10">
                        <div
                            className="flex items-center justify-center w-full h-full overflow-hidden pt-[28vh] min-w-[30vh] max-h-[20vh] rounded-md"

                        >
                            <ClipLoader size={10} color={"#123abc"} loading={isUploading} />

                            <video
                                ref={videoLoop}
                                src="/videos/loop.mp4"
                                autoPlay
                                loop
                                className={`max-w-full max-h-full shadow-md min-w-[100vh] ${isPlaying === false ? 'block' : 'hidden'}`}></video>
                            {items.map((video, index) => (
                                <video
                                    key={index}
                                    ref={(el) => (videoRefs.current[index] = el)}
                                    src={video.url}
                                    onEnded={() => {
                                        handleVideoEnd();
                                        //handleStopCapture();
                                    }}

                                    onPlay={() => {
                                        //handleStartCapture();
                                        //setRecordedChunks([]);
                                    }}

                                    className={`max-w-full max-h-full shadow-md min-w-[100vh] ${index === currentVideoIndex ? 'block' : 'hidden'} ${isPlaying === true ? 'block' : 'hidden'}`}
                                    style={{ ...video.style }}
                                    onLoadedMetadata={() => {
                                        console.log(video);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full rounded-lg overflow-hidden min-h-[90vh] lg:min-h-0">
                        {configCameraDone ? (
                            <Webcam
                                ref={webcamRef}
                                className="w-full h-full object-cover md:object-contain min-h-[90vh] lg:min-h-0"
                                audio={false}
                                videoConstraints={{
                                    facingMode: camaraFrontalTracera,
                                    deviceId: selectedDevice,
                                    width: { max: 9999 },
                                    height: { max: 9999 },
                                    frameRate: { ideal: 60 },
                                }}
                            />) :
                            (<></>)}
                        <div className="w-full py-[1rem] bg-fondo flex grid grid-cols-3">
                            <div className="hidden sm:flex  items-center justify-center col-span-1"></div>
                            <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                                <button
                                    className={`mr-2 ${isMicrophoneActive ? 'bg-danger h-10 w-10' : 'bg-good  w-10 h-10'} text-white p-3 shadow-lg rounded-md flex items-center justify-center`}
                                    onClick={toggleMicrophone}
                                >
                                    {isMicrophoneActive ? (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                            <path d="M15 9.4V5C15 3.34315 13.6569 2 12 2C10.8224 2 9.80325 2.67852 9.3122 3.66593M12 19V22M8 22H16M3 3L21 21M5.00043 10C5.00043 10 3.50062 19 12.0401 19C14.51 19 16.1333 18.2471 17.1933 17.1768M19.0317 13C19.2365 11.3477 19 10 19 10M12 15C10.3431 15 9 13.6569 9 12V9L14.1226 14.12C13.5796 14.6637 12.8291 15 12 15Z" stroke="#ffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                            <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V22M8 22H16M12 15C10.3431 15 9 13.6569 9 12V5C9 3.34315 10.3431 2 12 2C13.6569 2 15 3.34315 15 5V12C15 13.6569 13.6569 15 12 15Z" stroke="#ffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    )}
                                </button>
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
                                        className='text-white relative w-40 h-10 rounded-md'
                                        style={{
                                            background: `linear-gradient(to right, rgb(68, 142, 254) ${silentSeconds * 25}%, transparent 0%)`
                                        }}
                                    >
                                        {silentSeconds >= 4 ? 'Respuesta enviada' : 'Repondiendo'}
                                    </button>
                                </div>
                            </div>
                            <div className="col-span-1 flex items-center justify-end">
                                <a
                                    href="/"
                                    className='flex items-center justify-center text-white relative w-40 h-10 rounded-md bg-danger'
                                >
                                    Leave Meet
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default VideoApp;