import './App.css';
import React from 'react';
import ReactDOM from "react-dom";
import {Spring} from 'react-spring'
import { useSpring, animated  } from 'react-spring';
import he from 'he';
import * as Realm from "realm-web";



const REALM_APP_ID = "tasktracker-wklbx"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });

const { useState, useEffect, Fragment } = React


const useFetchQuestions = () => {
	

  const [ questions, setQuestions ] = useState(null)
  const [ loading, setLoading ] = useState(true)
  const [user, setUser] = React.useState(app.currentUser);
  const loginAnonymous = async () => {
	  
	  if (user==null) {	
		  const user = await app.logIn(Realm.Credentials.anonymous());
		  console.log("Logged in with anonymous id: {user.id}");
		  setUser(user);
		  setNewQuestions();
	  }
  };
  
   
  const setNewQuestions = async() => {
	  if (app.currentUser!=null) {
			const mongodb = app.currentUser.mongoClient("mongodb-atlas");
			const flashcardsCollection = mongodb.db("tracker").collection("Flashcard");
			const allFlashcards =  await flashcardsCollection.find();
			setQuestions(allFlashcards)
			setLoading(false)
	  }  
  }
  
  const setMongoQuestions = async() => {
	  setNewQuestions();
  }
  
  const formatQuestions = (rawQuestions) => {
    let formattedQuestions = []
    for (let i = 0; i < rawQuestions.length; i++) {
      formattedQuestions.push({
        ...rawQuestions[i]
      })
    }
	console.log(formattedQuestions);
    return formattedQuestions
  }
  
  useEffect(() => {
    loginAnonymous()  
  }, [])
  
  useEffect(() => {
    setNewQuestions()  
  }, [])
  
  return { questions, loading, setNewQuestions, setMongoQuestions }
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
  
  const [user, setUser] = React.useState(app.currentUser);

  const { questions, loading, setNewQuestions, setMongoQuestions } = useFetchQuestions()
  
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
              onClick={setMongoQuestions}
             >
              <div className="flip reset">
                <i className="fas fa-sync"></i>
                Done
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