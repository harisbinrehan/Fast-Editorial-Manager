import React, { useState, useEffect, useContext } from "react";
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    MenuItem,
    Chip
} from '@mui/material';
import { UserContext } from "../../context/Users/User";
import { styled, keyframes } from '@mui/system';
import axios from 'axios';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const AnimatedCard = styled(Card)`
  animation: ${fadeIn} 1s ease-out;
`;

const fields = [
    'Computer Science',
    'Civil Engineering',
    'Electrical Engineering',
    'Business',
];
const names = [
    "Algorithms",
    "Artificial intelligence",
    "Computer architecture",
    "Computer graphics",
    "Computer networks",
    "Computer programming",
    "Computer security",
    "Computer vision",
    "Data mining",
    "Data science",
    "Database systems",
    "Distributed systems",
    "Human-computer interaction",
    "Information retrieval",
    "Machine learning",
    "Natural language processing",
    "Operating systems",
    "Robotics",
    "Software engineering",
    "Theory of computation",
];

const AssignRevManually = ({ manuscriptId }) => {
    const { user } = useContext(UserContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [reviewerEmail, setReviewerEmail] = useState("");
    const [organisation, setOrganisation] = useState("");
    const [degree, setDegree] = useState("");
    const [position, setPosition] = useState("");
    const [majorField, setMajorField] = useState("");
    const [minorFields, setMinorFields] = useState([]);

    const handleMajorChange = (event) => {
        setMajorField(event.target.value);
    };

    const handleMinorChange = (event) => {
        setMinorFields(event.target.value);
    };

    const handleAssignReviewer = async () => {
        console.log(reviewerEmail);
        try {
            const response = await axios.post('http://localhost:8000/editor/assign-reviewer', {
                manuscriptId: manuscriptId,
                reviewerEmail: reviewerEmail,
                editorId: user.editorId,
                reviewerFirstName: firstName,
                reviewerLastName: lastName,
                organisation: organisation,
                degree: degree,
                position: position,
                majorField: majorField,
                minorFields: minorFields,
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
        <Grid item md={6} xs={12} sm={12}>
            <AnimatedCard elevation={3} sx={{ marginY: '10px', borderRadius: '15px', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)' }}>
                <CardContent>
                    <Card elevation={4} sx={{
                        backgroundImage:
                            "linear-gradient(to left,#536976,#292E49)", padding: "10px", marginBottom: "15px"
                    }} >

                        <Typography
                            variant="h6"
                            textAlign="center"
                            color="white"
                            // gutterBottom
                            sx={{ fontWeight: 'bold' }}
                        >
                            Assign Reviewer Manually
                        </Typography>
                    </Card>
                    <Grid container direction="row" spacing={2}>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setReviewerEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Organisation"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setOrganisation(e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Degree"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setDegree(e.target.value)}
                            />
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <TextField
                                label="Position"
                                variant="outlined"
                                fullWidth
                                sx={{ marginBottom: '15px' }}
                                onChange={(e) => setPosition(e.target.value)}
                            />
                        </Grid>
                        <Grid item container md={12} sm={12} justifyContent={"center"}>
                            <FormControl sx={{ m: 1, width: '45%' }}>
                                <InputLabel id="major-field-select-label">Major Field</InputLabel>
                                <Select
                                    labelId="major-field-select-label"
                                    id="major-field-select"
                                    value={majorField}
                                    label="Major Field"
                                    onChange={handleMajorChange}
                                >
                                    {fields.map((field) => (
                                        <MenuItem key={field} value={field}>
                                            {field}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, width: '45%' }}>
                                <InputLabel id="demo-multiple-chip-label">
                                    Select the Relevent Fields
                                </InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={minorFields}
                                    onChange={handleMinorChange}
                                    input={
                                        <OutlinedInput
                                            id="select-multiple-chip"
                                            label="Select the Relevent Fields"
                                        />
                                    }
                                    renderValue={(selected) => (
                                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {names.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAssignReviewer}
                        sx={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', marginTop: '15px' }}
                    >
                        Send Request
                    </Button>
                </CardContent>
            </AnimatedCard>
        </Grid >
    );
};

export default AssignRevManually;
