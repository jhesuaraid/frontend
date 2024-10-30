import React, { useState } from 'react';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

function EndConversationButton({ conversationId }) {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const endConversation = async () => {
    try {
      const res = await fetch(`${backendUrl}/ejecutar_end_conversation/${conversationId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button onClick={endConversation}>End Conversation</button>
    </div>
  );
}

export default EndConversationButton;