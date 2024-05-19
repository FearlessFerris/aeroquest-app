// AeroQuest Application 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Switch, withRouter } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';


// Components & Necessary Files 
import Bookmark from './Bookmark';
import CreateUser from './CreateUser';
import Home from './Home';
import Login from './Login';
import NavBar from './NavBar';
import Profile from './Profile';
import './static/css/app.css';



function App({ history }) {

  const [ isLoggedIn, setIsLoggedIn ] = useState( false );
  const [ userProfile, setUserProfile ] = useState( null );
  const [ decodedToken, setDecodedToken ] = useState( null );
  const [ searchResults, setSearchResults ] = useState([]);
  
  useEffect( () => {
    const token = localStorage.getItem( 'token' );
    if( token ){
      const decodedToken = jwtDecode( token );
      setDecodedToken( decodedToken );
      setIsLoggedIn( true );
      fetchUserProfile( token );
    }
    else{
      setIsLoggedIn( false );
      setUserProfile( null )
    }
  }, []);

  const fetchUserProfile = async ( token ) => {
    try {
      const response = await axios.get( `/users/profile/${ decodedToken.id }`, {
        headers: { Authorization: `Bearer ${ token }` },
      });
      setUserProfile( response.data.data ); 
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem( 'token' );
    setIsLoggedIn( false );
    setUserProfile( null );
    history.push( '/' );
  }

  const clearSearchResults = () => {
    console.log( 'Clearing Search Results' )
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
            <Route path = '/users/profile' element = { <Profile /> } />
            <Route path = '/users/login' element = { <Login  setIsLoggedIn = { setIsLoggedIn } setUserProfile = { setUserProfile } /> } /> 
            <Route path = '/users/create' element = { <CreateUser /> } />
            <Route path = '/users/bookmark' element = { <Bookmark /> } /> 
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
