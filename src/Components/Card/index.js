 import {React,useState,useEffect} from 'react'
 import useFetchQuestions from '../../Utils/questions/index'
 import QuestionsList from './questionsList'

 
 export default function Index() {
    const { questions, loading, setNewQuestions, setMongoQuestions } = useFetchQuestions()
   return (
     <div className="Cards">
      <div className="CardsWrapper">
        {loading && <div className="loader">Loading</div>}
        {questions &&
          <QuestionsList questions={questions} />
         }
      </div>  
    </div> 
   
   )
 }
 