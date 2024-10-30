import React, { useState, useEffect } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ClientList = ({ clients }) => {
  const [clientList, setClientList] = useState(clients);
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/client/delete-clients/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setClientList(clientList.filter(client => client.id !== id));
      } else {
        console.error('Failed to delete client');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setClientList(clients);
  }, [clients]);

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Client List</h2>

      {/* Tabla para pantallas grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Name
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Email
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {clientList.map((client, index) => (
              <tr key={index} className="bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-b">
                  {client.names}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                  {client.emails}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas para pantallas móviles */}
      <div className="md:hidden space-y-4">
        {clientList.map((client, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800">{client.names}</h3>
            <p className="text-gray-600">{client.emails}</p>
            <button
              onClick={() => handleDelete(client.id)}
              className="text-red-600 hover:text-red-900 mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;