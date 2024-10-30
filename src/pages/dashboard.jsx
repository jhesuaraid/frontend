import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import './home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import { AiOutlineVideoCameraAdd, AiOutlineUserAdd, AiOutlineMessage, AiOutlineQuestionCircle } from "react-icons/ai";
//utiliza withAuth para proteger la ruta
import withAuth from '../funtions/withAuth';

const Dahsboard = () => {

    return (
        <div>
            <Sidebar></Sidebar>
            <div className=' sm:ml-2 md:ml-60'>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6">
                    <div class="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:text-[#f230aa]">
                        <div className='flex justify-between mt-5 mx-5'>
                            <div className='rounded-full flex items-center justify-center w-9 h-9 bg-j-pink text-white'>
                                <AiOutlineVideoCameraAdd />
                            </div>
                            <div className='rounded-full flex items-center justify-center w-9 h-9 bg-j-pink text-white'>
                                <AiOutlineQuestionCircle />
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">Create Video</h3>
                            <p class="text-gray-600">Generate a video with a replica</p>
                        </div>
                    </div>

                    <div class="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:text-[#f230aa]">
                    <div className='flex justify-between mt-5 mx-5'>
                            <div className='rounded-full flex items-center justify-center w-9 h-9 bg-j-orange text-white'>
                                <AiOutlineMessage />
                            </div>
                            <div className='rounded-full flex items-center justify-center w-9 h-9 bg-j-orange text-white'>
                                <AiOutlineQuestionCircle />
                            </div>
                        </div>
                        <div class="p-4">
                            <h3 class="text-lg font-semibold mb-2">Create a Conversation</h3>
                            <p class="text-gray-600">Talk with a replica in real-time</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default withAuth(Dahsboard);