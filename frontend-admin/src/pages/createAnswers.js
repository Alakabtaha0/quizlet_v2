import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/createanswers.css';



const CreateAnswers = () => {
   
    const onSubmit = (e) => {
        // Create the payload
        // Send it to the backend
        // Create the quiz
        e.preventDefault();
        
        const text = document.querySelector('#name-03').value;
        const image = document.querySelector('#image-01').value;
        const audio = document.querySelector('#audio-01').value;
        if (text === '' || image === '' ) {
            alert('Please fill out all fields');
            return;
        }
        const payload = {
            text,
            image,
        }
        if (audio !== '') {
            payload.audio = audio;
        }
        axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/answers', payload, {
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    if (!Cookies.get('jwt')) {
        localStorage.removeItem('userID');
        window.location.href = '/login';
    }
	return (
        <div className='page-view set-scroll'>
            <h1>Create an Answer</h1>
            <form className='form-format'>
                <div className='detail-block'>
                    <label>Answer Text</label>
                    <input id='name-03' placeholder='enter name of answer'/>
                </div>
                <div className='detail-block'>
                    <label>Image URL</label>
                    <input id='image-01' placeholder='enter image URL'/>
                </div>
                <div className='detail-block'>
                    <label>Audio URL (Optional)</label>
                    <input id='audio-01' placeholder='enter audio URL'/>
                </div>
                
                <button onClick={onSubmit}>Create Answer</button>
            </form>
            
        </div>
	)
}

export default CreateAnswers;