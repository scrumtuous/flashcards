import React from 'react'
import Cart from './Cart'

export default function QuestionsList({questions}) {
    
    const cart = questions.map((question, index) => (
    <Cart key={index} question={question}  id={`card${index}`} trans={index % 2 === 0 ? "X" : "Y"} index={index} />
    ))

  return <>{cart}</>

}