import React from 'react';
import 'animate.css';

const Loading: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="text-4xl font-bold text-white animate__animated animate__fadeInUp">
                TrustReel
            </p>
            <p className="text-2xl text-white animate__animated animate__fadeInUp">
                TrustReel Video Testimonial
            </p>
            <div className="w-full max-w-md mt-4">
                <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 animate-progress"></div>
                </div>
            </div>
        </div>
    );
};

export default Loading;