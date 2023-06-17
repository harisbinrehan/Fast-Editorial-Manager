import React from "react";
import { Link as RouterLink } from "react-router-dom";
import signinbg from "../../assets/signinbgne.jpg";
import logo from "../../assets/fem-logo.png";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/Users/User";
import {
    Box,
    Button,
    Grid,
    Typography,
    Container,
    Link,
    Divider,
    TextField,
} from "@mui/material";
import { border, display } from "@mui/system";
import axios from "axios";
const ForgotPasswordForm = ({ showSignInForm }) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            // Add API call to handle forgot password request
            const response = await axios.post('http://localhost:8000/users/forgotpassword', { email });

            console.log(`Forgot password request for email: ${email}`);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert("Error processing forgot password request. Please try again.");
        }
    };

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                handleForgotPassword();
            }}
        >
            <Typography variant="h4" sx={{ margin: "20px" }}>
                Forgot Password
            </Typography>
            <Grid container justifyContent={"center"} alignItems={"flex-start"}>
                <Grid container item justifyContent={"center"} flexDirection={"column"} md={6} xs={12} sm={12}>
                    <Grid item md={11} sm={12} xs={12} sx={{ marginY: "10px", marginX: "20px" }}>
                        <TextField
                            type="email"
                            label="Email Address"
                            required
                            fullWidth
                            onChange={(event) => setEmail(event.target.value)}
                        />
                    </Grid>
                    <Grid item md={11} sm={12} xs={12} sx={{ marginY: "10px", marginX: "20px" }}>
                        <Button variant="contained" type="submit" color="success" sx={{ marginBottom: "10px" }}>
                            Send
                        </Button>
                    </Grid>
                    <Grid item md={11} sm={12} xs={12} sx={{ marginY: "10px", marginX: "20px" }}>
                        <Button variant="text" color="primary" onClick={showSignInForm}>
                            Back to Sign In
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </form>
    );
};
export default ForgotPasswordForm;
