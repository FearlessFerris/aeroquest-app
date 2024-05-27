// Dependencies
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Avatar, Box, Card, CardContent, Typography } from '@mui/material';

// Home Component
function Home() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      <div className='homepage-component-container'>
        {message && (
          <div
            className='message-container'
            style={{
              display: 'flex',
              marginTop: '6rem',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant='h5'
              style={{
                color: 'white',
                textAlign: 'center',
              }}
            >
              {message}
            </Typography>
          </div>
        )}
      </div>
      <div
        className='homepage-container'
        style={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          margin: '15rem',
        }}
      >
        <Card
          sx={{
            alignItems: 'center',
            backgroundColor: '#212121',
            borderRadius: '1rem',
            border: '.2rem solid white',
            display: 'flex',
            fontSize: 'xx-large',
            fontWeight: 'bold',
          }}
        >
          <CardContent>
            <div
              style={{
                display: 'flex',
                margin: '1rem'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '55rem',
                }}
              >
                <Typography
                  variant='h3'
                  sx={{
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '3rem',
                  }}
                >
                  Welcome to&nbsp;
                  <span
                    style = {{
                      color: 'cyan',
                      fontStyle: 'italic'
                    }}
                  > 
                  Aeroquest
                  </span>
                </Typography>
                <Typography
                  variant='h5'
                  sx={{
                    color: 'white',
                  }}
                >
                  <a
                    href='https://github.com/FearlessFerris/aeroquest-app'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      color: 'cyan',
                      textDecoration: 'none',
                    }}
                  >
                    Aeroquest
                  </a>{' '}
                  is an application created with aviation enthusiasts in mind. Simply put, 
                  this application allows users to create personal profiles and, most importantly, 
                  make API requests to endpoints defined by the{' '}
                  <a
                    href='https://aviationstack.com/'
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      color: 'cyan',
                      textDecoration: 'none',
                    }}
                  >
                    AviationStack API
                  </a>
                  . A user account is not required to begin making API requests; 
                  however, to fully utilize features such as bookmarks and search history, 
                  creating an account is necessary.
                </Typography>
              </Box>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Home;
