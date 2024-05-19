// Create User Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useLoaderData } from 'react-router-dom';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';


// Components & Necessary Files 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';
import EditForm from './EditForm';

axios.defaults.baseURL = 'http://localhost:5000'; // Or whatever URL your backend server is running on


// Create User Component 
function CreateUser() {
    const navigate = useNavigate();
    const location = useLocation();

    const initialState = {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        dob: dayjs('2024-5-5'),
        imageUrl: '',
        imageUpload: ''
    }

    const [ formData, setFormData ] = useState( initialState );
    const [ message, setMessage ] = useState('');


    useEffect( () => {
        if( location.state && location.state.message ){
            setMessage( location.state.message );
        }
    }, [ location.state ] );

    const handleChange = (e) => {
        if (!e || !e.target) {
            return;
        }
    
        const { name, value, type } = e.target;
        const newValue = type === 'file' ? e.target.files[0] : value;
    
        setFormData((prevData) => ({
            ...prevData,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        console.log(formData);
        e.preventDefault();
        const requiredFields = ['username', 'password', 'confirmPassword', 'email'];
        if (!requiredFields.every((field) => formData[field].trim() !== '')) {
            alert('Please fill out all required fields!!!');
            return;
        }
    
        const formDataToSend = { ...formData };
        if (formData.imageUrl === '') {
            delete formDataToSend.imageUrl;
        }
        if (formData.imageUpload === '') {
            delete formDataToSend.imageUpload;
        }
    
        try {
            const response = await axios.post( '/users/create', formDataToSend );
            const successMessage = `Congratulations ${formData.username}, you have successfully created an account!`
            navigate('/', { state: { message: successMessage }});
            setFormData(initialState);
        } catch (error) {
            console.error('Error creating user:', error);
            setMessage( error.response.data.message );
            setFormData( initialState );
        }
    };
    
    return(
        <div className = 'create-user-container'
            style={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                height: '60vh',
                justifyContent: 'center',
                margin: '20vh',
                position: 'relative'
            }}
            >

            {message && (
                <div className = 'message-container'>
                    <p className = 'message' 
                    sx = {{ 
                        color: 'white',
                        textAlign: 'center'
                    }}
                    >{message}</p>
                </div>
            )}

        <form>
            <LocalizationProvider dateAdapter = { AdapterDayjs }>
            <DemoContainer components = {['DateField', 'DatePicker']}>
            <Box 
                sx = {{
                    alignItems: 'center',
                    backgroundColor: '#212121',
                    borderRadius: '1rem',
                    border: '.2rem solid white',
                    color: 'cyan',
                    display: 'flex',
                    flexDirection: 'column',
                    fontSize: 'xx-large',
                    fontWeight: 'bold',
                    height: '650px',
                    justifyContent: 'flex-start',
                    textAlign: 'center',
                    width: '600px'
                }}
                > Create New User
                
                <TextField
                    required
                    id = 'username'
                    label = 'Username'
                    name = 'username'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: JackSparrow23'
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
                    placeholder = 'Ex: SomethingSecretshhh87...'
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

                <TextField
                    required
                    id = 'confirm-password'
                    name = 'confirmPassword'
                    label = 'Confirm Password'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Psst. Make sure this matches your password'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { formData.confirmPassword }
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

                <TextField
                    required
                    id = 'email'
                    name = 'email'
                    label = 'Email'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: jamesbond@yahoo.com'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { formData.email }
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
                
                    <DateField
                        label="Date of Birth"
                        format="M/D/YYYY"
                        defaultValue={dayjs('2022-04-17')}
                        shouldRespectLeadingZeros
                        InputLabelProps={{
                        style: { color: 'white' },
                        }}
                    value = { formData.dob }
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
                    />

                <TextField
                    id = 'image-url'
                    name = 'imageUrl'
                    label = 'Image Url'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: https://example.com/image.jpg'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { formData.imageUrl }
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

                <input 
                    type = 'file'
                    accept = 'image/*'
                    id = 'imageUpload'
                    name = 'imageUpload'
                    value = { formData.imageUpload }
                    onChange = { handleChange }
                    style = {{ display: 'none' }}
                    />

                <label htmlFor = 'imageUpload'>
                    <Button 
                        variant = 'outlined'
                        color = 'primary'
                        component = 'span'
                        sx = {{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            marginTop: '10px',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }} 
                        > Upload Image 
                    </Button>
                </label>

                <label htmlFor = 'create-user'>
                    <Button 
                        type = 'submit'
                        variant = 'outlined'
                        color = 'primary'
                        component = 'span'
                        sx = {{
                            color: 'cyan',
                            borderColor: 'cyan',
                            fontWeight: 'bold',
                            marginTop: '80px',
                            '&:hover': {
                                color: '#212121',
                                borderColor: 'white',
                                backgroundColor: 'cyan',
                                fontWeight: 'bold'
                            },
                        }} 
                        onClick = { handleSubmit }
                        > Create 
                    </Button>
                </label>
            </Box> 
            </DemoContainer>
            </LocalizationProvider>
        </form>
        </div>
    )

}

export default CreateUser;