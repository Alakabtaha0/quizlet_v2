import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../styles/createquestion.css';



const CreateQuestion = () => {
    const [answers, setAnswers] = useState(null);
    const [placement, setPlacement] = useState([]);
    useEffect(() => {
        const fetchAnswers = async () => {
            try {
                const res = await axios.get('https://quizlet-01.nw.r.appspot.com/api/v1/answers', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('jwt')}`
                    }
                });
                setAnswers(res.data.answers);
            } catch (err) {
                if (err.response.status === 401) {
                    localStorage.removeItem('userID');
                    Cookies.remove('jwt');
                    window.location.href = '/login';
                }
            }
        }
        fetchAnswers();
    },[]);
    
    const onSubmit = (e) => {
        // Create the payload
        // Send it to the backend
        // Create the quiz
        e.preventDefault();
        const name = document.querySelector('#name-02').value;
        if (name === '' || placement.length === 0) {
            alert('Please fill out all fields');
            return;
        }
        // Create the payload (x is the payload)
        const x = {
            name,
            answers: placement,
        }
        axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/questions', x, {
            headers: {
                Authorization: `Bearer ${Cookies.get('jwt')}`
            }
        }).catch((err) => {
            if (err.response.status === 401) {
                localStorage.removeItem('userID');
                Cookies.remove('jwt');
                window.location.href = '/login';
            }
        });
    }

    const pushElement = (e) => {
        const selectedId = e.target.value;

        // Remove question from questions array so user can't select twice
        // Add it to placement array (p)
        let p;
        let q = answers.filter((answer) => {
            if (answer._id !== selectedId) {
                return true;
            } else {
                p = answer;
                return false;
            }
            
        });
        setAnswers(q);
        // Append selectedText to placement array
        setPlacement([...placement, p]);
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
        setAnswers([...answers, q]);
    }


	return (
        <div className='page-view set-scroll'>
            <h1>Create Question</h1>
            <form className='form-format'>
                <div className='detail-block'>
                    <label>Question Name</label>
                    <input id='name-02' placeholder='enter the question name'/>
                </div>
                {/* <div className='detail-block'>
                    <label>Quiz Description</label>
                    <textarea id='description-01' rows='1' cols='50' className='quiz-description-block' placeholder='enter a description'/>
                </div> */}
                <div className='detail-block'>
                    <label>Quiz Answers</label>
                    <div className='placement-area'>
                        {
                            placement && placement.map((place) => {
                                return <div className='option-block'>
                                    <p>{place.text}</p>
                                    <div data-value={place._id} className='close-x-mark' onClick={removeElement}>X</div>
                                </div>
                            })
                        }
                    </div>

                    <select onChange={pushElement}>
                        <option>--Select--</option>
                        {answers && answers.map((answer) => {
                            return <option value={answer._id} >{answer.text}</option>
                        })}
                    </select>
                </div>
                
                <button onClick={onSubmit}>Create Quiz</button>
            </form>
            
        </div>
	)
}

export default CreateQuestion;