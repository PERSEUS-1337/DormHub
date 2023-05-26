import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Accommodation from './pages/accommodation';
import Login from './pages/login';
import Signup from './pages/signup';
import UserPage from './pages/userpage';
import HomePage from './pages/homepage';
import NavBar from './components/Navbar'

function App() {
  return (
    <div className='App'>
      <NavBar />
      <Router>
        <Routes>
          <Route exact={true} path='/accommodation' element={<Accommodation />} />
          <Route exact={true} path='/' element={<HomePage/>} />
          <Route exact={true} path='/login' element={<Login/>} />
          <Route exact={true} path='/signup' element={<Signup/>} />
          <Route exact={true} path='/user' element={<UserPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
