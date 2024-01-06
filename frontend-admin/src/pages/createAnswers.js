import React from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/createanswers.css';


const CreateAnswers = () => {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        // Create the payload
        // Send it to the backend
        // Create the quiz
        e.preventDefault();
        const text = document.querySelector('#name-03').value;
        const image = document.querySelector('#image-01').files[0];
        const audio = document.querySelector('#audio-01').value;
        if (text === '' || image === '') {
            alert('Please fill out all fields');
            return;
        }

       
        // axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/answers', payload, {
        //     headers: {
        //         Authorization: `Bearer ${Cookies.get('jwt')}`
        //     }
        // }).then((res) => {
        //     console.log('response', res);
        // }).catch((err) => {
        //     if (err.response.status === 401) {
        //         localStorage.removeItem('userID');
        //         Cookies.remove('jwt');
        //         navigate('/login');
        //         //window.location.href = '/login';
        //     }
        // });
        const formData = new FormData();
        formData.append('image', image);
        formData.append('text', text);
        if (audio !== '') {
            formData.append('audio', audio);
        }
        axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/answers', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        }).then((res) => {
            console.log('response', res);
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('userID');
                Cookies.remove('jwt');
                navigate('/login');
                //window.location.href = '/login';
            }
        });
    }

    return (

        <div className='page-view set-scroll'>
            <h1>Create an Answer</h1>
            <form className='form-format'>
                <div className='detail-block'>
                    <label>Answer Text</label>
                    <input id='name-03' placeholder='enter name of answer' />
                </div>
                <div className='detail-block'>
                    <label>Image</label>
                    <input id='image-01' placeholder='enter image URL' type='file' />
                </div>
                <div className='detail-block'>
                    <label>Audio URL (Optional)</label>
                    <input id='audio-01' placeholder='enter audio URL' />
                </div>

                <button onClick={onSubmit}>Create Answer</button>
            </form>

        </div>
    )
}

export default CreateAnswers;