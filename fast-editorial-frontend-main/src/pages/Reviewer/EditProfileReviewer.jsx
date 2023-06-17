import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Box, Button, TextField, Typography, Grid, Avatar, Divider, IconButton, OutlinedInput, AccordionSummary, AccordionDetails, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme, Select, MenuItem, FormControl, Chip, InputLabel } from "@mui/material";
import { UserContext } from "../../context/Users/User";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { Link as RouterLink } from 'react-router-dom';
const EditProfileRev = () => {
    const { user, setUser } = useContext(UserContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [thisuser, setThisUser] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        organisation: "",
        degree: "",
        position: "",
        city: "",
        country: "",
        state: "",
        age: "",
        majorField: "",
        minorFields: [],
        profilePicture: "",
        profilePictureFile: null
    });

    const majorFieldsOptions = ['Computer Science',
        'Civil Engineering',
        'Electrical Engineering',
        'Business',]; // Add your options for major fields
    const minorFieldsOptions = ["Algorithms",
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
        "Theory of computation",]; // Add your options for minor fields

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/reviewer/current-user/${user.reviewerId}`);
                setThisUser(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setThisUser({ ...thisuser, [name]: value });
    };

    const handleSelectChange = (e) => {
        setThisUser({
            ...thisuser,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setThisUser({
            ...thisuser,
            profilePicture: URL.createObjectURL(selectedFile),
            profilePictureFile: selectedFile
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(thisuser).forEach((key) => {
            if (key === "profilePictureFile" && thisuser[key]) {
                formData.append("profilePicture", thisuser.profilePictureFile, thisuser.profilePictureFile.name);
            } else if (key !== "profilePicture") {
                formData.append(key, thisuser[key]);
            }
        });

        try {
            const response = await axios.put(`http://localhost:8000/reviewer/edit-profile/${user.reviewerId}`, formData);
            if (response.status === 200 || response.status === 201 || response.status === 304) {
                setUser((prevState) => ({ ...prevState, profilePicture: thisuser?.profilePicture }));
                console.log("USERR", user)
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: '100vh',
                alignItems: 'stretch',
                backgroundColor: 'background.paper',
                mt: '64px' // Adjust this value to prevent the overlap with the navbar
            }}
        >
            <Box sx={{ width: isMobile ? '100%' : '25%', backgroundColor: '#fff' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    <Box sx={{ width: 150, height: 150, mb: 2, position: 'relative' }}>
                        <Avatar
                            sx={{ width: '100%', height: '100%' }}
                            src={thisuser?.profilePicture}
                        />
                        <input
                            accept="image/*"
                            style={{ display: 'none' }}
                            id="icon-button-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="icon-button-file">
                            <IconButton
                                color="primary"
                                aria-label="upload picture"
                                component="span"
                                sx={{ position: 'absolute', bottom: 10, right: 10 }}
                            >
                                <PhotoCamera />
                            </IconButton>
                        </label>
                    </Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {thisuser.email}
                    </Typography>
                </Box>
                <Divider />
                <List>
                    <RouterLink
                        to="/Reviewer/main"
                        style={{ textDecoration: "none", color: "black" }}>
                        <ListItem button >
                            <ListItemIcon>
                                <DashboardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItem>
                    </RouterLink>
                    <RouterLink
                        to="/Home"
                        style={{ textDecoration: "none", color: "black" }}>
                        <ListItem button >
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </RouterLink>
                </List>
            </Box>
            <Box sx={{ width: isMobile ? '100%' : '75%', p: 3 }}>
                <Typography component="h1" variant="h5" gutterBottom>
                    Edit Profile
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container sx={{ width: '100%', mb: 2 }} spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="firstName"
                            required
                            fullWidth
                            label="First Name"
                            value={thisuser.firstName}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            name="middleName"
                            required
                            fullWidth
                            label="Middle Name"
                            value={thisuser.middleName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            required
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={thisuser.lastName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Email Address"
                            name="email"
                            value={thisuser.email}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Organisation"
                            name="organisation"
                            value={thisuser.organisation}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Degree"
                            name="degree"
                            value={thisuser.degree}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            label="Position"
                            name="position"
                            value={thisuser.position}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="City"
                            name="city"
                            value={thisuser.city}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Country"
                            name="country"
                            value={thisuser.country}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="State"
                            name="state"
                            value={thisuser.state}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            required
                            fullWidth
                            label="Age"
                            name="age"
                            type="number"
                            value={thisuser.age}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid container item xs={12} justifyContent="center" spacing={2}>
                        <Grid item xs={6}>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="majorField-label">Major Field</InputLabel>
                                <Select
                                    labelId="majorField-label"
                                    id="majorField"
                                    value={thisuser.majorField}
                                    label="Major Field"
                                    name="majorField"
                                    onChange={handleSelectChange}
                                >
                                    {majorFieldsOptions.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl sx={{ m: 1, width: '100%' }}>
                                <InputLabel id="minorFields-label">Minor Fields</InputLabel>
                                <Select
                                    labelId="minorFields-label"
                                    id="minorFields"
                                    multiple
                                    value={thisuser.minorFields}
                                    label="Minor Fields"
                                    name="minorFields"
                                    onChange={handleSelectChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Minor Fields" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={value} />
                                            ))}
                                        </Box>
                                    )}
                                >
                                    {minorFieldsOptions.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                </Grid>
                <Button
                    type="submit"
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2, ml: 'auto', mr: 3, display: 'block' }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
};

export default EditProfileRev;
