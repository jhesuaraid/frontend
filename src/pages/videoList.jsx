import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import ModalComponent from './ModalComponent';
import withAuth from '../funtions/withAuth';

const backendUrl = process.env.REACT_APP_BACKEND_URL

const VideoList = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        axios.get(`${backendUrl}/videos/video-generation-queues/user/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => setVideos(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

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
                                <td className="py-2 px-4 border-b border-[#f230aa]">{video.videoName}</td>
                                <td className="py-2 px-4 border-b border-[#f230aa] hidden md:table-cell">{video.created_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {selectedVideo && <ModalComponent video={selectedVideo} videoName={selectedVideo.videoName} customeUrl={selectedVideo.customeURL} data={selectedVideo.items} onClose={() => setSelectedVideo(null)} />}
            </div>
        </div>
    );
};

export default withAuth(VideoList);