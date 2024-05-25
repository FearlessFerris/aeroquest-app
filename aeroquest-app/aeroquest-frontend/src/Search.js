// SearchPage Component Implementation


// Dependencies 
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Router, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';


// Components & Necessary Files 
import SearchBar from './SearchBar';


// Homepage Component 
function Search() {

    const navigate = useNavigate();
    const location = useLocation();
    const message = location.state?.message;
    const [ searchResults, setSearchResults ] = useState([]);

    const clearSearchResults = () => {
        setSearchResults([]);
    }

    return(
        <div>
            <SearchBar searchResults = { searchResults } setSearchResults = { setSearchResults }/>
        </div>
    )
}

export default Search;
