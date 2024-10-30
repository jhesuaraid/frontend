// VideoModal.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//const backendUrl = process.env.REACT_APP_BACKEND_URL
const frontendUrl = process.env.REACT_APP_FRONTEND_URL
/*const replacePort = (url, oldPort, newPort) => {
    return url.replace(`:${oldPort}`, `:${newPort}`);
};*/

const VideoModal = ({ onClose,customeUrl,videoName,urlExport }) => {
    const [items, setItems] = useState([]);
    //const updatedBackendUrl = replacePort(backendUrl, 8000, "");
    
    useEffect(() => {
        fetchVideos();
    }, [customeUrl]);

    useEffect(() => {
        console.log(items)
    },[items])
    
    const fetchVideos = async (userId) => {
      
        const url = `${customeUrl}/${videoName}/`;
        console.log(url);
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'AccessKey': '0fd94989-65b4-4d8e-a95672c97c26-4132-4f8c', // Clave de acceso de BunnyCDN
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const files = await response.json();
            const videoFiles = files; // Filtrar solo archivos de video (mp4)
            console.log("XXXXXXXXXXXXX")
            console.log(videoFiles);
            console.log("XXXXXXXXXXXXX")
            setItems(videoFiles);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            
        }
    };


    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center overflow-auto">
            <div className="bg-white p-4 rounded-lg shadow-lg w-3/4">
                <h2 className="text-xl mb-4">{videoName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="border p-4 rounded-lg">
                            <p className="overflow-hidden truncate whitespace-nowrap">{item.videoText}</p>
                            {item.ObjectName ? (
                                <video controls className="w-full">
                                    <source src={`${urlExport}${videoName}/${item.ObjectName}`} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            ) : (
                                <p>Generando video</p>
                            )}
                        </div>
                    ))}
                </div>
                <div className='flex justify-center space-x-4'>
                    <button onClick={onClose} className="mt-4 my-4 bg-blue-500 text-white px-4 py-4 rounded">Close</button>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;