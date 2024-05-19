// Homepage Component Implementation


// Dependencies 
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Router, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';


// Components & Necessary Files 
import SearchBar from './SearchBar';


// Homepage Component 
function Home() {

    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;
    const [ searchResults, setSearchResults ] = useState([]);

    const clearSearchResults = () => {
        setSearchResults([]);
    }

    return(
        <div className = 'homepage-container'>
        {message && (
                <div className = 'message-container'
                    style = {{ 
                        display: 'flex',
                        marginTop: '6rem',
                        justifyContent: 'center'
                }}
                >
                    <Typography
                        variant = 'h5'
                        style = {{
                            color: 'white',
                            textAlign: 'center'
                        }}
                    >
                    { message }    
                    </Typography>
                </div>
            )}
            <SearchBar searchResults = { searchResults } setSearchResults = { setSearchResults }/>
        </div>
    )
}

export default Home;
