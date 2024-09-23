import { Route, Routes } from 'react-router-dom'
import './App.css'
import Chats from './Pages/Chats'
import Home from './Pages/Home'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  return (
    <div style={{backgroundColor:"#bde0fe"}} className='App'>
     <Routes>
      <Route path={"/"} element={<Home/>} />
      <Route path={"/chats"} element={<Chats/>} />
     </Routes>
     <ToastContainer />
    </div>
  )
}

export default App
