import React, { useState } from 'react';
import Swal from 'sweetalert2';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EmailForm = () => {
    const [subject, setSubject] = useState('Link con La video conferencia');
    const [message, setMessage] = useState('http://localhost:3000/mesajes');
    const [recipient, setRecipient] = useState('sjhesua@gmail.com');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`${backendUrl}/send-email/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject, message, recipient }),
            });
            const data = await response.json();
            console.log(data);

            // Mostrar mensaje de éxito con SweetAlert2
            Swal.fire({
                title: '¡Éxito!',
                text: 'El mensaje ha sido enviado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);

            // Mostrar mensaje de error con SweetAlert2
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al enviar el mensaje.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='hidden'>
                <label htmlFor="subject">Asunto:</label>
                <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
            </div>
            <div className='hidden'>
                <label htmlFor="message">Mensaje:</label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>
            <div className='hidden'>
                <label htmlFor="recipient">Destinatario:</label>
                <input
                    type="email"
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
                {isLoading ? (
                    <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                    </svg>
                ) : (
                    'Enviar Email'
                )}
            </button>
        </form>
    );
};

export default EmailForm;