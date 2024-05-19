// Bookmark Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react'
import { Button, Card, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fade, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


// Components & Necessary Files 


// Bookmark Component 
function Bookmark() {

    const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [visibleBookmarks, setVisibleBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [itemInfo, setItemInfo] = useState({
        toggleSuccessMessage: false,
        toggleErrorMessage: false,
        successMessage: '',
        errorMessage: '',
        actionType: '',
        chosenItem: null,
        toggleNotes: false,
        notes: ''
    });

    const getUserId = () => {
        const token = localStorage.getItem('token');
        const userId = jwtDecode(token).id;
        return { userId, token };
    }

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const { userId, token } = getUserId();
                const response = await axios.get(`/bookmark/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setBookmarks(response.data.bookmarks);
                setLoading(false);
            }
            catch (error) {
                console.error(`Error fetching bookmarks`, error);
                setLoading(false);
            }
        }
        fetchBookmarks();
    }, []);

    useEffect(() => {
        if (!loading && bookmarks.length > 0) {
            bookmarks.forEach((_, index) => {
                setTimeout(() => {
                    setVisibleBookmarks((prevVisible) => [...prevVisible, index]);
                }, index * 300);
            });
        }
    }, [loading, bookmarks]);

    const displayFullDetails = (index) => {
        setSelectedBoxIndex((previousIndex) => (
            previousIndex === index ? null : index
        ));
    };

    const handleEditNotes = (item) => {
        setItemInfo({
            chosenItem: item,
            toggleNotes: true,
            notes: item.notes || ''
        });
    };

    const handleSaveNotes = async () => {
        try {
            const { userId, token } = getUserId();
            const { chosenItem, notes } = itemInfo;
            const response = await axios.put(`/bookmark/modify/${chosenItem.id}`,
                { notes },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

            setBookmarks((prevBookmarks) =>
                prevBookmarks.map((bookmark) => {
                    return bookmark.id === chosenItem.id ? { ...bookmark, notes } : bookmark;
                })
            );
            handleSuccessMessage('Notes were updated successfully!!!', 'updated_notes')
            handleCloseNotes();
        } catch (error) {
            handleErrorMessage('Error updating bookmark notes!', 'updated_notes')
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const handleDeleteBookmark = async (bookmarkId) => {
        try {
            const { userId, token } = getUserId();
            await axios.delete(`/bookmark/remove/${bookmarkId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookmarks((prevBookmarks) =>
                prevBookmarks.filter((bookmark) => bookmark.id !== bookmarkId)
            );
            handleSuccessMessage('Bookmark was deleted successfully!', 'delete');
        } catch (error) {
            handleErrorMessage('Error deleting the bookmark!', 'delete');
            console.error(error.response ? error.response.data : error.message);
        }
    };

    const handleSuccessMessage = (message, actionType) => {
        setItemInfo({
            ...itemInfo,
            toggleSuccessMessage: true,
            successMessage: message,
            actionType: actionType
        });
    };

    const handleErrorMessage = (message, actionType) => {
        setItemInfo({
            ...itemInfo,
            toggleErrorMessage: true,
            errorMessage: message,
            actionType: actionType
        });
    };

    const handleCloseNotes = () => {
        setItemInfo((previousInfo) => ({
            ...previousInfo,
            toggleNotes: false,
            notes: ''
        }));
    }

    return (
        <div
            className="bookmark-container"
            style={{
                margin: '6rem',
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
                    <BookmarksIcon fontSize='large'></BookmarksIcon>
                </span>
                Bookmarks
            </Card>
            {loading ? (
                <Typography variant="h6" style={{ color: 'cyan', textAlign: 'center' }}>
                    Loading bookmarks...
                </Typography>
            ) : (
                bookmarks.map((item, index) => (
                    <Fade in={visibleBookmarks.includes(index)} timeout={1000} key={index}>
                        {item.response_data.model_name ? (
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
                                    height: selectedBoxIndex === index ? 'auto' : '11rem',
                                    margin: 'auto',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                <CardContent>
                                    <div
                                        variant='h6'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Aircraft Model:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.model_name}
                                        </Typography>
                                    </div>
                                    <div
                                        variant='h6'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Item ID:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.id}
                                        </Typography>
                                    </div>
                                    {selectedBoxIndex === index && (
                                        <>
                                            <div
                                                variant='h6'
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Plane Age:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.plane_age}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Plane Series:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.plane_series}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Plane Status:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.plane_status}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.engines_count && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Engines Count:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.engines_count}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.engines_type && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Engines Type:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.engines_type}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Construction Number:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.construction_number}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Regristration Number:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.registration_number}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Production Line:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.production_line}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    sx={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Delivery Date:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    sx={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.delivery_date}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    First Flight Date:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.first_flight_date}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.plane_owner && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Plane Owner:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.plane_owner}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.notes && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Notes:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.notes}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}


                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => displayFullDetails(index)}
                                    >
                                        {selectedBoxIndex === index ? 'Hide Details' : 'Show Details'}
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            margin: '1rem',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleEditNotes(item)}
                                    >
                                        Edit Notes
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleDeleteBookmark(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : item.response_data.airline_name ? (
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
                                    height: selectedBoxIndex === index ? 'auto' : '11rem',
                                    margin: 'auto',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                <CardContent>
                                    <div
                                        variant='h6'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Airline Name:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.airline_name}
                                        </Typography>
                                    </div>
                                    <div
                                        variant='h6'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Airline ID:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.airline_id}
                                        </Typography>
                                    </div>
                                    {selectedBoxIndex === index && (
                                        <>
                                            <div
                                                variant='h6'
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    ICAO Code:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.icao_code}
                                                </Typography>
                                            </div>
                                            <div
                                                variant='h6'
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.iata_code && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            IATA Code:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.iata_code}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.status && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Status:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.status}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.callsign && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Callsign:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.callsign}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.fleet_average_age && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Fleet Average Age:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.fleet_average_age}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.country_name && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Country Name:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.country_name}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.notes && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Notes:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.notes}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => displayFullDetails(index)}
                                    >
                                        {selectedBoxIndex === index ? 'Hide Details' : 'Show Details'}
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            margin: '1rem',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleEditNotes(item)}
                                    >
                                        Edit Notes
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleDeleteBookmark(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : item.response_data.airport_name ? (
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
                                    height: selectedBoxIndex === index ? 'auto' : '11rem',
                                    margin: 'auto',
                                    marginBottom: '1rem',
                                    textAlign: 'center'
                                }}
                            >
                                <CardContent>
                                    <div
                                        variant='h6'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            Airport Name:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.airport_name}
                                        </Typography>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'white',
                                                marginRight: '1rem'
                                            }}
                                        >
                                            AirportID:
                                        </Typography>
                                        <Typography
                                            variant='h6'
                                            style={{
                                                color: 'cyan'
                                            }}
                                        >
                                            {item.response_data.id}
                                        </Typography>
                                    </div>
                                    {selectedBoxIndex === index && (
                                        <>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography
                                                    variant='h6'
                                                    style={{
                                                        color: 'white',
                                                        marginRight: '1rem'
                                                    }}
                                                >
                                                    Country ISO:
                                                </Typography>
                                                <Typography
                                                    variant='h6'
                                                    sx={{
                                                        color: 'cyan'
                                                    }}
                                                >
                                                    {item.response_data.country_iso2}
                                                </Typography>
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.city_iata_code && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            City Iata Code:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.city_iata_code}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.geoname_id && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Geoname ID:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.geoname_id}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.latitude && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Latitude:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.latitude}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.longitude && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Longitude:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.longitude}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.country_name && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Country Name:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.country_name}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.response_data.timezone && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Timezone:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            sx={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.response_data.timezone}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {item.notes && (
                                                    <>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'white',
                                                                marginRight: '1rem'
                                                            }}
                                                        >
                                                            Notes:
                                                        </Typography>
                                                        <Typography
                                                            variant='h6'
                                                            style={{
                                                                color: 'cyan'
                                                            }}
                                                        >
                                                            {item.notes}
                                                        </Typography>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => displayFullDetails(index)}
                                    >
                                        {selectedBoxIndex === index ? 'Hide Details' : 'Show Details'}
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            margin: '1rem',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleEditNotes(item)}
                                    >
                                        Edit Notes
                                    </Button>
                                    <Button
                                        type='submit'
                                        variant='outlined'
                                        color='primary'
                                        component='span'
                                        sx={{
                                            color: 'cyan',
                                            borderColor: 'cyan',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                color: '#212121',
                                                borderColor: 'white',
                                                backgroundColor: 'cyan',
                                                fontWeight: 'bold'
                                            },
                                        }}
                                        onClick={() => handleDeleteBookmark(item.id)}
                                    >
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : null}
                    </Fade>
                ))
            )}


            <Dialog
                open={itemInfo.toggleNotes}
                onClose={handleCloseNotes}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle
                    style={{
                        backgroundColor: '#212121',
                        border: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        fontSize: 'xx-large',
                        justifyContent: 'center',
                    }}
                >
                    Edit Note
                </DialogTitle>
                <DialogContent
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        color: 'white',
                    }}
                >
                    <DialogContentText
                        style={{
                            backgroundColor: '#212121',
                            color: 'cyan',
                            display: 'flex',
                            fontSize: 'x-large',
                            justifyContent: 'center',
                        }}
                    >

                        Edit Note
                        {itemInfo.chosenItem?.response_data?.model_name ? (
                            ` for ${itemInfo.chosenItem.response_data.model_name}`
                        ) : itemInfo.chosenItem?.response_data?.airline_name ? (
                            ` for ${itemInfo.chosenItem.response_data.airline_name}`
                        ) : itemInfo.chosenItem?.response_data?.airport_name ? (
                            ` for ${itemInfo.chosenItem.response_data.airport_name}`
                        ) : null}

                    </DialogContentText>
                    <textarea
                        rows='5'
                        cols='75'
                        placeholder="Enter your notes here..."
                        value={itemInfo.notes}
                        onChange={(e) => setItemInfo((prevInfo) => ({ ...prevInfo, notes: e.target.value }))}
                        style={{
                            backgroundColor: '#212121',
                            color: 'cyan',
                            fontSize: 'x-large',
                            resize: 'none'
                        }}
                    />
                </DialogContent>
                <DialogActions
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        borderBottom: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        onClick={handleCloseNotes}
                        color="primary"
                        type='submit'
                        variant='outlined'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveNotes}
                        variant="outlined"
                        color="primary"
                        type='submit'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Save Note
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={itemInfo.toggleSuccessMessage}
                onClose={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleSuccessMessage: false }))}
                fullWidth
                maxWidth='md'
                style={{
                }}
            >
                <DialogTitle
                    style={{
                        backgroundColor: '#212121',
                        border: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        fontSize: 'xx-large',
                        justifyContent: 'center',
                    }}
                >
                    {itemInfo.actionType === 'added' ? 'Bookmark Added' : 'Bookmark Updated'}
                </DialogTitle>
                <DialogContent
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        color: 'white',
                    }}
                >
                    <DialogContentText
                        style={{
                            backgroundColor: '#212121',
                            color: 'cyan',
                            display: 'flex',
                            fontSize: 'x-large',
                            justifyContent: 'center',
                        }}
                    >
                        {itemInfo.successMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        borderBottom: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        onClick={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleSuccessMessage: false }))}
                        color="primary"
                        type='submit'
                        variant='outlined'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Undo
                    </Button>
                    <Button
                        onClick={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleSuccessMessage: false }))}
                        color="primary"
                        type='submit'
                        variant='outlined'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={itemInfo.toggleErrorMessage}
                onClose={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleErrorMessage: false }))}
                fullWidth
                maxWidth='md'
            >
                <DialogTitle
                    style={{
                        backgroundColor: '#212121',
                        border: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        fontSize: 'xx-large',
                        justifyContent: 'center',
                    }}
                >
                    {`Bookmark Exists`}
                </DialogTitle>
                <DialogContent
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        color: 'white',
                    }}
                >
                    <DialogContentText
                        style={{
                            backgroundColor: '#212121',
                            color: 'cyan',
                            display: 'flex',
                            fontSize: 'x-large',
                            justifyContent: 'center',
                        }}
                    >
                        {itemInfo.errorMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions
                    style={{
                        backgroundColor: '#212121',
                        borderLeft: '.2rem solid white',
                        borderRight: '.2rem solid white',
                        borderBottom: '.2rem solid white',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        onClick={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleErrorMessage: false }))}
                        color="primary"
                        type='submit'
                        variant='outlined'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Undo
                    </Button>
                    <Button
                        onClick={() => setItemInfo((prevInfo) => ({ ...prevInfo, toggleErrorMessage: false }))}
                        color="primary"
                        type='submit'
                        variant='outlined'
                        component='span'
                        sx={{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

    )
}
export default Bookmark;


