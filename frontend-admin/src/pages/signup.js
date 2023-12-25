import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import Cookies from "js-cookie";
import axios from "axios";

const SignUp = () => {
	const [step, setStep] = useState(1);
	const currentPage = [<Step1 setStep={setStep} />, <Step2 setStep={setStep} />, <Step3 setStep={setStep} />];

  return (
		<>
			{currentPage[step-1]}
		</>
	);
};

const Step1 = ({setStep}) => {

	const onSubmit = () => {
		// Create the payload
		const payload = {
			name: document.querySelector('#name-field').value,
			email: document.querySelector('#email-field').value
		}
		// Send the payload to backend
		axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/users/signup', payload)
		.then((res) => {
			// Save the token to cookies
			Cookies.set('jwt', res.data.token);
			// Increment the step
			setStep(step => step + 1);
		}).catch((err) => {
			console.log(err);
		});
		
	}
  return (
    <div className="log-display-box center-origin">
      <h1 className="comp-title-h1">Sign Up Form</h1>
      <div className="log-input">
        <input id='name-field' type="text" className="log-fields" placeholder="Full Name" />
        <input id='email-field' type="text" className="log-fields" placeholder="Email" />
        <button className="log-fields log-btn" onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

const Step2 = ({setStep}) => {
	const onSubmit = () => {
		// Create payload
		const payload = {
			verificationCode: document.querySelector('#otp-field').value*1
		}
		// Send payload to backend along with cookie
		axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/users/signup/verify-email', payload, {
			headers: {
				Authorization: `Bearer ${Cookies.get('jwt')}`
			}
		}).then((res) => {
			setStep(step => step + 1);
		}).catch((err) => {
			console.log(err);
		})

	}

	return (
		<div className="log-display-box center-origin">
			<h1 className="comp-title-h1">Verify Your Email</h1>
			<p>Check your email address for a verification code sent to you</p>
			<div className="log-input">
				<input id='otp-field' type="text" className="log-fields" placeholder="Enter verification code" />
				<button className="log-fields log-btn" onClick={onSubmit}>Submit</button>
			</div>
		</div>
	)
}

const Step3 = ({setStep}) => {
	const navigate = useNavigate();
	const onSubmit = () => {

		// Create payload
		const payload = {
			password: document.querySelector('#password-field').value
		}
		// Send payload to backend along with cookie
		axios.post('https://quizlet-01.nw.r.appspot.com/api/v1/users/signup/finish-sign-up', payload, {
			headers: {
				Authorization: `Bearer ${Cookies.get('jwt')}`
			}
		}).then((res) => {
			localStorage.setItem('userID', res.data.newUser._id);
			navigate('/dashboard');
			//window.location.href = '/dashboard';
		}).catch((err) => {
			console.log(err);
		});
	}

	return (
		<div className="log-display-box center-origin">
			<h1 className="comp-title-h1">Create Your Password</h1>
			<div className="log-input">
				{/* Add password validation i.e. confirm password */}
				<input id='password-field' type="password" className="log-fields" placeholder="Password" />
				<button className="log-fields log-btn" onClick={onSubmit}>Submit</button>
			</div>
		</div>
	)

}

export default SignUp;
