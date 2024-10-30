import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners'; // Importar el spinner

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CameraRecorder = forwardRef(({ selectedDeviceId , StopRecording, videoId }, ref) => {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [recording, setRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("El dispositivo es:", selectedDeviceId);

        const startCamera = async () => {
            try {
                if (!selectedDeviceId) {
                    console.error('selectedDeviceId no está definido');
                    return;
                }

                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 },
                        frameRate: { ideal: 60 },
                        deviceId: selectedDeviceId ? { exact: selectedDeviceId } : undefined
                    },
                    audio: true 
                });

                videoRef.current.srcObject = stream;
                mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm; codecs=vp8,opus' });

                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        setRecordedChunks((prev) => [...prev, event.data]);
                    }
                };
            } catch (err) {
                console.error('Error accessing camera: ', err);
            }
        };

        startCamera();
    }, [selectedDeviceId]);

    const handleStartRecording = () => {
        setRecording(true);
        try{
            mediaRecorderRef.current.start();
        }
        catch(err){
            window.location.reload();
        }
    };

    const handleStopRecording = () => {
        setRecording(false);
        try{
            mediaRecorderRef.current.stop();
        }
        catch(err){
            window.location.reload();
        }
    };

    useImperativeHandle(ref, () => ({
        startRecording: handleStartRecording,
        stopRecording: handleStopRecording,
    }));
    
    const [isUploading, setIsUploading] = useState(false); // Estado para controlar el spinner

    useEffect(() => {
        const uploadVideo = async (blob) => {
            setIsUploading(true); 
            const formData = new FormData();

            // Generar la fecha y hora actual
            const now = new Date();
            const formattedDate = now.toISOString().replace(/[:.]/g, '-'); // Formatear la fecha y hora
    
            // Usar la fecha y hora formateada como el nombre del archivo
            const fileName = `recording-${formattedDate}.webm`;

            formData.append('video', blob, fileName); // Cambia 'recording.webm' por el nombre que desees
            formData.append('videogenerationqueue_id', videoId); // Reemplaza '12345' con el ID real
    
            try {
                const response = await fetch(`${backendUrl}/videos/upload-video/`, {
                    method: 'POST',
                    body: formData,
                });
                
                if (!response.ok) {
                    throw new Error('Failed to upload video');
                }
    
                const result = await response.json();
                console.log('Video uploaded successfully:', result);
            } catch (error) {
                console.error('Error uploading video:', error);
            } finally {
                setIsUploading(false); // Ocultar el spinner y el mensaje
                //navigate('/');
            }
        };
    
        if (!recording && recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            uploadVideo(blob);
        }
    }, [recording, recordedChunks]);

    return (
        <>
        {isUploading && (
            <div className="uploading-message">
                <ClipLoader size={50} color={"#123abc"} loading={isUploading} />
                <p>Subiendo respuesta al servidor, por favor espere...</p>
            </div>
        )}
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full max-h-full object-cover block z-10" />
        </>
    );
});

export default CameraRecorder;