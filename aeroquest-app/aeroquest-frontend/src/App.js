// AeroQuest Application 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Switch, useNavigate, withRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import apiClient from './apiClient';


// Components & Necessary Files 
import Bookmark from './Bookmark';
import CreateUser from './CreateUser';
import Home from './Home';
import Login from './Login';
import NavBar from './NavBar';
import Search from './Search';
import Profile from './Profile';
import './static/css/app.css';



function App() {

  const [ isLoggedIn, setIsLoggedIn ] = useState( false );
  const [ userProfile, setUserProfile ] = useState( null );
  const [ decodedToken, setDecodedToken ] = useState( null );
  const [ searchResults, setSearchResults ] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setDecodedToken(decodedToken);
      setIsLoggedIn(true);
      fetchUserProfile(token);
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await apiClient.get(`/user/profile/${decodedToken.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserProfile(null);
  }

  const clearSearchResults = () => {
    setSearchResults([]);
  }
  
  return (
    <div className = 'application-container'>
      <BrowserRouter>
        <NavBar  
        isLoggedIn = { isLoggedIn } 
        handleLogout = { handleLogout } 
        clearSearchResults = { clearSearchResults }
        userProfile = { userProfile }
        />
          <Routes> 
            <Route path = '/' element = { <Home /> } />
            <Route path = '/search' element = { <Search /> } /> 
            { isLoggedIn ? (
              <>
                <Route path = '/user/profile' element = { <Profile /> } />
                <Route path = '/user/bookmark' element = { <Bookmark /> } /> 
              </>
            ):(
              <>
                <Route path = '/user/login' element = { <Login  setIsLoggedIn = { setIsLoggedIn } setUserProfile = { setUserProfile } /> } /> 
                <Route path = '/user/create' element = { <CreateUser /> } />
              </>
            )}
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
