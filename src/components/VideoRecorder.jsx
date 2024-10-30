import React, { useState, useRef, useEffect } from 'react';
import EndConversationButton from './EndConversationButton';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const VideoRecorder = ({conversationId,className}) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const videoRef = useRef(null);
    const chunks = useRef([]);

    //
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'recording.webm';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            };

            recorder.start();
            setMediaRecorder(recorder);
            setIsRecording(true);

        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorder) {
            try {
                await endConversation();
                mediaRecorder.stop();
                setIsRecording(false);
              } catch (error) {
                console.error('Failed to stop recording:', error);
              }
        }
    };

    const endConversation = async () => {
        try {
          const res = await fetch(`${backendUrl}/ejecutar_end_conversation/${conversationId}/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
    
          const data = await res.json();
          setResponse(data);
        } catch (error) {
          setError(error.message);
        }
      };

    useEffect(() => {
        startRecording();
    }, []);

    return (
        <>
            {isRecording ? (
                <>
                <button className={`bg-blue-500 text-white p-3 shadow-lg ${className}`} onClick={stopRecording}>Terminar Conferencia</button>
                </>
            ) : (
                <button className={`bg-blue-500 text-white p-3 shadow-lg ${className}`} onClick={startRecording}>Iniciar Grabación</button>
            )}
        </>
    );
};

export default VideoRecorder;