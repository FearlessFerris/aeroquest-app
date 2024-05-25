// Airplanes Information Block Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { AirplanemodeActive } from '@mui/icons-material';
import apiClient from './apiClient';
import { jwtDecode } from 'jwt-decode';


// Components & Necessary Files
const AIRPLANES_ENDPOINT_BASE = 'http://api.aviationstack.com/v1/airplanes';


// Airplanes Information Component  
function AirplanesInformationBlock({ data }) {

    const [selectedBoxIndex, setSelectedBoxIndex] = useState(null);
    const [bookmarks, setBookmarks] = useState([]);
    const [itemInfo, setItemInfo] = useState({
        toggleSuccessMessage: false,
        toggleErrorMessage: false,
        toggleNotes: false,
        successMessage: '',
        errorMessage: '',
        chosenItem: null,
        notes: '',
        newBookmarkId: null,
        actionType: '',
    });

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                const { userId, token } = getUserId();
                if (!userId) {
                    throw new Error(`Authorization Token not found!`);
                }
                const response = await apiClient.get(`/bookmark/list/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });
                setBookmarks(response.data.bookmarks);
            }
            catch (error) {
                console.error(`Error fetching bookmarks`, error);
            }
        };
        fetchBookmarks();
    }, []);

    const displayFullDetails = (index) => {
        setSelectedBoxIndex((previousIndex) => (previousIndex === index ? null : index));
    };

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Please login to add a bookmark!');
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        return { userId, token };
    }

    const handleBookmarkClick = async (item) => {
        try {
            const { userId, token } = getUserId();
            if (!userId) {
                setItemInfo((prevInfo) => ({
                    ...prevInfo,
                    toggleErrorMessage: true,
                    errorMessage: 'Please login to add a bookmark!'
                }));
                return;
            }

            if (!item || !item.id) {
                throw new Error('Invalid item or item id');
            }

            const existingBookmark = bookmarks.find((bookmark) => bookmark.response_data.id === item.id);
            console.log(existingBookmark ? existingBookmark.id : 'No existing bookmark');
            console.log(item.id);
            if (existingBookmark) {
                setItemInfo((prevInfo) => ({
                    ...prevInfo,
                    toggleErrorMessage: true,
                    errorMessage: `Bookmark with AirplaneId: ${item.id} is already in your bookmarks!`,
                    chosenItem: item,
                }));
                return;
            }

            const info = {
                userId,
                endpoint: AIRPLANES_ENDPOINT_BASE,
                responseData: item,
                notes: itemInfo.notes,
            };

            const response = await apiClient.post('/bookmark/add', info, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookmarks((prevBookmarks) => [
                ...prevBookmarks,
                response.data.bookmark
            ]);

            setItemInfo((prevInfo) => ({
                ...prevInfo,
                toggleSuccessMessage: true,
                successMessage: `Bookmark successfully added for AirplaneId: ${ item.id }`,
                chosenItem: item,
                newBookmarkId: item.id,
                toggleNotes: false,
                notes: '',
                actionType: 'added'
            }));
        }

        catch (error) {
            console.error(`Error occurred adding bookmark!`);
            console.error(error);
        }
    }

    const handleAddBookmarkWithNotes = async () => {
        try {
            const { userId, token } = getUserId();
            if (!userId) {
                setItemInfo((prevInfo) => ({
                    ...prevInfo,
                    toggleErrorMessage: true,
                    errorMessage: 'Please login to add a bookmark!'
                }));
                return;
            }

            const existingBookmark = bookmarks.find((bookmark) => bookmark.response_data.id === itemInfo.chosenItem.id);
            if (existingBookmark) {
                const updatedBookmark = { ...existingBookmark, notes: itemInfo.notes };
                await apiClient.put(`/bookmark/modify/${existingBookmark.id}`, updatedBookmark, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setItemInfo((prevInfo) => ({
                    ...prevInfo,
                    toggleSuccessMessage: true,
                    successMessage: `Bookmark with AirplaneId: ${itemInfo.chosenItem.id} was successfully updated!`,
                    toggleNotes: false,
                    notes: '',
                    actionType: 'updated'
                }));
            }
            else {
                const info = {
                    userId,
                    endpoint: AIRPLANES_ENDPOINT_BASE,
                    responseData: itemInfo.chosenItem,
                    notes: itemInfo.notes,
                };

                const response = await apiClient.post('/bookmark/add', info, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.data || !response.data.bookmark || !response.data.bookmark.response_data || !response.data.bookmark.response_data.id ) {
                    throw new Error('No existing bookmark ID in response data');
                }

                setBookmarks(( prevBookmarks ) => [
                    ...prevBookmarks,
                    response.data.bookmark
                ]);

                setItemInfo(( prevInfo ) => ({
                    ...prevInfo,
                    toggleSuccessMessage: true,
                    successMessage: `Bookmark successfully added for AirplaneID: ${ response.data.bookmark.id }`,
                    newBookmarkId: response.data.bookmark.id,
                    toggleNotes: false,
                    notes: '',
                    actionType: 'added'
                }));
            }
        } catch (error) {
            console.error(`Error occurred adding bookmark with notes!`);
            setItemInfo((prevInfo) => ({
            ...prevInfo,
            toggleErrorMessage: true,
            errorMessage: `Error occurred: ${error.message}`
        }));
        }
    }

    const handleAddNoteClick = (item) => {
        setItemInfo((prevInfo) => ({
            ...prevInfo,
            toggleNotes: true,
            chosenItem: item,
        }));
    }

    const handleCloseNotes = () => {
        setItemInfo((prevInfo) => ({
            ...prevInfo,
            toggleNotes: false,
            notes: '',
        }));
    }

    return (
        <div className="information-block">
            {data.map((item, index) => (
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
                        height: selectedBoxIndex === index ? 'auto' : '13rem',
                        margin: 'auto',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}
                >
                    <CardContent >
                        <Typography
                            variant='h4'
                        >
                            <span style={{ fontSize: '2rem', color: 'white' }}>
                                <AirplanemodeActive fontSize='large'></AirplanemodeActive>
                            </span>
                            {item.model_name}
                        </Typography>
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
                                Airplane ID:
                            </Typography>
                            <Typography
                                variant='h6'
                                style={{
                                    color: 'cyan'
                                }}
                            >
                                {item.airplane_id}
                            </Typography>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            { item.plane_age && (
                                <>
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
                                {item.plane_age}
                            </Typography>
                            </>
                            )}
                        </div>
                        {selectedBoxIndex === index && (
                            <>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center'
                                    }}
                                >
                                { item.plane_series && (
                                    <>
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
                                        {item.plane_series}
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
                                { item.plane_status && (
                                    <>
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
                                        {item.plane_status}
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
                                    {item.engines_count && (
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
                                                {item.engines_count}
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
                                    {item.engines_type && (
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
                                                {item.engines_type}
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
                                { item.construction_number && (
                                    <>
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
                                        {item.construction_number}
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
                                { item.registration_number && (
                                    <>
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
                                        {item.registration_number}
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
                                { item.production_line && (
                                    <>
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
                                        {item.production_line}
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
                                { item.delivery_date && (
                                    <>
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
                                        {item.delivery_date}
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
                                { item.first_flight_date && (
                                    <>
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
                                        {item.first_flight_date}
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
                                    {item.plane_owner && (
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
                                                {item.plane_owner}
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
                            onClick={() => handleBookmarkClick(item)}
                        >
                            Bookmark
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
                            onClick={() => handleAddNoteClick(item)}
                        >
                            Add Note
                        </Button>
                    </CardContent>
                </Card>
            ))}

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
                    Add Note
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
                        Add a note for { itemInfo.chosenItem ? itemInfo.chosenItem.model_name : '' }
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
                        onClick={handleAddBookmarkWithNotes}
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
        </div>)
}

export default AirplanesInformationBlock;