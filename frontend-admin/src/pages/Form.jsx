import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import '../styles/form.css';


// TO DO
// 1. Sort out layout of questions -- DONE
// 2. Retrieve answers on click
// 3. Create the payload
// 4. Send the payload to the backend to create a new result

const Form = ({ quiz }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const { name, questions, _id } = quiz;
    // Send the payload to the backend LATER
    // Need to create routes with completed quiz data
    const payload = {};

    // Get index of question
    // Render the question
    // On click of a button go to next question
    const nextQuestion = () => {
        setCurrentQuestion(currentQuestion => currentQuestion + 1);
    }

    const previousQuestion = () => {
        setCurrentQuestion(currentQuestion => currentQuestion - 1);
    }
    const formSubmit = () => {
        console.log('form submitted');
    }
    return (
        <div className="set-scroll page-view">

            <h1>{name}</h1>
            {

                // Sort out the layout of the questions
                // Allow the user to select an answer
                // Save the answer to a json
                // Send the json to the backend

                questions && <Quiz
                    question={questions[currentQuestion].name}
                    answers={questions[currentQuestion].answers}
                    questionNumber={currentQuestion + 1} />
            }

            <div className='btn-local'>
                {currentQuestion < questions.length - 1 ? <button onClick={nextQuestion}>Next</button> : <button onClick={formSubmit}>Submit</button>}
                {currentQuestion > 0 && <button onClick={previousQuestion}>Previous</button>}
            </div>

        </div>
    )
    
}

const Quiz = ({ question, answers, questionNumber }) => {
    
    return (
        <>
            <h2 className='q-header'>{questionNumber}. {question}</h2>
            <div className='q-format'>
                
                {answers.map((answer, key) => {
                    return <Answers questionNumber={key} answer={answer} />
                })}
            </div>
        </>

    )
}

const Answers = ({ answer, questionNumber }) => {
    const divStyle = {
        backgroundImage: `url(${answer.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };
    return (
        <div className='a-format' style={divStyle}>
            <h3 className='rm-mbp'>{answer.text}</h3>
        </div>
    )
}

export default Form;