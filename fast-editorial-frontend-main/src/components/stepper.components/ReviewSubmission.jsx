import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Button,
} from "@mui/material";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";

const ReviewSubmission = () => {
    const { manuscriptId } = useContext(ManuscriptContext);
    const [manuscriptData, setManuscriptData] = useState({});

    useEffect(() => {
        axios.get(`http://localhost:8000/author/manuscript/${manuscriptId}`)
            .then(res => {
                setManuscriptData(res.data.manuscript);
            })
            .catch(err => console.error(err));
    }, [manuscriptId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Submission data...", manuscriptData);
        // Here, send your submission data to your API
    };

    return (
        <Box>
            <Card elevation={3} sx={{ mx: "10px", my: "75px", p: "10px" }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>Review Your Submission</Typography>

                    <Typography variant="h6">Manuscript Details</Typography>
                    <Typography><strong>Title:</strong> {manuscriptData.title}</Typography>
                    <Typography><strong>Abstract:</strong> {manuscriptData.abstract}</Typography>

                    <Typography><strong>Major Field:</strong> {manuscriptData.majorfield}</Typography>
                    <Typography variant="h6">Minor Fields</Typography>
                    {manuscriptData.minorfields && manuscriptData.minorfields.map((field, index) => (
                        <Chip key={index} label={field} variant="outlined" color="primary" style={{ marginRight: "10px" }} />
                    ))}

                    <Grid container spacing={3} justifyContent={"center"}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Manuscript PDF</Typography>
                            <iframe
                                src={manuscriptData.manuscript}
                                width="100%"
                                height="500px"
                                title="Manuscript PDF"
                                style={{ border: "1px solid black" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Author Image</Typography>
                            <img
                                src={manuscriptData.authorPhoto}
                                alt="Author"
                                width="100%"
                                style={{ display: "block", margin: "0 auto" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Author Biography</Typography>
                            {manuscriptData.authorBiography && manuscriptData.authorBiography.endsWith('.pdf') &&
                                <iframe
                                    src={manuscriptData.authorBiography}
                                    width="100%"
                                    height="500px"
                                    title="Author Biography"
                                    style={{ border: "1px solid black" }}
                                />
                            }
                            {manuscriptData.authorBiography && manuscriptData.authorBiography.endsWith('.txt') &&
                                <iframe
                                    src={`data:text/plain;charset=utf-8,${encodeURIComponent(manuscriptData.authorBiography)}`}
                                    width="100%"
                                    height="500px"
                                    title="Author Biography"
                                    style={{ border: "1px solid black" }}
                                />
                            }
                        </Grid>

                    </Grid>

                    <Typography><strong>Author:</strong> {manuscriptData.correspondingAuthorName}</Typography>
                    <Typography><strong>Email:</strong> {manuscriptData.correspondingAuthorEmail}</Typography>
                    <Typography><strong>Phone:</strong> {manuscriptData.correspondingAuthorPhone}</Typography>

                    <Typography variant="h6">Additional Comments</Typography>
                    {manuscriptData.additionalComments && manuscriptData.additionalComments.map((comment, index) => (
                        <Typography key={index}><strong>Comment {index + 1}:</strong> {comment}</Typography>
                    ))}

                    {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Box> */}
                </CardContent>
            </Card>
        </Box>
    );
};

export default ReviewSubmission;
