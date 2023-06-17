import backgroundImage from '../../assets/contact.jpg'; // Replace with the path to your Unsplash image
import React from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import styled, { keyframes } from 'styled-components';
import { fadeIn } from 'react-animations';
import { spacing } from '@mui/system';

const fadeInAnimation = keyframes`${fadeIn}`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-position: center;
  background-size: cover;
  animation: 2s ${fadeInAnimation};
`;

const ContactForm = styled(Box)`
  ${spacing}
  background-color: rgba(255, 255, 255, 0.9);
  padding: 32px;
  border-radius: 8px;
  width: 800px; // Set a custom width for the card
  max-width: 90%; // Ensure the card doesn't exceed the container width on smaller screens
`;

const ContactUs = () => {
    return (
        <Container>
            <ContactForm>
                <Typography variant="h4" align="center" gutterBottom>
                    Contact Us
                </Typography>
                <form noValidate autoComplete="off">
                    <Box mb={2}>
                        <TextField fullWidth label="Name" variant="outlined" />
                    </Box>
                    <Box mb={2}>
                        <TextField fullWidth label="Email" variant="outlined" />
                    </Box>
                    <Box mb={2}>
                        <TextField fullWidth label="Subject" variant="outlined" />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Message"
                            variant="outlined"
                            multiline
                            rows={4}
                        />
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Button variant="contained" color="primary">
                            Submit
                        </Button>
                    </Box>
                </form>
            </ContactForm>
        </Container>
    );
};

export default ContactUs;
