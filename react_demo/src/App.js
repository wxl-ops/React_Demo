import logo from './logo.svg';
import {Button} from 'antd'
import './App.css';
import Login from './pages/Login/Login';
import {Route,Routes} from 'react-router-dom'

function App() {
  return ( 
  <div className = "App" >
    <Routes >
      <Route path='/login' element = {<Login/>}/>
      <Route path = '/' element = {<Navigator to = "/login"/>}/> 
    </Routes> 
    </div >
  );
}

export default App;