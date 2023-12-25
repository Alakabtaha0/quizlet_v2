import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/dashboard.css';



const Dashboard = () => {
    const [questions, setQuestions] = useState([]);
    const [placement, setPlacement] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const res = await axios.get('https://quizlet-01.nw.r.appspot.com/api/v1/questions', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`
                    }
                });
                setQuestions(res.data.questions);
            } catch (err) {
                if (err.response.status === 401) {
                    localStorage.removeItem('userID');
                    Cookies.remove('jwt');
                    navigate('/login');
                }
            }
        }
        fetchAnswers();
    }, []);


    const onSubmit = (e) => {
        // Create the payload
        // Send it to the backend
        // Create the quiz
        e.preventDefault();
        const name = document.querySelector('#name-01').value;
        const description = document.querySelector('#description-01').value;
        if (name === '' || description === '' || placement.length === 0) {
            alert('Please fill out all fields');
            return;
        }
        // Create the payload
        const payload = {
            name,
            description,
            questions: placement,
        }
        axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/quiz', payload, {
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('userID');
                Cookies.remove('jwt');
                navigate('/login');
            }
        });
    }

    const pushElement = (e) => {
        const selectedId = e.target.value;
        // const selectedText = e.target.options[e.target.selectedIndex].text;

        // Remove question from questions array so user can't select twice
        // Add it to placement array (p)
        let p;
        let q = questions.filter((question) => {
            if (question._id !== selectedId) {
                return true;
            } else {
                p = question;
                return false;
            }

        });
        setQuestions(q);
        // Append selectedText to placement array
        setPlacement([...placement, p]);
        // // Append selectedId to payload object
        // if (payload.questions === undefined) {
        //     setPayload({...payload, "questions": [selectedId]});
        // } else {
        //     setPayload({...payload, "questions": [...payload.questions, selectedId]});
        // }
    };

    const removeElement = (e) => {
        const selectedId = e.target.getAttribute('data-value');
        // Remove question from placement array
        // Add it to questions array so user can select again
        let q;
        let p = placement.filter((place) => {
            if (place._id !== selectedId) {
                return true;
            } else {
                q = place;
                return false;
            }
        });
        setPlacement(p);
        setQuestions([...questions, q]);
    }


    return (
        <div className='page-view set-scroll'>
            <h1>Create Quiz</h1>
            <form className='form-format'>
                <div className='detail-block'>
                    <label>Quiz Name</label>
                    <input id='name-01' placeholder='enter name of quiz' />
                </div>
                <div className='detail-block'>
                    <label>Quiz Description</label>
                    <textarea id='description-01' rows='1' cols='50' className='quiz-description-block' placeholder='enter a description' />
                </div>
                <div className='detail-block'>
                    <label>Quiz Questions</label>
                    <div className='placement-area'>
                        {
                            placement && placement.map((place) => {

                                return <div className='option-block'>
                                    <p>{place.name}</p>
                                    <div data-value={place._id} className='close-x-mark' onClick={removeElement}>X</div>
                                </div>
                            })
                        }
                    </div>

                    <select onChange={pushElement}>
                        <option>--Select--</option>
                        {questions && questions.map((question) => {
                            return <option value={question._id} >{question.name}</option>
                        })}
                    </select>
                </div>

                <button onClick={onSubmit}>Create Quiz</button>
            </form>

        </div>
    )
}

export default Dashboard