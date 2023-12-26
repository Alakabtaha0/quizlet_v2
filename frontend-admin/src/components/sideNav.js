import React, { useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import '../styles/sideNav.css';
import Cookies from "js-cookie";

const SideNav = () => {
	const navigate = useNavigate();
	var userName;

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await axios.get(`https://quizlet-01.nw.r.appspot.com/api/v1/users/${localStorage.getItem('userID')}`, {
					headers: {
						Authorization: `Bearer ${Cookies.get('jwt')}`
					}
				});
	
				userName = res.data.user.name;
				document.querySelector('.side-nav p').innerHTML = `Welcome ${userName}`;
			} catch (err) {
				if (err.response.status === 401) {
					localStorage.removeItem('userID');
					Cookies.remove('jwt');
					navigate('/login');
					//window.location.href = '/login';
				}
			}
		}

		fetchUser();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const logout = () => {
		localStorage.removeItem('userID');
		Cookies.remove('jwt');
		navigate('/login');
		window.location.reload();
	}

	const toggleNav = () => {
		if (window.innerWidth >= 500) return;

		const sideNav = document.querySelector('.side-nav');
		const navForm = document.querySelector('.nav-form');
		const burgerBtn = document.querySelector('.burger-btn');
		if (navForm.style.display === 'none') {
			navForm.style.display = 'block';
			sideNav.style.height = '250px';
			burgerBtn.classList.add('open');
		} else {
			navForm.style.display = 'none';
			sideNav.style.height = '40px';
			burgerBtn.classList.remove('open');
		}
	}

	return (
		<div className="side-nav">
			<div className="burger-btn" onClick={toggleNav}>
				<div></div>
				<div></div>
				<div></div>
			</div>
			<p></p>
			<ul className="nav-form">
				<Link to='/dashboard'><li>Create Quiz</li></Link>
				<Link to='/create-question'><li>Create Question</li></Link>
				<Link to='/create-answers'><li>Create Answers</li></Link>
				<Link to='/view-quiz'><li>View Quizzes</li></Link>
				<Link to='/my-account'><li>My Account</li></Link>
			</ul>
			<button className="logout-btn" onClick={logout}>Log out</button>
		</div>
	);
};

export default SideNav;
