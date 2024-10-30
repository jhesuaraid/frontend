import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import verifyToken from './verifyToken';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          const isValid = await verifyToken(token);
          if (isValid) {
            setIsAuthenticated(true);
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      };

      checkAuth();
    }, [navigate]);

    if (!isAuthenticated) {
      return null; // O un componente de carga
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;