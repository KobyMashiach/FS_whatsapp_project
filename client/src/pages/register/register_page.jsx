import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register_page.css';

function RegisterPageComp() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const navigate = useNavigate();

    const register = async () => {

        if (username == "") {
            alert('Have to enter username\nPlease try again.');
            return;
        }

        if (password !== rePassword) {
            alert('Passwords do not match.\nPlease try again.');
            return;
        }

        const registerData = { username, password };

        try {
            const resp = await axios.post('http://localhost:3000/users', registerData);
            alert('Registration successful! Please log in.');
            navigate('/');
        } catch (error) {
            console.error('Error:', error);
            alert('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Register</h1>
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Re-Password</label>
                    <input type="password" onChange={(e) => setRePassword(e.target.value)} />
                </div>
                <button className="register-button" onClick={register}>Register</button>
                <a className="login-link" href="/">Already have an account? Log in</a>
            </div>
        </div>
    );
}

export default RegisterPageComp;
