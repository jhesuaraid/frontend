import React, { useRef, useState, useEffect, useCallback } from 'react';
import { AiFillVideoCamera, AiOutlineVideoCamera, AiFillAudio, AiOutlineAudio } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import Webcam from "react-webcam";
import Waveform from './Waveform';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function VideoApp() {
    //videos del backend
    const videoRefs = useRef([]);
    //camara de conferencia
    const webcamRef = useRef(null);
    const streamRef = useRef(null);
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
    const [numeroDeVideo, setNumeroDeVideo] = useState(1)

    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    //subir video
    const [videoResponseId, setVideoResponseId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    //END CAMARA-------------------------------------
    //Microfono
    const waveformRef = useRef(null);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [silentSeconds, setSilentSeconds] = useState(0);
    const [audioStarted, setAudioStarted] = useState(false);
    const [isMicrophoneActive, setIsMicrophoneActive] = useState(true);
    //DRAG VIDEO
    const [position, setPosition] = useState({ top: 4, left: 4 });
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 0, y: 0 });
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
    //Funcion para subida de archivos
    const uploadVideo = async (blob) => {
        setIsUploading(true);
        let name = numeroDeVideo
        const fileName = `${name}.webm`;
        console.log(`Uploading video... ${fileName}`);
        const formData = new FormData();
        formData.append('video', blob, fileName);
        formData.append('videogenerationqueue_id', videoId);
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
            console.log(`Video uploaded successfully: ${fileName}`, result);
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setIsUploading(false);
        }
    };

    //Verifica si esta grabando
    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                console.log("Data available:", data);
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStartCaptureClick = useCallback(() => {
        if (webcamRef.current && webcamRef.current.stream) {
            setCapturing(true);
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
        } else {
            console.error("La cámara no está lista");
        }
    }, [webcamRef, setCapturing, handleDataAvailable]);

    const handleStopCaptureClick = useCallback(() => {
        try {
            mediaRecorderRef.current.stop();
        }
        catch { }
        setCapturing(false);
    }, [mediaRecorderRef, webcamRef, setCapturing]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            setNumeroDeVideo(numeroDeVideo + 1)
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            uploadVideo(blob);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

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
      
        const currentVideo = videoLoop.current;
        currentVideo.play();
        
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



    //Descarga la respuesta
    useEffect(() => {
        const baseUrl = "/app/";
        const currentPath = location.pathname;
        if (currentPath.startsWith(baseUrl)) {
            const extractedPath = currentPath.slice(baseUrl.length);
            setPath(extractedPath);
        }
        //si es video
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
        //si el silencio dura 4 segundos
        if (silentSeconds >= 4 && audioStarted) {
            // si no se esta reproduciento el video y no se ha enviado la respuesta final
            if ((!isPlaying && inicioReproduccion) || (!allVideosPlayed && inicioReproduccion)) {
                playNextVideo();
            }
            //si se ha reproducido todos los videos y no se ha enviado la respuesta final
            if (allVideosPlayed && respuestFinal === false) {
                SetRespuestaFinal(true);
            }
        }
        if (isPlaying) {
            setSilentSeconds(0);
            setAudioStarted(true)
        }
    }, [silentSeconds, isPlaying, audioStarted]);

    useEffect(() => {
        if (!isPlaying) {
            try {
                handleStopCaptureClick();
                handleDownload();
                if (!respuestFinal) {
                    handleStartCaptureClick();
                }
            }
            catch {

            }
        }
    }, [isPlaying])
    //FUNCION PARA OBTENER LOS DISPOSITIVOS DE VIDEO
    useEffect(() => {
        const getCameras = async () => {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices();
                const cameras = devices.filter(device => device.kind === 'videoinput');
                if (cameras.length > 0) {
                    selectedDevice(cameras[0].deviceId); // Establece el ID de la primera cámara encontrada
                }
            } catch (error) {
                console.error('Error al obtener dispositivos de medios:', error);
            }
        };
        if (!isMobile) {
            getCameras();
        }
    }, [isMobile])

    useEffect(() => {
        if (respuestFinal) {
            handleStopCaptureClick();
            handleDownload();
        }
    }, [respuestFinal])

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
        setAudioStarted(true)
    }, [isSpeaking])

    useEffect(() => {
        console.log(recordedChunks);
    }, [recordedChunks])
    
    const handlePlay = () => {
        if (videoLoop.current) {
            videoLoop.current.play();
        }
    };

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
                        <div className={`grid grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1 absolute bg-fondo min-h-[100vh] max-h-[100vh]`}>
                            <div className="flex items-center justify-center animate__animated animate__fadeInUp">
                                <p className='p-10 text-white'>
                                    Thank you for your interest in providing feedback on the talk given by Gonzalo Arzuaga in your Vistage group. I’m going to ask you 3 short questions about your experience to share with other coordinators who may be looking for a speaker for their groups. Ah…
                                </p>
                            </div>
                            <div className="flex flex-col items-center justify-center animate__animated animate__fadeInUp">
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
                    ) : (<></>)}
                    {/*ENDTERMS AND CONDITIONS*/}
                    {/*CONFIG CAMERA jhonny*/}
                    {(configCameraDone === false && termsAndConditions === true) ? (
                        <div className="flex items-center justify-center min-h-screen max-h-[100vh] bg-pepe">
                            <div className="p-6 mx-auto rounded-lg shadow-md space-y-6 max-w-[100%]">
                                {/*<!-- Row 1: Video/Text Container -->*/}
                                <div className="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden max-w-[100%]">
                                    <div className="relative w-full h-full">
                                        {isCameraOn ? (
                                            <Webcam
                                                className={`inset-0 w-full h-full object-cover`}
                                                audio={true}
                                                muted={true}
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
                                <>
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
                                </>
                                {/*<!-- Row 4: Label and Button -->*/}
                                <div className="flex justify-between items-center">
                                    <label htmlFor="inputField" className="text-gray-700">Are you ready to join?</label>
                                    <button
                                        disabled={!isCameraOn || !isMicrophoneActive}
                                        onClick={() => { handleSetConfigCameraDone(); setTimeout(() => { handlePlayVideo(); }, 1000); setTimeout(() => { handleStartCaptureClick(); }, 1000); setTimeout(() => { playNextVideo(); }, 1000); }}
                                        className={`ml-4 py-2 px-4 text-white font-semibold rounded-lg ${!isCameraOn || !isMicrophoneActive ? 'bg-disabled cursor-not-allowed' : 'bg-base hover:bg-good'}`}>
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}
                    {/*END CONFIG CAMERA*/}
                    {/*MENSAJE DE DESPEDIDA*/}
                    {(respuestFinal === true) ? (
                        <div className={`flex flex-wrap h-screen absolute bg-fondo min-w-full max-h-[100vh]`}>
                            <div className="w-full h-1/2 md:h-full md:p-20 animate__animated animate__fadeInUp">
                                <div className='flex flex-col items-center justify-center h-full'>
                                    <p className='p-4 text-white'>
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
            {/*Lo siguiente es para que comience a cargar los videos desde el principio jhonny*/}
            {respuestFinal === true ? (<></>) : (
                <div className={`grid grid-rows-12 flex items-center justify-center bg-fondo ${((termsAndConditions === true && configCameraDone === true)) ? "" : "hidden"} ${(respuestFinal === true) ? "hidden" : ""}`} style={{ height: '-webkit-fill-available' }}>
                    {/*Componente video jhonny*/}
                    <div className="row-span-2 z-10 overflow-hidden flex items-baseline justify-center min-w-[15vh] max-h-[15vh] rounded-full"
                    >
                        {/*video loop jhonny*/}
                        <video
                            key="loop"
                            ref={videoLoop}
                            src="https://TRUSTREEL.b-cdn.net/test/loop.mp4"
                            type="video/mp4"
                            //loop
                            muted
                            playsInline
                            className={`max-w-[50vh]`}
                            //controls
                            style={{ 
                                WebkitBackfaceVisibility: isPlaying === false ? 'hidden' : 'visible',
                                display: isPlaying === false ? 'block' : 'none'
                            }}
                            onLoadedMetadata={() => {
                                console.log("video");
                            }}/>
                        <button onClick={handlePlay} style={{position:"absolute",zIndex:9999999}}>Play Video</button>
                        {/*avatar hablando jhonny*/}
                        {items.map((video, index) => (
                            <video
                                key={index}
                                ref={(el) => (videoRefs.current[index] = el)}
                                src={video.url}
                                playsInline
                                onEnded={() => {
                                    handleVideoEnd();
                                    //handleStopCapture();
                                }}

                                onPlay={() => {
                                    //handleStartCapture();
                                    //setRecordedChunks([]);
                                }}
                                
                                className={`max-w-[50vh] ${index === currentVideoIndex ? 'block' : 'hidden'} ${isPlaying === true ? 'block' : 'hidden'}`}
                                /*
                                style={{ ...video.style }}
                                onLoadedMetadata={() => {
                                    console.log(video);
                                }}
                                */
                            />
                        ))}

                    </div>

                    {configCameraDone ? (
                        <Webcam
                            ref={webcamRef}
                            className="row-span-9 w-full h-full object-cover md:object-contain min-h-[65vh]"
                            audio={true}
                            muted={true}
                            videoConstraints={{
                                facingMode: camaraFrontalTracera,
                                deviceId: selectedDevice,
                                width: { max: 9999 },
                                height: { max: 9999 },
                                frameRate: { ideal: 60 },
                            }}
                        />) :
                        (<></>)}
                    <div className="w-full bg-fondo sm:grid sm:grid-cols-3 flex items-center justify-center">
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
                        {/*
                                <div className="col-span-1 flex items-center justify-end">
                                    <a
                                        href="/"
                                        className='flex items-center justify-center text-white relative w-40 h-10 rounded-md bg-danger'
                                    >
                                        Leave Meet
                                    </a>
                                </div>
                                */}
                    </div>
                </div>
            )}
        </div >
    );
}

export default VideoApp;