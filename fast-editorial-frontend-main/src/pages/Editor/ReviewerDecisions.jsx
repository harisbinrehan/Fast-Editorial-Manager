import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Grid,
    Rating
} from "@mui/material";
import { useParams } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const ReviewerDecisions = () => {
    const [manuscript, setManuscript] = useState(null);
    const [editorDecision, setEditorDecision] = useState("");
    const [editorComments, setEditorComments] = useState(null);
    const [commentsToAuthor, setCommentsToAuthor] = useState([]);
    const [reviews, setReviews] = useState([]);
    const { manuscriptId } = useParams();

    const handleChange = (event) => {
        setEditorDecision(event.target.value);
    };
    useEffect(() => {
        const fetchManuscriptDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8000/editor/get-manuscript/${manuscriptId}`);
                const data = await response.json();
                setManuscript(data);
            } catch (error) {
                console.error("Failed to fetch manuscript details:", error);
            }
        };

        fetchManuscriptDetails();
    }, [manuscriptId]);
    useEffect(() => {
        const fetchManuscriptData = async () => {
            try {


                // Fetch reviews
                const response = await fetch(
                    `http://localhost:8000/editor/get-reviewer-decisions/${manuscriptId}`
                );
                const data = await response.json();
                setReviews(data);
                const fetchedComments = data.map(review => review.commentstoauthor);
                setCommentsToAuthor(fetchedComments);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchManuscriptData();
    }, [manuscriptId]);

    if (!manuscript) {
        return <div>Loading...</div>;
    }
    const handleSubmit = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/editor/final-decision-by-editor/${manuscriptId}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        editorComments: editorComments,
                        commentsFromReviewer: commentsToAuthor,
                        status: editorDecision,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update manuscript');
            }

            alert('Manuscript updated successfully');
        } catch (error) {
            console.error('Failed to update manuscript:', error);
            alert('Failed to update manuscript');
        }
    };


    return (
        <Box>
            <Box sx={{ textAlign: "center", mt: "75px", mx: "auto" }}>
                <Typography variant="h6" component="div" gutterBottom>
                    Title: {manuscript.title}
                </Typography>
                <Typography variant="subtitle1" component="div" gutterBottom>
                    Manuscript ID: {manuscript._id}
                </Typography>
                <Typography variant="subtitle1" component="div" gutterBottom>
                    Major Field: {manuscript.majorfield}
                </Typography>
                <Typography variant="subtitle1" component="div" gutterBottom>
                    Minor Fields: {manuscript.minorfields.join(", ")}
                </Typography>
            </Box>

            <Typography variant="h6" textAlign={'center'} component="div" gutterBottom sx={{ mt: 3 }}>
                Reviewer Feedback
            </Typography>
            <Grid container spacing={2} padding={"10px"} justifyContent={'center'}>
                {reviews.map((review, index) => (
                    <Grid key={index} item md={4} sm={6} xs={12}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h6" component="div" gutterBottom>
                                    Review {index + 1}: {review.reviewerName}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Over All Rating: {review.rating}
                                </Typography>
                                <Rating
                                    value={review.rating}
                                    readOnly
                                    sx={{ marginBottom: 2 }}
                                />
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Decision: {review.decision}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Contribution: {review.contribution}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Grammatically Sound: {review.grammatical_status}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Figures Quality: {review.figuresquality}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Comments to Editor: {review.commentstoeditor}
                                </Typography>
                                <Typography variant="subtitle1" component="div" gutterBottom>
                                    Comments to Author: {review.commentstoauthor}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card sx={{ width: "70%", mt: 3, mx: "auto", p: 3, mb: 1 }} elevation={3}>
                <Typography variant="h6" component="div" gutterBottom>
                    Editor Decision
                </Typography>
                <FormControl fullWidth variant="outlined" sx={{ mt: 2 }}>
                    <InputLabel id="editor-decision-label">Decision</InputLabel>
                    <Select
                        labelId="editor-decision-label"
                        id="editor-decision"
                        value={editorDecision}
                        label="Decision"
                        onChange={handleChange}
                    >
                        <MenuItem value="accepted">Accept</MenuItem>
                        <MenuItem value="minorChanges">
                            Accept with minor changes
                        </MenuItem>
                        <MenuItem value="majorChanges">
                            Accept with major changes
                        </MenuItem>
                        <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    id="editor-comments"
                    label="Editor Comments"
                    multiline
                    rows={4}
                    sx={{ mt: 2 }}
                    value={editorComments}
                    variant="outlined"
                    onChange={(e) => setEditorComments(e.target.value)}
                />
                <RouterLink
                    to="/Editor/main"
                    style={{ textDecoration: "none" }}>

                    <Button
                        sx={{ mt: 3 }}
                        size="large"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Send to Author
                    </Button>
                </RouterLink>
            </Card>
        </Box>
    );
};

export default ReviewerDecisions;

