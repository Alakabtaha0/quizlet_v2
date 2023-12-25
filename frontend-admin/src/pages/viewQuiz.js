import React, {useEffect} from "react";
import axios from "axios";
import '../styles/viewquiz.css';
import Quizwidget from '../components/Quizwidget';
import Cookies from "js-cookie";



const ViewQuiz = ({quiz, setData}) => {
	const jwt = Cookies.get('jwt');
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await axios.get(`https://quizlet-01.nw.r.appspot.com//api/v1/quiz`, {
					headers: {
						Authorization: `Bearer ${jwt}`
					}
				});
				setData(res.data.quiz);
			} catch (err) {
				if (err.response.status === 401) {
                    localStorage.removeItem('userID');
                    Cookies.remove('jwt');
                    window.location.href = '/login';
                }
			}
		};
		if (jwt) {
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [jwt]);

	if (!quiz) {
		console.log('here');
		return (
			<div className='set-scroll page-view'>
				<h1>View All Quiz</h1>
				<p>No Quiz Found, try creating one</p>
			</div>
		)
	} 

    return (
		<div className='set-scroll page-view'>
            <h1>View All Quiz</h1>
			{	
					quiz && quiz.map((quiz, index) => {
						return (
							<Quizwidget
								key={index}
								name={quiz.name}
								author={quiz.author}
								numberOfQuestions={quiz.numberOfQuestions}
								description={quiz.description}
								slug={quiz.slug}
							/>
						)
					})
			}
		</div>
	)
};

export default ViewQuiz;
