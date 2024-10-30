import React from 'react';
import './test.css'
import Webcam from "react-webcam";
import { AiFillVideoCamera, AiOutlineVideoCamera, AiFillAudio, AiOutlineAudio } from 'react-icons/ai';


const CenteredComponent = () => {
    const [isCameraOn,setIsCameraOn] = React.useState(true);
    const [isMicrophoneActive,setIsMicrophoneActive] = React.useState(true);

    return (
        <div className="centered-container">
            <Webcam />

            <div className="button-container">
               
                <button onClick={() => setIsCameraOn(!isCameraOn)} className={`mr-2 w-12 h-12 text-white rounded flex items-center justify-center ${isCameraOn ? 'bg-good' : 'bg-danger'}`}>
                    {isCameraOn ? <AiFillVideoCamera className="" /> : <AiOutlineVideoCamera />}
                </button>
                <button onClick={() => setIsMicrophoneActive(!isMicrophoneActive)} className={`w-12 h-12 text-white rounded flex items-center justify-center ${isMicrophoneActive ? 'bg-good' : 'bg-danger'}`}>
                    {isMicrophoneActive ? <AiFillAudio /> : <AiOutlineAudio />}
                </button>
            </div>

            <select className="select-box">
                <option value="">Choose an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </select>

            <p className="text">
                Are you ready to join?
                <button className="join-button">Join</button>
            </p>
        </div>
    );
};

export default CenteredComponent;
