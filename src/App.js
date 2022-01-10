import './App.css';
import React from 'react';
import ReactDOM from "react-dom";
import {Spring} from 'react-spring'
import { useSpring, animated  } from 'react-spring';
import he from 'he';

const { useState, useEffect, Fragment } = React
//const { useSpring, animated } = ReactSpringHooks
//import { useSpring, animated } from "react-spring/hooks.cjs";

const useFetchQuestions = () => {
  const [ questions, setQuestions ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const setNewQuestions = async() => {
    const response = await fetch("https://opentdb.com/api.php?amount=9&difficulty=easy")
    const data = await response.json()
    const formattedQuestions = formatQuestions(data.results)
    setQuestions(formattedQuestions)
    setLoading(false)
  }
  
  const formatQuestions = (rawQuestions) => {
    let formattedQuestions = []
    for (let i = 0; i < rawQuestions.length; i++) {
      formattedQuestions.push({
        ...rawQuestions[i],
        choices: [
          ...rawQuestions[i].incorrect_answers, rawQuestions[i].correct_answer
        ].reduce((a,v)=>a.splice(Math.floor(Math.random() * a.length), 0, v) && a, [])
      })
    }
    return formattedQuestions
  }
  
  useEffect(() => {
    setNewQuestions()  
  }, [])
  
  return { questions, loading, setNewQuestions }
}

const Card = ({
  question, id, trans, index
}) => {
  const [ showBack, set ] = useState(false)
  
  const { opacity, transform } = useSpring({
    opacity: showBack ? 1 : 0,
    transform: `perspective(1000px) rotate${trans}(${showBack ? 180 : 0}deg)`,
    config: { mass: 10, tension: 500, friction: 80 },
  })
  
  useEffect(() => {
    const showBack = () => set(true)
    const hideBack = () => set(false)
    const el = document.querySelector(`#${id}`)
    el.addEventListener('mouseenter', showBack)
    el.addEventListener('mouseleave', hideBack)
    return () => {
      el.removeEventListener('mouseenter', showBack)
      el.removeEventListener('mouseleave', hideBack)
    }
  }, [])
  
  
  return (
    <div id={id} className="Card">
      <animated.div 
        className={`flip front color-${index}`} 
        style={{
          opacity: opacity.interpolate(o => 1 - o),
          transform
          }}
        >
        <div className="question">
          {he.decode(question.question)}
        </div>
        <ul className="choices">
          {question.choices.map(choice => (
             <li>{he.decode(choice)}</li> 
          ))}
        </ul>
      </animated.div>  
      <animated.div 
        className={`flip back color-${index}`}
        style={{
          opacity,
          transform: transform.interpolate(
            t => `${t} rotate${trans}(180deg)`
          )
        }}
       >
        {he.decode(question.correct_answer)}
      </animated.div>
    </div>
  )
}

const App = () => {
  const { questions, loading, setNewQuestions } = useFetchQuestions()
  
  return (
    <div className="Cards">
      <div className="CardsWrapper">
        {loading && <div className="loader">Loading</div>}
        {questions &&
          <Fragment>
            {questions.map((question, index) =>
             <Card 
               key={index}
               question={question}
               id={`card${index}`}
               trans={index % 2 === 0 ? "X" : "Y"}
               index={index}
              />  
            )}
            <div
              className="Card"
              role="button"
              onClick={setNewQuestions}
             >
              <div className="flip reset">
                <i class="fas fa-sync"></i>
                Get New Questions
              </div>
            </div>
          </Fragment>
         }
      </div>  
    </div> 
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;