import './Styles/App.css';
import {React,useState,Fragment} from 'react';
import ReactDOM from "react-dom";
import Index from './Components/Card';

const App = () => {
  
  // const [user, setUser] = useState(app.currentUser);  
  return (
   <>
   <Index/>
   </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

export default App;