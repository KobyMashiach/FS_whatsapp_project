import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login_page.css';

function LoginPageComp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const login = async () => {
        const url = 'http://localhost:3000/auth/login';
        const loginData = { username, password };

        try {
            const resp = await axios.post(url, loginData);
            sessionStorage.setItem('token', resp.data.token);
            sessionStorage.setItem('username', resp.data.user.username);
            sessionStorage.setItem('id', resp.data.user._id);

            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="login-button" onClick={login}>Login</button>
                <a className="register-link" href="/register">Don't have an account? Register here</a>
            </div>
        </div>
    );
}

export default LoginPageComp;