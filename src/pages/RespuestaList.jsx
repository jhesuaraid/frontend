import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import ModalComponent from './ModalComponentRespuestas';
import withAuth from '../funtions/withAuth';

const backendUrl = process.env.REACT_APP_BACKEND_URL

const RespuestaList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState(false);
    const [urlExport, setUrlExport] = useState(false);

    const getUserIdFromToken = async (token) => {
        try {
            const response = await fetch(`${backendUrl}/company/api/get-user-id/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUserId(data.user_id);
            console.log('User ID:', data.user_id);
        } catch (error) {
            console.error('Error fetching user ID:', error.message);
        }
    };

    const fetchVideos = async (userId) => {
        const localUrl = window.location.href;
        const regex = new RegExp(`${userId}/(\\d+)/`);
        const match = localUrl.match(regex);
        let extractedValue = 1
        if (match) {
            extractedValue = match[1];
            console.log(extractedValue); // Debería imprimir '1213'
        } else {
            console.log('No se encontró un número en la URL.');
        }
        const url = `https://storage.bunnycdn.com/trustreel/${userId}/${extractedValue}/`;
        const exportUrl =`https://TRUSTREEL.b-cdn.net/${userId}/${extractedValue}/`
        setUrl(url);
        setUrlExport(exportUrl);
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
            console.log(videoFiles);
            setVideos(videoFiles);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            getUserIdFromToken(token).then(() => {
                if (userId) {
                    fetchVideos(userId);
                }
            });
        } else {
            console.error('No token found in localStorage');
        }
    }, [userId]);

    return (
        <div className='ml-20 sm:ml-60 md:ml-60'>
            <Sidebar />
            <div className="container mx-auto p-4">
                <table className="overflow-x-auto w-full">
                    <thead className="bg-[#f230aa] text-white">
                        <tr>
                            <th className="py-2 px-4 ">Video Name</th>
                            <th className="py-2 px-4 hidden md:table-cell">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map(video => (
                            <tr
                                key={video.id}
                                onClick={() => setSelectedVideo(video)}
                                className="cursor-pointer hover:bg-[#f230aa] hover:text-white text-[#f230aa] transition-colors duration-200"
                            >
                                <td className="py-2 px-4 border-b border-[#f230aa]">{video.ObjectName}</td>
                                <td className="py-2 px-4 border-b border-[#f230aa] hidden md:table-cell">{video.DateCreated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedVideo && <ModalComponent videoName={selectedVideo.ObjectName} customeUrl={url} urlExport={urlExport} onClose={() => setSelectedVideo(null)} />}
            </div>
        </div>
    );
};

export default withAuth(RespuestaList);