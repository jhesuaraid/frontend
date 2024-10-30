import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;


const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/company/api/register/`, {
        email,
        username,
        password,
        password2: confirmPassword,
        company: company || null, // Enviar null si no se especifica la compañía
      });
      // Aquí deberías guardar el token JWT en el localStorage o en el state
      localStorage.setItem('token', response.data.access);
      navigate('/dashboard');
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <>
   {/* <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-3/4 max-w-md">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Join us</h1>
            <p className="text-balance text-muted-foreground">Enter your details below to create a new account.</p>
          </div>
          <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">User Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Company (optional)</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md">
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://tu-imagen.com/image.jpg')" }}>
      </div>
    </div>
    */}
    </>
  );
};

export default SignUpForm;