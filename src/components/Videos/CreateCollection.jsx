import React, { useState } from 'react';
import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const CreateCollection = () => {
  const [libraryId, setLibraryId] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendUrl}/video/api/create_collection/`, {
        library_id: libraryId,
      });
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error');
      setResponse(null);
    }
  };

  return (
    <div>
      <h1>Create Collection</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Library ID:</label>
          <input
            type="text"
            value={libraryId}
            onChange={(e) => setLibraryId(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {response && <div>Response: {JSON.stringify(response)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  );
};

export default CreateCollection;