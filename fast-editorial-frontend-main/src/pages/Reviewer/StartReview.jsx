import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Rating,
  Button,
  Grid
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../../context/Users/User';
import { useParams } from 'react-router-dom';
const StartReview = () => {
  // ... (existing state variables and functions)
  const { user } = useContext(UserContext);
  const { manuscriptId } = useParams();
  const [rating, setRating] = useState(3);
  const [status, setStatus] = useState('');
  const [editorComments, setEditorComments] = useState('');
  const [authorComments, setAuthorComments] = useState('');
  const [contribution, setContribution] = useState('');
  const [figuresQuality, setFiguresQuality] = useState('');
  const [grammaticallySound, setGrammaticallySound] = useState('');
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setDisabled(
      rating === 0 || status === '' || editorComments === '' || authorComments === '' || contribution === '' || figuresQuality === '' || grammaticallySound === ''
    );
  }, [rating, status, editorComments, authorComments, contribution, figuresQuality, grammaticallySound]);

  const handleSubmit = async () => {
    if (!disabled) {
      const reviewData = {
        reviewerId: user.reviewerId,
        manuscriptId: manuscriptId,
        manuscriptstatus: status,
        commentstoeditor: editorComments,
        commentstoauthor: authorComments,
        rating: rating,
        figuresquality: figuresQuality,
        contribution: contribution,
        grammatical_status: grammaticallySound
      };

      try {
        const response = await axios.patch('http://localhost:8000/reviewer/submit-review', reviewData);
        console.log(response.data);
        // handle success (e.g., show a success message, navigate to another page, etc.)
        navigate('/Reviewer/main');
      } catch (error) {
        console.error('Error submitting the review:', error);
        // handle error (e.g., show an error message)
      }
    }
  };
  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 12,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }} textAlign={'center'}>
          Start Reviewing the Manuscript
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Overall Rating
        </Typography>
        <Rating
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          sx={{ marginBottom: 2 }}
        />
        <Grid md={6}>
          <FormControl fullWidth sx={{ marginBottom: 2, minWidth: "300px" }}>
            <InputLabel id="Your Decision">Your Decision</InputLabel>
            <Select
              label="Your Decision"
              value={status}
              onChange={handleChange}
            >
              <MenuItem value="Accept">Accept</MenuItem>
              <MenuItem value="Accept with Minor Changes">Accept with Minor Changes</MenuItem>
              <MenuItem value="Accept with Major Changes">Accept with Major Changes</MenuItem>
              <MenuItem value="Reject">Reject</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container spacing={2} flexDirection={'column'} >
          <Grid item md={12} sm={6} xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" >Contribution</FormLabel>
              <RadioGroup
                row
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
                sx={{ justifyContent: 'space-around' }}
              >
                <FormControlLabel value="Very High" control={<Radio />} label="Very High" />
                <FormControlLabel value="High" control={<Radio />} label="High" />
                <FormControlLabel value="Moderate" control={<Radio />} label="Moderate" />
                <FormControlLabel value="Low" control={<Radio />} label="Low" />
                <FormControlLabel value="Very Low" control={<Radio />} label="Very Low" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={12} sm={12} xs={12}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Figures Quality</FormLabel>
              <RadioGroup
                row
                value={figuresQuality}
                onChange={(e) => setFiguresQuality(e.target.value)}
                sx={{ justifyContent: 'space-around' }}
              >
                <FormControlLabel value="Excellent" control={<Radio />} label="Excellent" />
                <FormControlLabel value="Good" control={<Radio />} label="Good" />
                <FormControlLabel value="Average" control={<Radio />} label="Average" />
                <FormControlLabel value="Bad" control={<Radio />} label="Bad" />
                <FormControlLabel value="Very Bad" control={<Radio />} label="Very Bad" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mb={2.5}>
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend">Grammatically Sound</FormLabel>
              <RadioGroup
                row
                value={grammaticallySound}
                onChange={(e) => setGrammaticallySound(e.target.value)}
                sx={{ justifyContent: 'space-around' }}
              >
                <FormControlLabel value="Excellent" control={<Radio />} label="Excellent" />
                <FormControlLabel value="Good" control={<Radio />} label="Good" />
                <FormControlLabel value="Average" control={<Radio />} label="Average" />
                <FormControlLabel value="Bad" control={<Radio />} label="Bad" />
                <FormControlLabel value="Very Bad" control={<Radio />} label="Very Bad" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          label="Comments to Editor"
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          value={editorComments}
          onChange={(e) => setEditorComments(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Comments to Author"
          multiline
          rows={5}
          fullWidth
          variant="outlined"
          value={authorComments}
          onChange={(e) => setAuthorComments(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <RouterLink
          to="/Reviewer/PendingReviews"
          style={{ textDecoration: "none" }}>
          <Button variant="contained" onClick={handleSubmit} disabled={disabled}>
            Submit Review
          </Button>
        </RouterLink>
      </Box>
    </Container>
  );
};

export default StartReview;


