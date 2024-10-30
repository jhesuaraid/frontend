import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${backendUrl}/company/api/token/verify/`, { token });
    return response.status === 200;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

export default verifyToken;