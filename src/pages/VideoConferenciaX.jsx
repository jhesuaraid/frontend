import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import VideoPlayer from './videoPlayer';
import 'animate.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const VideoAppX = () => {
    //URL
    const [path, setPath] = useState("");
    const location = useLocation();

    useEffect(() => {
        const baseUrl = "/app/";
        const currentPath = location.pathname;
        if (currentPath.startsWith(baseUrl)) {
            const extractedPath = currentPath.slice(baseUrl.length);
            setPath(extractedPath);
        }
    }, [location]);

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                console.log("Permissions granted");
            } catch (err) {
                console.error("Error requesting permissions", err);
            }
        };

        requestPermissions();
    }, []);
    //VIDEOS

    const [data, setData] = useState([]);
    const [videoName, setVideoName] = useState('');
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [videoId, setVideoId] = useState(null);

    useEffect(() => {
        const fetchVideoQueues = async () => {
            try {
                const response = await fetch(`${backendUrl}/videos/app/viedo-url?customeURL=${path}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setData(data);
                setVideoName(data[0].videoName);
                setItems(data[0].items);
                setVideoId(data[0].id);
                console.log(data[0].items);
            } catch (error) {
                setError(error);
            }
        };
        fetchVideoQueues();
    }, [path]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
    }, []);

    return (
        <div className="bgx3">
            <article class="flex max-w-xl flex-col items-start justify-between">
                <div class="flex items-center gap-x-4 text-xs">
                    <time datetime="2020-03-16" class="text-gray-500">Mar 16, 2020</time>
                    <a href="#" class="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100">Marketing</a>
                </div>
                <div class="group relative">
                    <h3 class="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href="#">
                            <span class="absolute inset-0"></span>
                            Boost your conversion rate
                        </a>
                    </h3>
                    <p class="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.</p>
                </div>
                <div class="relative mt-8 flex items-center gap-x-4">
                    <img src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="h-10 w-10 rounded-full bg-gray-50" />
                    <div class="text-sm leading-6">
                        <p class="font-semibold text-gray-900">
                            <a href="#">
                                <span class="absolute inset-0"></span>
                                Michael Foster
                            </a>
                        </p>
                        <p class="text-gray-600">Co-Founder / CTO</p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default VideoAppX;