import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar/Sidebar';
import ClientList from '../components/clientList';
import withAuth from '../funtions/withAuth';
import { PlusIcon } from '@heroicons/react/24/solid';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UploadExcel = () => {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [newClient, setNewClient] = useState({ names: '', emails: '' });

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/client/add-clients/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClient),
            });
            if (response.ok) {
                setMessage('Client added successfully');
                setShowModal(false);
                fetchClients();
                // Actualizar la lista de clientes si es necesario
            } else {
                setMessage('Failed to add client');
            }
        } catch (error) {
            setMessage('Error: ' + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${backendUrl}/client/upload-excel/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.success || 'File uploaded successfully');
            setUsers(response.data.added_clients);
            fetchClients();
        } catch (error) {
            setMessage(error.response.data.error || 'Error uploading file');
        }
    };

    const fetchClients = async () => {
        try {
            const response = await axios.get(`${backendUrl}/client/search-clients/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Asumiendo que el token está almacenado en localStorage
                }
            });
            setUsers(response.data);
            console.log(response.data)
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        <div className="ml-20 sm:ml-60 md:ml-60">
            <Sidebar />

            <div className='flex flex-col md:flex-row items-center justify-around p-4 space-y-4 md:space-y-0 md:space-x-4'>
                <h2 className="text-2xl font-bold mb-6 mt-6 text-center md:text-left">Upload Excel File</h2>

                <form className='flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4' onSubmit={handleSubmit}>
                    <div className="w-full md:w-auto overflow-hidden">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full md:w-auto truncate"
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-full bg-j-pink">Upload</button>
                </form>

                {message && <p className="text-center md:text-left">{message}</p>}

                <button
                    onClick={() => setShowModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-full bg-j-pink flex items-center"
                >
                    Add Client
                    <PlusIcon className="h-5 w-5 ml-2" />
                </button>
            </div>
            <ClientList clients={users} />

            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="">
                                    <div className="mt-3 text-center">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Add Client
                                        </h3>
                                        <div className="mt-2">
                                            <form onSubmit={handleAddClient}>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={newClient.name}
                                                        onChange={(e) => setNewClient({ ...newClient, names: e.target.value })}
                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        value={newClient.email}
                                                        onChange={(e) => setNewClient({ ...newClient, emails: e.target.value })}
                                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                                    />
                                                </div>
                                                <div className="mt-4">
                                                    <button
                                                        type="submit"
                                                        className="bg-blue-500 text-white px-4 py-2 rounded-full bg-j-pink"
                                                    >
                                                        Add
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowModal(false) }}
                                                        className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-full "
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default withAuth(UploadExcel);

