// Login Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

// Components & Necessary Files 


// Login Component 
function Login({ setIsLoggedIn, setUserProfile }) {

    const navigate = useNavigate();

    const initialState = {
        username: '',
        password: ''
    }

    const [ formData, setFormData ] = useState( initialState )
    const [ message, setMessage ] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async ( e ) => {
        e.preventDefault();
        const { username, password } = formData;
        try{
            const response = await axios.post( '/users/login', formData );
            if( response && response.data ){
                const { token } = response.data;
                localStorage.setItem( 'token', token );
                setIsLoggedIn( true );
                const decodedToken = jwtDecode( token );
                const userProfileResponse = await axios.get(`/users/profile/${ decodedToken.id }`, {
                    headers: {
                        Authorization: `Bearer ${ token }`
                    }
                });
                setUserProfile( userProfileResponse.data.data );
                navigate( '/', { state: { message: `Welcome back ${ username }, hope you are well today!` } });
            }
        }
        catch( error ){
            console.error( error.response.data.message );
        }
    };

    return(
        <div className = 'login-container'
        style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
            flexDirection: 'column'
        }}
        >

        { message && (
            <div className = 'message-container'
                style = {{ 
                    display: 'flex',
                    margin: '50px',
                    justifyContent: 'center'
            }}
            >
                <p
                sx = {{ 
                    color: 'white',
                    textAlign: 'center'
                }}
                > { message } </p>
            </div>
        )}

        <form>

            <Box 
                sx = {{
                    alignItems: 'center',
                    backgroundColor: '#212121',
                    borderRadius: '1rem',
                    border: '.2rem solid white',
                    color: 'cyan',
                    display: 'flex',
                    fontSize: 'xx-large',
                    fontWeight: 'bold',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    width: '600px',
                    height: '300px'
                }}
            > Login
            
            <TextField
                    required
                    id = 'username'
                    name = 'username'
                    label = 'Username'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: StanTheManWithThePlan'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { formData.username }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '350px',
                        color: 'white',
                        '& .MuiOutlinedInput-root .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'cyan',
                            },
                        },
                        '& input': {
                            color: 'cyan',
                        },
                        marginTop: '40px',
                    }}
                ></TextField>

                <TextField
                    required
                    id = 'password'
                    name = 'password'
                    label = 'Password'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: not123'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { formData.password }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '350px',
                        color: 'white',
                        '& .MuiOutlinedInput-root .MuiInputLabel-root': {
                            color: 'white',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: 'white',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'cyan',
                            },
                        },
                        '& input': {
                            color: 'cyan',
                        },
                        
                        marginTop: '10px'
                    }}
                ></TextField> 

                <label htmlFor = 'login'>
                    <Button 
                        type = 'submit'
                        variant = 'outlined'
                        color = 'primary'
                        component = 'span'
                        sx = {{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            marginTop: '30px',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }} 
                        onClick = { handleSubmit }
                    > Login 
                    </Button>
                </label>
            </Box>
        </form>
        </div>
    )
    
}

export default Login;