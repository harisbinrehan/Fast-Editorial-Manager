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
import ForgotPasswordForm from "./ForgotPassword";
const SignIn = () => {
  const { setUser, setAccessToken } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const showForgotPasswordForm = () => {
    setShowForgotPassword(true);
  };

  const showSignInForm = () => {
    setShowForgotPassword(false);
  };
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/users/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Store the returned data in the browser's localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      localStorage.setItem('token', token);
      setAccessToken(token);

      // Redirect the user to the relevant page based on their profile
      if (user.authorId) {
        navigate('/Author/main');
      } else if (user.reviewerId) {
        navigate('/Reviewer/main');
      } else if (user.editorId) {
        navigate('/Editor/main');
      } else {
        alert('No valid user role found.');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in. Please check your email and password.');
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
          {!showForgotPassword ? (<form
            onSubmit={(event) => {
              event.preventDefault();

              handleLogin();
            }}>
            <Typography variant="h4" sx={{ margin: "20px" }}>
              FEM Sign In
            </Typography>
            <Grid
              container
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"flex-start"}>
              <Grid
                container
                item
                justifyContent={"center"}
                flexDirection={"column"}
                //   sx={{ border: "2px solid red" }}
                md={6}
                xs={12}
                sm={12}>
                <Grid
                  item
                  md={11}
                  sm={12}
                  xs={12}
                  sx={{ marginY: "10px", marginX: "20px" }}>
                  <TextField
                    type="email"
                    label="Email Address"
                    required
                    fullWidth
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Grid>
                <Grid
                  item
                  md={11}
                  sm={12}
                  xs={12}
                  sx={{ marginY: "10px", marginX: "20px" }}>
                  <TextField
                    type="password"
                    label="Password"
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
                  sx={{ marginY: "10px", marginX: "20px" }}>
                  <Button
                    variant="contained"
                    // onClick={handleLogin}
                    type={"submit"}
                    color="success"
                    sx={{ marginBottom: "10px" }}>
                    Sign In
                  </Button>
                </Grid>
              </Grid>
              <Grid
                sx={{ paddingBottom: "7px" }}
                container
                item
                justifyContent={"center"}
                flexDirection={"column"}
                md={6}
                sm={12}
                xs={12}>
                <Grid
                  container
                  item
                  flexDirection={"row"}
                  alignItems={"center"}
                  md={12}
                  sm={12}
                  xs={12}
                  sx={{
                    paddingY: "10px",
                    paddingX: "20px",
                  }}>
                  <Divider
                    orientation="vertical"
                    style={{
                      height: "55px",
                      width: "1px",
                      backgroundColor: "black",
                      marginRight: "15px",
                    }}
                  />
                  <RouterLink
                    to="/SignUp"
                    style={{ textDecoration: "none", color: "black" }}>
                    <Link
                      href="#"
                      color="inherit"
                      variant="body2"
                      underline="hover"
                      sx={{ fontSize: "18px" }}>
                      New user? create your free account{" "}
                    </Link>
                  </RouterLink>
                </Grid>
                <Grid
                  container
                  item
                  flexDirection={"row"}
                  alignItems={"center"}
                  md={11}
                  sm={12}
                  xs={12}
                  sx={{ paddingY: "10px", paddingX: "20px" }}>
                  <Divider
                    orientation="vertical"
                    style={{
                      height: "55px",
                      width: "1px",
                      backgroundColor: "black",
                      marginRight: "15px",
                    }}
                  />
                  <Link
                    href="#"
                    color="inherit"
                    variant="body2"
                    underline="hover"
                    sx={{ fontSize: "18px" }}
                    onClick={showForgotPasswordForm}
                  >
                    Forgot password ?{" "}
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </form>
          ) : (
            <ForgotPasswordForm showSignInForm={showSignInForm} />
          )}
        </Box>

      </Box>
    </Container>
  );
};
export default SignIn;

