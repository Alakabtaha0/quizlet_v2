import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './styles/global.css';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import SideNav from './components/sideNav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateQuestion from './pages/createQuestion';
import CreateAnswers from './pages/createAnswers';
import ViewQuiz from './pages/viewQuiz';
import MyAccount from './pages/myAccount';
import Form from './pages/Form';
import SignUp from './pages/signup';

function App() {
	const [data, setData] = useState([]);
	const [update, setUpdate] = useState(false);
	const jwt = Cookies.get('jwt');

	return (
		<Router>
			<div className="set-page">
				{jwt && <SideNav />}
					<Routes>
						<Route path='' element={<Login setUpdate={setUpdate}/>} />
						{!jwt && <Route path='/login' element={<Login setUpdate={setUpdate}/>} />}
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/create-question' element={<CreateQuestion />} />
						<Route path='/create-answers' element={<CreateAnswers />} />
						<Route path='/view-quiz' element={<ViewQuiz quiz={data} setData={setData} />} />
						<Route path='/my-account' element={<MyAccount />} />
						{!localStorage.getItem('userID') && <Route path='/sign-up' element={<SignUp />} />}
						{data && data.map((quiz, index) => {
							return (
								<Route path={`/view-quiz/${quiz.slug}`} element={<Form quiz={quiz} />} />
							)
						})}
						<Route path='*' element={<Dashboard />}/>
					</Routes>
			</div>
		</Router>

	);
}

export default App;
