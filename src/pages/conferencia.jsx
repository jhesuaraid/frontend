import React, { useEffect, useState, useRef } from 'react';
import VideoRecorder from '../components/VideoRecorder';
import './conferencia.css';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Conferencia = () => {
    const [permissionsGranted, setPermissionsGranted] = useState(false);
    
    const [conversationUrl, setConversationUrl] = useState('');

    const [conversationId, setConversationId] = useState('');

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    const [hasDownloaded, setHasDownloaded] = useState(false);

    const mediaRecorderRef = useRef(null);

    const recordedChunksRef = useRef([]);

    const [iniciado, setIniciado] = useState(false);

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                const cameraPermission = await navigator.mediaDevices.getUserMedia({ video: true });
                const microphonePermission = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (cameraPermission && microphonePermission) {
                    setPermissionsGranted(true);
                }
            } catch (error) {
                console.error('Permissions denied', error);
                setPermissionsGranted(false);
            }
        };

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = '¿Estás seguro de que quieres salir? Se perderá la conversación en curso.';
            if (!hasDownloaded) {
                downloadVideo();
                setHasDownloaded(true);
            }
        };

        requestPermissions();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasDownloaded]);

    const downloadVideo = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'recorded_video.webm';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const fetchConversation = async () => {
            if (!iniciado) {
                try {
                    const response = await fetch(`${backendUrl}/ejecutar-crear-conversacion/`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json();
                    /*
                    {
                        "conversation_id": "c62223be",
                        "conversation_name": "New Conversation 1724946127496",
                        "conversation_url": "https://tavus.daily.co/c62223be",
                        "status": "active",
                        "callback_url": null,
                        "created_at": "2024-08-29T15:42:07.514Z"
                    }
                    */
                    setConversationId(data.conversation_id);
                    console.log(data.conversation_id)
                    setConversationUrl(data.conversation_url);
                    setIniciado(true);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
                
            }
        };

        fetchConversation();
    }, []);

    return (
        <div className="iframe-container">
            {/*<VideoRecorder conversationId={conversationId}/>*/}

            {conversationUrl ? (
                <div>
                    <iframe title='Test' src={conversationUrl} width="100%" height="500px" style={{ border: 'none' }} allow="camera; microphone"></iframe>
                </div>
            ) : (
                <p>No se pudo obtener la URL de la conversación.</p>
            )}
        </div>
    );
};

export default Conferencia;