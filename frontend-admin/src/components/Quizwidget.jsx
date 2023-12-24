import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/quizwidget.css';


// Over here we need to get data from the backend and display it in the template
const Quizwidget = ({name, author, numberOfQuestions, description, slug}) => {
  return (
    <Link className='rm-default' to={`/view-quiz/${slug}`}>
      <div className='wg-outer-pm wg-dimensions'>
          <div className='wg-dimensions widget-traits widget-inner-pm'>
              <h1>{name}</h1>
              {/* {Description} */}
              <div className='wg-text-format'>
                  <h6>{description}</h6>
                  <div>
                      <p>By: {author}</p>
                      <p>{numberOfQuestions} questions to answer</p>
                  </div>
              </div>
          </div>
      </div>
    </Link>
  )
}

export default Quizwidget