// NavBar Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Toolbar, Typography, Button } from '@mui/material';


// Components & Necessary Files 


// NavBar Component 
function NavBar({ isLoggedIn, handleLogout, clearSearchResults, userProfile }) {

    const navigate = useNavigate();
    const handleLogoutClick = () => {
        handleLogout();
        navigate( '/' );
    }

    const handleHomeClick = () => {
        clearSearchResults();
        navigate( '/' )
    };

    return(
        <div className = 'navbar-container'> 
            <AppBar sx = {{ backgroundColor: '#212121' }}> 
                <Box sx = {{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px',
                    padding: '4px'
                    }}>

                    <Typography 
                    component = { Link } 
                    to = '/' 
                    color = 'white'
                    sx = {{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}
                    onClick = { handleHomeClick }
                    > 
                    Home </Typography>

                    <Typography 
                    component = { Link } 
                    to = '/search' 
                    color = 'white'
                    sx = {{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}>
                    Search </Typography>

                    { isLoggedIn ? (
                    <>
                    <Typography
                    component = { Link }
                    to = '/users/profile'
                    color = 'white'
                    sx = {{
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}> 
                    Profile </Typography>

                    <Typography 
                    component = { Link } 
                    to = '/users/bookmark' 
                    color = 'white'
                    sx = {{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}> 
                    Bookmarks </Typography>

                    <Typography
                    component = { Link }
                    to = '/login'
                    color = 'white'
                    sx = {{
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}
                    onClick = { handleLogoutClick }
                    > 
                    Logout </Typography>
                    </>
                    ) : (
                        <>
                    <Typography 
                    component = { Link } 
                    to = '/users/login' 
                    color = 'white'
                    sx = {{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}>
                    Login </Typography>

                    <Typography 
                    component = { Link } 
                    to = '/users/create' 
                    color = 'white'
                    sx = {{ 
                        color: 'white', 
                        textDecoration: 'none',
                        fontSize: '1.8rem', 
                        '&:hover': {
                            color: 'black',
                            backgroundColor: '#006064',
                            borderRadius: '3px'
                        },
                    }}>
                    Create </Typography>
                </>
                )}

                { userProfile && userProfile.image_url && (
                        <Avatar
                        src = { userProfile.image_url || '' }
                        alt = { userProfile.username }
                        />
                    )}
                </Box>
            </AppBar>
            </div>
        )
        
    }
    
    export default NavBar;