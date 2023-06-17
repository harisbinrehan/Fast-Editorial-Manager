import React, { useState, useContext } from 'react';
import { UserContext } from "../../context/Users/User";

import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
    Typography,
    Box,
    Grid,
    Chip,
    Button
} from '@mui/material';
import axios from 'axios';

// ReviewerCard component
const ReviewerCard = ({ reviewer, manuscriptId }) => {
    const { user } = useContext(UserContext);
    console.log(reviewer);
    const handleAssignReviewer = async () => {
        try {
            const response = await axios.post('http://localhost:8000/editor/assign-reviewer', {
                manuscriptId: manuscriptId,
                reviewerEmail: reviewer.email,
                editorId: user.editorId, // Replace this with the actual editor ID
                reviewerFirstName: reviewer.firstName,
                reviewerLastName: reviewer.lastName,
                organisation: reviewer.organisation,
                degree: reviewer.degree,
                position: reviewer.position,
                majorField: reviewer.majorField,
                minorFields: reviewer.minorFields,
            });

            if (response.status === 200) {
                alert(response.data.message);
            } else {
                alert('Failed to assign reviewer.');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to assign reviewer.');
        }
    };
    return (
        <Grid item xs={12} sm={6} md={4}>
            <Card
                sx={{

                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                        transform: 'scale(1.05)',
                    },
                }}
            >
                <CardHeader
                    avatar={
                        <Avatar
                            alt={reviewer.firstName}
                            src={reviewer?.profilePicture}
                            sx={{
                                width: '56px',
                                height: '56px',
                                border: '3px solid white',
                            }}
                        />
                    }
                    title={`${reviewer.firstName} ${reviewer.lastName}`}
                    titleTypographyProps={{ color: 'white' }}
                    subheader={reviewer.position}
                    subheaderTypographyProps={{ color: 'white' }}
                    sx={{
                        backgroundImage:
                            "linear-gradient(to left,#536976,#292E49)",
                        padding: '12px 16px',
                    }}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Degree: {reviewer.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Organisation: {reviewer.organisation}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Email: {reviewer.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Major Field: {reviewer.majorField}
                    </Typography>
                    <Box sx={{ marginTop: '8px' }}>
                        {reviewer.minorFields.map((field, index) => (
                            <Chip
                                key={index}
                                label={field}
                                variant="outlined"
                                sx={{
                                    marginRight: '4px',
                                    marginBottom: '4px',
                                }}
                            />
                        ))}
                    </Box>
                    <Box sx={{ marginTop: '0px' }} textAlign={'end'}>
                        {reviewer.verified ? (
                            <Button variant="contained" color="primary" onClick={handleAssignReviewer}>
                                Send Request
                            </Button>
                        ) : (
                            <Button variant="outlined" color="primary" onClick={handleAssignReviewer}>
                                Send Email
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Grid>
    );
};

export default ReviewerCard;
