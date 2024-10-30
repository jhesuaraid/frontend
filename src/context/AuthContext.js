import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const swal = require('sweetalert2');

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authToken, setAuthToken] = useState(()=>localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")): null);
    const [user, setUser] = useState(()=>localStorage.getItem("authToken") ? JSON.parse(localStorage.getItem("authToken")): null);
    const [loading, setLoading] = useState(true);

    
    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        let url = `${backendUrl}/company/api/token/`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email, password})
        });
        const data = await response.json();
        if (response.status === 200) {
            setAuthToken(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem("authToken", JSON.stringify(data));
            navigate("/");
            swal.fire({
                title: "Login Successful",
                text: "You have successfully logged in.",
                icon: "success",
                confirmButtonText: "OK"
            });
        }
        else{
            console.log(response.status);
            swal.fire({
                title: "Login Failed",
                text: "Invalid email or password.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    const registerUser = async (username, email, password,password2,company=null) => {
        let url = `${backendUrl}/company/api/register/`;
        const body = { username, email, password, password2 };
        if (company) {
            body.company = company;
        }
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username,email,password,password2})
        });
        if (response.status === 201) {
            swal.fire({
                title: "Registration Successful",
                text: "You have successfully registered.",
                icon: "success",
                confirmButtonText: "OK"
            });
            navigate("/login");
        } else {
            console.log(response.status);
            swal.fire({
                title: "Registration Failed",
                text: "Invalid data.",
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    }

    const logoutUser = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem("token");
        navigate("/login");
        swal.fire({
            title: "Logout Successful",
            text: "You have successfully logged out.",
            icon: "success",
            confirmButtonText: "OK"
        });
    }

    const contexData = {authToken, setAuthToken, user, setUser, loginUser, registerUser, logoutUser};
    
    useEffect(() => {
        if (authToken) {
            setUser(jwtDecode(authToken.access));
        }
        setLoading(false);
    },[authToken,loading]);

    return (
        <AuthContext.Provider value={contexData}>
            <ThemeProvider>
            {loading ? null: children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
}

export default AuthContext;