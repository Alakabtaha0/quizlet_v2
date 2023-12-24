import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/login.css';


const Login = () => {
    
    const incorrectLogin = () => {
        const incorrect = document.querySelector('#incorrect-indicator-1');
        incorrect.classList.remove('hidden');
    }

    // Post the login data to the backend and set the jwt cookie
    const onSubmit = () => {
        // Get the values from the input fields
        const email = document.querySelector('.log-input input[type="text"]').value;
        const password = document.querySelector('.log-input input[type="password"]').value;
        axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/users/login', {
            email: email,
            password: password
        }).then((res) => {
            Cookies.set('jwt', res.data.token);
            localStorage.setItem('userID', res.data.user._id);
            window.location.href = '/dashboard';
        }).catch((err) => {
            console.log(err);
            incorrectLogin();
        });
    }
        return (

            <div className='log-display-box center-origin'>
                <h1 className='comp-title-h1'>SIGN IN TO YOUR ACCOUNT</h1>
                <div className='log-input'>
                    <input type='text' className='log-fields' placeholder='Email'></input>
                    <input type='password' className='log-fields' placeholder='Password'></input>
                    <p id='incorrect-indicator-1' className='hidden'>Incorrect Username Or Password, Please Try Again</p>
                    <button className='log-fields log-btn' onClick={onSubmit}>Submit</button>
                </div>
                <p className='comp-title-h1'>Don't have an account? <Link to='/sign-up'>Sign up here</Link></p>
            </div>
        )
    }

    export default Login;