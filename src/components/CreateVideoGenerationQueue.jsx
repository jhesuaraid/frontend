import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CreateVideoGenerationQueue = ({ replicaCode }) => {
    const [texts, setTexts] = useState(['']);
    const [videoName, setVideoName] = useState('');
    const [customeUrl, setCustomeUrl] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (index, event) => {
        const newTexts = [...texts];
        newTexts[index] = event.target.value;
        setTexts(newTexts);
    };

    const handleAddText = () => {
        setTexts([...texts, '']);
    };

    const handleRemoveText = (index) => {
        const newTexts = texts.filter((_, i) => i !== index);
        setTexts(newTexts);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); // Obtener el token JWT del almacenamiento local
        setLoading(true);
        try {
            const res = await axios.post(
                `${backendUrl}/videos/api/video-generation-queue/`,
                { replicaCode: replicaCode, texts: texts, videoName: videoName, customeURL: customeUrl },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token JWT en los encabezados
                    },
                }
            );
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError(err.response ? err.response.data : 'Error');
            setResponse(null);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <form onSubmit={handleSubmit} className="flex justify-center flex-col">
                <label>Custom URL</label>
                <input
                    type="text"
                    value={customeUrl}
                    onChange={(event) => setCustomeUrl(event.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                    placeholder={`your-custom-url`}
                />
                <input
                    type="text"
                    value={videoName}
                    onChange={(event) => setVideoName(event.target.value)}
                    className="border border-gray-300 p-2 rounded-lg w-full mb-3"
                    placeholder={`Video Name`}
                />
                {texts.map((text, index) => (
                    <div key={index} className="mb-4">
                        <input
                            type="text"
                            value={text}
                            onChange={(event) => handleInputChange(index, event)}
                            className="border border-gray-300 p-2 rounded-lg w-full"
                            placeholder={`Question ${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveText(index)}
                            className="ml-2 text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {!loading && (
                <>    
                <button
                    type="button"
                    onClick={handleAddText}
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg mb-4"
                >
                    Add Question
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow btnx h hover:text-[#f230aa]"
                >
                    Submit
                </button>
                </>
                )}
            </form>
            
            {loading && (
                <div className="mt-4 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
                    <h3 className="text-lg font-semibold">Cargando...</h3>
                </div>
            )}

            {response && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                    <h3 className="text-lg font-semibold">Video created successfully!</h3>
                    <Link to={`/dashboard/videolist`} className="text-blue-500 hover:underline">
                        Video list
                    </Link>
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                    <h3 className="text-lg font-semibold">Error:</h3>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default CreateVideoGenerationQueue;