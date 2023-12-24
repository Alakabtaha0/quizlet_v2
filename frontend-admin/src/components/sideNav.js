import React from "react";
import {Link} from 'react-router-dom';
import '../styles/sideNav.css';


const SideNav = () => {
  return (
    <div className="side-nav">
      <ul className="nav-form">
        <Link to='/dashboard'><li>Create Quiz</li></Link>
        <Link to='/create-question'><li>Create Question</li></Link>
        <Link to='/create-answers'><li>Create Answers</li></Link>
        <Link to='/view-quiz'><li>View Quizzes</li></Link>
        <Link to='/my-account'><li>My Account</li></Link>
      </ul>
    </div>
  );
};

export default SideNav;
