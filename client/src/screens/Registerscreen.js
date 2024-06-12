import React, { useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Success from '../components/Success';
import Error from '../components/Error';

function Registerscreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [invalidFields, setInvalidFields] = useState([]);

    async function register() {
        const invalidFields = [];

        if (!name.trim()) {
            invalidFields.push('name');
        }
        if (!email.trim() || !validateEmail(email)) {
            invalidFields.push('email');
        }
        if (!password.trim()) {
            invalidFields.push('password');
        }
        if (!cpassword.trim()) {
            invalidFields.push('cpassword');
        }
        if (password !== cpassword) {
            invalidFields.push('password', 'cpassword');
        }

        if (invalidFields.length > 0) {
            setInvalidFields(invalidFields);
            return;
        }

        const user = { name, email, password, cpassword };

        try {
            setLoading(true);
            const result = await axios.post('/api/users/register', user).data;
            setLoading(false);
            setSuccess(true);
            clearForm();
            // Redirect to login page
            window.location.href = '/login';
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(true);
        }
    }

    function validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function clearForm() {
        setName('');
        setEmail('');
        setPassword('');
        setCpassword('');
    }

    return (
        <div>
            {loading && <Loader />}
            {success && <Success message="Registration Success" />}
            {error && <Error message="Registration failed" />}

            <div className="row justify-content-center mt-5">
                <div className="col-md-5 mt-5">
                    <div className="bs">
                        <h1>Register</h1>
                        <input
                            type="text"
                            className={`form-control ${invalidFields.includes('name') ? 'is-invalid' : ''}`}
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <input
                            type="email"
                            className={`form-control ${invalidFields.includes('email') ? 'is-invalid' : ''}`}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            className={`form-control ${invalidFields.includes('password') ? 'is-invalid' : ''}`}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            className={`form-control ${invalidFields.includes('cpassword') ? 'is-invalid' : ''}`}
                            placeholder="Confirm Password"
                            value={cpassword}
                            onChange={(e) => setCpassword(e.target.value)}
                        />

                        <button className="btn btn-primary mt-3" onClick={register}>
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registerscreen;
