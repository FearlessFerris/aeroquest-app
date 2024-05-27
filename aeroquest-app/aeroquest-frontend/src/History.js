// History Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Typography } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode';
import { Bookmarks } from '@mui/icons-material';


// Components & Necessary Files 


// History Component 
function History(){

    const [ searches, setSearches ] = useState([]);
    const [ visableSearches, setVisableSearches ] = useState([]);
    const [ loading, setLoading ] = useState( true );

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                console.log( decoded );
                return { userId: decoded.id, token };
            } catch (error) {
                console.error('Invalid token:', error);
                return { userId: null, token: null };
            }
        }
        return { userId: null, token: null };
    };

    useEffect( () => {
        const fetchHistory = async () => {
            try{
                const { userId, token } = getUserId();
                console.log( userId, token );
                const response = await apiClient.get( `/search/history/${ userId }`, {
                    headers: {
                        Authorization: `Bearer ${ token }`
                    }
                });
                setSearches( response.data.searches );
                setLoading( false );
            }
            catch( error ){
                console.error( 'Error fetching user history!', error.message );
            }
        }
        fetchHistory();
    }, [])

    useEffect( () => {
        if ( !loading && searches.length > 0 ){
            searches.forEach(( _, index ) => {
                setTimeout( () => {
                    setVisableSearches(( prevVisible ) => [ ...prevVisible, index ]);
                }, index * 500 );
            });
        }
    }, [ loading, searches ]);

    console.log( searches );

    return(
        <div 
            className = 'history-container'
            style = {{ 
                margin: '6rem'
            }}
        >
            <Card
                sx={{
                    alignItems: 'center',
                    backgroundColor: '#212121',
                    border: '.2rem solid white',
                    borderRadius: '1rem',
                    color: 'cyan',
                    fontSize: 'xx-large',
                    fontWeight: 'bold',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    width: '38rem',
                    height: '5rem',
                    margin: '2rem',
                    textAlign: 'center'
                }}
            >
            <span style={{
                    display: 'flex',
                    margin: '.3rem',
                    fontSize: '2rem',
                    color: 'white '
                }}
                >
                <HistoryIcon fontSize = 'large'></HistoryIcon>
            </span>
            History 
            </Card>
            { loading? (
                <Typography variant="h6" style={{ color: 'cyan', textAlign: 'center' }}>
                Loading history...
            </Typography>
            ):(
                searches.map(( item, index ) => (
                    <Fade in = { true } timeout = { 1000 } key = { index }>
                        { item.search_term && (
                            <Card
                            key={index}
                            sx={{
                                alignItems: 'center',
                                backgroundColor: '#212121',
                                border: '.2rem solid white',
                                borderRadius: '1rem',
                                color: 'cyan',
                                fontSize: 'xx-large',
                                fontWeight: 'bold',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                width: '38rem',
                                minHeight: '8rem',
                                margin: 'auto',
                                marginBottom: '1rem',
                                textAlign: 'center'
                            }}
                            >   
                            <CardContent>
                                <div 
                                    variant = 'h6'
                                    style = {{ 
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                <Typography
                                    variant = 'h6'
                                    style = {{
                                        color: 'white',
                                        marginRight: '1rem'
                                    }}
                                >
                                    Search Term:  
                                </Typography>
                                <Typography
                                    variant = 'h6'
                                    style = {{
                                        color: 'cyan'
                                    }}
                                >
                                    { item.search_term  }
                                </Typography>
                                </div>
                                <div 
                                    variant = 'h6'
                                    style = {{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography 
                                        variant = 'h6'
                                        style = {{
                                            color: 'white',
                                            marginRight: '1rem'
                                        }}
                                    >
                                        Search Timestamp:
                                    </Typography>
                                    <Typography
                                        variant = 'h6'
                                        style = {{
                                            color: 'cyan'
                                        }}
                                    >
                                        { item.search_timestamp }
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    )}       
                </Fade>
                ))
            )}
        </div>
    )
}

export default History;
