import {React,useState,useEffect} from 'react'
import { useSpring, animated  } from 'react-spring';
import he from 'he';


export default function Cart({
   id,trans,index,question,
  }){
    console.log(question)
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
