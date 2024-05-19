// Edit Form Component Implementation 


// Dependencies 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Card, CardHeader, Typography, TextField, Button } from '@mui/material';


// Components & Necessary Files 
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';


// Edit Form Component 
function EditForm({ profile, onSubmit, onCancel }) {
    const [editedProfile, setEditedProfile] = useState({
        username: profile.username || '',
        password: '',
        confirmPassword: '',
        email: profile.email || '',
        dob: profile.dob || dayjs(''),
        imageUrl: profile.image_url || '',
        imageUpload: ''
    });

    const handleChange = ( e ) => {
        const { name, value } = e.target;
        setEditedProfile(( previousProfile ) => ({
            ...previousProfile,
            [ name ]: value,
        }));
    };

    const handleDateChange = (date) => {
        setEditedProfile((previousProfile) => ({
            ...previousProfile,
            dob: date,
        }));
    };

    const handleSubmit = ( e ) => {
        e.preventDefault();
        onSubmit( editedProfile );
    }

    return(
    <form onSubmit = { handleSubmit }>
        <LocalizationProvider dateAdapter = { AdapterDayjs }>
            <DemoContainer components = {[ 'DateField', 'DatePicker' ]}>
                <Box 
                    sx = {{
                        alignItems: 'center',
                        backgroundColor: '#212121',
                        color: 'cyan',
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: 'xx-large',
                        fontWeight: 'bold',
                        justifyContent: 'flex-start',
                        textAlign: 'center'
                    }}
                >

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
                    value = { editedProfile.username || '' }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '15vw',
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
                        marginTop: '1vh',
                    }}
                    ></TextField>

                <TextField
                    required
                    id = 'password'
                    label = 'Password'
                    name = 'password'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: SomethingSecretshhh87...'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { editedProfile.password || '' }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '15vw',
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
                        marginTop: '1vh',
                    }}
                ></TextField>

                <TextField
                    required
                    id = 'confirm-password'
                    label = 'Confirm Password'
                    name = 'confirmPassword'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: SomethingSecretshhh87...'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { editedProfile.confirmPassword || '' }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '15vw',
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
                        marginTop: '1vh',
                    }}
                ></TextField>
                
                <TextField
                    required
                    id = 'email'
                    label = 'Email'
                    name = 'email'
                    variant = 'outlined'
                    color = 'primary'
                    size = 'medium'
                    placeholder = 'Ex: george@onthedeleware.com'
                    InputLabelProps={{
                        style: { color: 'white' },
                    }}
                    value = { editedProfile.email || '' }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '15vw',
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
                        marginTop: '1vh',
                    }}
                ></TextField>

                <DateField
                    label = "Date of Birth"
                    format = "M/D/YYYY"
                    defaultValue = {dayjs('2022-04-17')}
                    shouldRespectLeadingZeros
                    InputLabelProps = {{
                        style: { color: 'white' },
                    }}
                    value={ editedProfile.dob ? dayjs( editedProfile.dob || '' )  : null }
                    onChange = { handleDateChange }
                        sx = {{
                            textAlign: 'center',
                            width: '15vw',
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
                        
                        marginTop: '1vh'
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
                    value = { editedProfile.imageUrl || '' }
                    onChange = { handleChange }
                    sx={{
                        textAlign: 'center',
                        width: '15vw',
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
                        
                        marginTop: '1vh'
                }}
                ></TextField>

                <input 
                    type = 'file'
                    accept = 'image/*'
                    id = 'imageUpload'
                    name = 'imageUpload'
                    value = { editedProfile.imageUpload }
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
                            marginTop: '1vh',
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
            <div className = 'button-container'
                sx = {{ 
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >

                <label htmlFor = 'update-user'>
                    <Button 
                        type = 'submit'
                        variant = 'outlined'
                        color = 'primary'
                        component = 'span'
                        sx = {{
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
                        onClick = { handleSubmit }
                        > 
                    Update 
                    </Button>
                </label>

                <label htmlFor = 'update-cancel'>
                    <Button 
                        variant = 'outlined'
                        color = 'primary'
                        component = 'span'
                        sx = {{
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
                        onClick = { onCancel }
                        > 
                    Cancel 
                    </Button>
                </label>
                </div>
            </Box>
        </DemoContainer>
    </LocalizationProvider>
</form>
    )
}

export default EditForm;


                                    