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
    const [ visibleSearches, setVisibleSearches ] = useState([]);
    const [ loading, setLoading ] = useState( true );
    const [ removingItemId, setRemovingItemId ] = useState( null );

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
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
    }, []);

    useEffect( () => {
        if ( !loading && searches.length > 0 ){
            searches.forEach(( item, index ) => {
                setTimeout( () => {
                    setVisibleSearches(( prevVisible ) => [ ...prevVisible, item.id ] );
                }, index * 500 );
            });
        }
    }, [ loading, searches ]);

    const handleRemoveHistoryItem = async (searchId) => {
        try {
            const { userId, token } = getUserId();
            const response = await apiClient.delete(`/search/remove`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                data: { userId, searchId },
            });
            if (response.status === 200) {
                setRemovingItemId(searchId);
                setTimeout(() => {
                    setSearches((prevSearches) => prevSearches.filter(item => item.id !== searchId));
                    setVisibleSearches((prevVisible) => prevVisible.filter(id => id !== searchId));
                    setRemovingItemId(null);
                }, 1000);
            } else {
                console.error('Failed to remove search item!');
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                    marginBottom: '2rem',
                    textAlign: 'center',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-1rem)',
                        boxShadow: '0 .5rem .8rem rgba(0, 0, 0, 0.2)',
                    }
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
                    <Fade in = {visibleSearches.includes( item.id ) && removingItemId !== item.id } timeout = {{ enter: 1000, exit: 1000 }} key = { index }>
                        <div 
                            style={{ 
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                            }}
                        >
                        { item.search_term && (
                            <Card
                            key = { item.id }
                            sx = {{
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
                                minHeight: '4rem',
                                margin: 'auto',
                                marginBottom: '2rem',
                                textAlign: 'center',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-1rem)',
                                    boxShadow: '0 .5rem .8rem rgba(0, 0, 0, 0.2)',
                                }
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
                                <div 
                                    variant = 'h6'
                                    style = {{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Button 
                                        variant = 'outlined'
                                        color = 'info'
                                        sx = {{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            marginTop: '1vh',
                                            marginBottom: '1vh',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }} 
                                        onClick = { () => handleRemoveHistoryItem( item.id, index ) }
                                    >
                                    Remove 
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}       
                </div>
                </Fade>
                ))
            )}
        </div>
    )
}

export default History;
