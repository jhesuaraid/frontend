import React, { useEffect, useState } from 'react';

import './home.css';
import Sidebar from '../components/Sidebar/Sidebar';
import { AiOutlineVideoCameraAdd, AiOutlineUserAdd } from "react-icons/ai";

import CreateVideoGenerationQueue from '../components/CreateVideoGenerationQueue';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CreateVideo = () => {

    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event) => {
        const value = event.target.value;
        setSelectedOption(value);
        handleCreateConversationClick(value);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('https://trustreelai-backend-production.up.railway.app/media/images/replica/image4_vH7rmUI.png');
    const [selectedTitle, setSelectedTitle] = useState('Steve - Conference Room Video');
    const [selectedCode, setSelectedCode] = useState('r4249d7154');

    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isCreatingConversation, setIsCreatingConversation] = useState('video');

    const handleLabelClick = () => {
        setIsModalOpen(true);
    };

    const handleCardClick = (image, title, code, index) => {
        setSelectedImage(image);
        setSelectedTitle(title);
        setSelectedCode(code);
        setSelectedCardIndex(index);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCreateConversationClick = (value) => {
        if (value === "Create Conversation") {
            setIsCreatingConversation("conversation");
        }
        else {
            setIsCreatingConversation("video");
        }
    };

    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get(`${backendUrl}/avatar/api/images/`)
            .then(response => {
                setImages(response.data);
            })
            .catch(error => {
                console.error('Error fetching images:', error);
            });
    }, []);

    return (
        <div>
            <Sidebar></Sidebar>
            <div className='ml-20 sm:ml-60 md:ml-60'>
                <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 '>
                    {isCreatingConversation === 'video' ? (
                        <div class="flex justify-center items-center h-auto min-h-full p-4">
                            <div class=" flex-colum bg-white shadow-lg rounded-lg w-full h-full max-w-3xl p-6 flex flex-col">

                                <label class="text-lg font-semibold text-gray-700 mb-4">Create Video</label>

                                <label onClick={handleLabelClick} className="flex justify-between items-center border border-color-gray-200 p-3 rounded-lg cursor-pointer mb-4">
                                    <div className="flex items-center">
                                        <img src={selectedImage} alt="Icon" className="h-10 w-10 rounded-full mr-2 object-cover" />
                                        <span className="text-gray-700">{selectedTitle}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </label>
                                {isModalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                                        <div className="bg-white p-6 rounded-lg flex size-full flex-col gap-6 overflow-auto p-6 pb-20 w-4/5 h-4/5">
                                            <button
                                                onClick={handleCloseModal}
                                                className="self-end bg-red-500 text-white p-2 rounded"
                                            >
                                                Cerrar
                                            </button>
                                            <div className="grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
                                                {/* MAP */}
                                                {images.map((image, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            if (image.style !== "grayscale(100%)") {
                                                                handleCardClick(`${backendUrl}${image.image}`, image.replicaName, image.code, index);
                                                            }
                                                        }}
                                                        className={`border bg-card text-card-foreground shadow-sm group rounded-md outline-primary hover:shadow  ${selectedCardIndex === index ? 'border-4 border-pink-500' : ''}  ${image.style === "grayscale(100%)" ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                                    >
                                                        <div className='p-2.5 pb-4'>
                                                            <img src={`${backendUrl}${image.image}`} alt="Gimy" className="h-full w-full object-cover mb-2" style={{filter:image.style}}/>
                                                        </div>
                                                        <div className='p-6 pt-0 flex flex-col content-start items-start px-2.5 pb-4'>
                                                            <span>{image.replicaName}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <label class="text-lg font-semibold text-gray-700 mb-2">Script to Video</label>

                                <CreateVideoGenerationQueue replicaCode={selectedCode} />

                            </div>
                        </div>
                    ) : (<></>)}

                    {isCreatingConversation === 'conversation' ? (
                        <div class="flex justify-center items-center h-screen p-4">
                            <div class="bg-white shadow-lg rounded-lg w-full h-full max-w-3xl p-6 flex flex-col">

                                <label class="text-lg font-semibold text-gray-700 mb-4">Create Conversation</label>

                                <label onClick={handleLabelClick} className="flex justify-between items-center border border-color-gray-200 p-3 rounded-lg cursor-pointer mb-4">
                                    <div className="flex items-center">
                                        <img src={selectedImage} alt="Icon" className="h-10 w-10 rounded-full mr-2 object-cover" />
                                        <span className="text-gray-700">{selectedTitle}</span>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </label>
                                {isModalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 ">
                                        <div className="bg-white p-6 rounded-lg flex size-full flex-col gap-6 overflow-auto p-6 pb-20 w-4/5 h-4/5">
                                            <div className="grid grid-cols-[repeat(auto-fill,_minmax(276px,_1fr))] gap-6">
                                                {/* MAP */}
                                                {images.map((image, index) => (
                                                    <div key={index} onClick={() => handleCardClick(`${backendUrl}/${image.image}`, image.replicaName, image.code, index)} className={`border bg-card text-card-foreground shadow-sm group rounded-md outline-primary hover:shadow cursor-pointer ${selectedCardIndex === index ? 'border-4 border-pink-500' : ''}`}>
                                                        <div className='p-2.5 pb-4'>
                                                            <img src={`${backendUrl}/${image.image}`} alt="Gimy" className="h-full w-full object-cover mb-2" />
                                                        </div>
                                                        <div className='p-6 pt-0 flex flex-col content-start items-start px-2.5 pb-4'>
                                                            <span>{image.replicaName}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <label class="text-lg font-semibold text-gray-700 mb-2">Script to Video</label>


                                <textarea class="border border-gray-300 p-3 rounded-lg h-40 resize-none mb-4" placeholder="Enter your script here...">
                                    Tell us your name and company, and which of Gonzalo's conferences you attended. ((pause 5))
                                    In general terms, what did you think of it? What caught your attention the most? ((pause 6))
                                    Would you recommend that same conference to other business colleagues? ((pause 7))
                                </textarea>


                                <div class="flex justify-end">
                                    <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow btnx h hover:text-[#f230aa]">
                                        Join the Conversation
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (<></>)}

                    <div class="flex justify-center items-center h-screen p-4">
                        <div class="bg-white shadow-lg rounded-lg w-full h-full max-w-3xl p-6 flex flex-col">

                            <label class="text-lg font-semibold text-gray-700 mb-4">Select Response type</label>

                            <div className="flex flex-col w-full max-w-xs mx-auto mt-10">
                                <label htmlFor="combobox" className="mb-2 text-sm font-medium text-gray-900">
                                    Select an option
                                </label>
                                <select
                                    id="combobox"
                                    value={"Voice to Response"}
                                    onChange={handleSelectChange}
                                    className="block w-full p-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >   
                                    <option value="Voice to Response">Voice to Response </option>
                                    {/*<option value="">Choose an option</option>
                                    
                                    <option value="Click to Response">Click to Response</option>
                                    <option value="Create Conversation">Create Conversation</option>*/}
                                </select>

                                {/* Mostrando la opción seleccionada */}
                                {selectedOption && (
                                    <p className="mt-4 text-sm text-gray-600">
                                        You selected: <span className="font-semibold">{selectedOption}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CreateVideo;