import {React,useState,useEffect} from 'react';
import * as Realm from "realm-web";


const el = document.getElementById('app');
const REALM_APP_ID = "tasktracker-wklbx"; // e.g. myapp-abcde
const app = new Realm.App({ id: REALM_APP_ID });


const useFetchQuestions = () => {
	

    const [ questions, setQuestions ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [user, setUser] = useState(app.currentUser);
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
              console.log("It is: " + el.getAttribute('data-param'));
              var message = el.getAttribute('data-param');
              
              
              
              //const allFlashcards =  await flashcardsCollection.find();
              const allFlashcards =  await flashcardsCollection.find(JSON.parse(message));
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

  export default useFetchQuestions;
  
