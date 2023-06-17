import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
import { Link as RouterLink } from "react-router-dom";

import axios from "axios";
import signinbg from "../../assets/signinbgne.jpg";

const ResetPasswordForm = ({ showSignInForm }) => {
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const { token } = useParams();

    const handleResetPassword = async () => {
        try {
            // Add API call to handle reset password request
            const response = await axios.patch(`http://localhost:8000/users/resetpassword/${token}`, {
                password,
                passwordConfirm,
            });

            console.log(`Reset password request for token: ${token}`);
            alert(response.data.message);
        } catch (error) {
            console.error(error);
            alert("Error processing reset password request. Please try again.");
        }
    };


    return (
        <Container>

            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    width: "100%",
                    height: "100vh",
                    backgroundImage: `url(${signinbg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}>
                <Box
                    sx={{
                        width: "75%",
                        maxHeight: "100%",
                        paddingY: "20px",
                        border: "2px solid red",
                        backgroundColor: "white",
                        boxSizing: "border-box",
                        opacity: 0.95,
                        "@media (max-width: 600px)": {
                            width: "100%",
                            paddingY: "0px",
                        },
                    }}>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleResetPassword();
                        }}
                    >
                        <Typography variant="h4" sx={{ margin: "20px" }}>
                            Reset Password
                        </Typography>
                        <Grid container justifyContent={"center"} alignItems={"flex-start"}>
                            <Grid
                                container
                                item
                                justifyContent={"center"}
                                flexDirection={"column"}
                                md={6}
                                xs={12}
                                sm={12}
                            >
                                <Grid
                                    item
                                    md={11}
                                    sm={12}
                                    xs={12}
                                    sx={{ marginY: "10px", marginX: "20px" }}
                                >
                                    <TextField
                                        type="password"
                                        label="New Password"
                                        required
                                        fullWidth
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={11}
                                    sm={12}
                                    xs={12}
                                    sx={{ marginY: "10px", marginX: "20px" }}
                                >
                                    <TextField
                                        type="password"
                                        label="Confirm New Password"
                                        required
                                        fullWidth
                                        onChange={(event) => setPasswordConfirm(event.target.value)}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={11}
                                    sm={12}
                                    xs={12}
                                    sx={{ marginY: "10px", marginX: "20px" }}
                                    display={"flex"}
                                    justifyContent={"space-between"}
                                >
                                    <RouterLink
                                        to="/SignIn"
                                        style={{ textDecoration: "none" }}>
                                        <Button variant="contained"
                                            type="submit"

                                            sx={{ marginBottom: "10px" }} onClick={showSignInForm}>
                                            Back to Sign In
                                        </Button>
                                    </RouterLink>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        color="success"
                                        sx={{ marginBottom: "10px" }}
                                    >
                                        Reset Password
                                    </Button>

                                </Grid>

                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Box>
        </Container>
    );
};

export default ResetPasswordForm;
