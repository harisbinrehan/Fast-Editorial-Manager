import React from "react";
import NavBar from "./NavBar";
import NavBarItems from "./NavBarItems";
import {
  Container,
  Grid,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../assets/fem-logo.png";
import { useState } from "react";
const NavigationBar = () => {
  const menuItems = [
    <RouterLink
      to="/AboutUs"
      style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        About Us
      </Button>
    </RouterLink>,
    <RouterLink
      to="/ContactUs"
      style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Contact Us
      </Button>
    </RouterLink>,
    <Button size="large" variant="primary">
      Journal List
    </Button>,
    <RouterLink to="/SignIn" style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Sign In
      </Button>
    </RouterLink>,
    <RouterLink to="/SignUp" style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Sign Up
      </Button>
    </RouterLink>,
  ];
  const items = [
    <RouterLink
      to="/AboutUs"
      style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        About
      </Button>
    </RouterLink>,
    <RouterLink
      to="/ContactUs"
      style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Contact Us
      </Button>
    </RouterLink>,
    <Button size="large" variant="primary">
      Journal List
    </Button>,
  ];
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  return (
    <div>
      <NavBar position="static" color="default">
        {/* <Container maxWidth="lg"> */}
        <Grid
          item
          md={2}
          display={"flex"}
          // justifyContent="center"
          // sx={{ border: 2, borderColor: "red", paddingLeft: "2.1%" }}
          sx={{ paddingX: "2%" }}>
          <RouterLink to="/Home" style={{ textDecoration: "none" }}>
            <NavBarItems
              component="img"
              src={Logo}
              alt="Logo"
              display={"flex"}></NavBarItems>
          </RouterLink>
        </Grid>
        {items.map((item) => {
          return (
            <Grid
              item
              md={2}
              display={{ sm: "none", md: "flex" }}
            // justifyContent="center"
            // sx={{ border: 2, borderColor: "red" }}
            >
              <NavBarItems
                component="div"
                display={{ xs: "none", sm: "none", md: "flex" }}>
                {item}
              </NavBarItems>
            </Grid>
          );
        })}
        <Grid
          item
          md={4}
          display={{ xs: "none", sm: "none", md: "flex" }}
          justifyContent="center"
        // sx={{ border: 2, borderColor: "red" }}
        >
          <Grid container item justifyContent={"center"} spacing={1}>
            <Grid item>
              <RouterLink to="/SignIn" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{ borderRadius: 28 }}>
                  Sign In
                </Button>
              </RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="/SignUp" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 28 }}>
                  {/* <RouterLink to="/Author">Sign Up</RouterLink> */}
                  Sign Up
                </Button>
              </RouterLink>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          md={2}
          display={{ sm: "flex", md: "none" }}
          justifyContent="center"
        // sx={{ border: 2, borderColor: "red" }}
        >
          <NavBarItems component="div" display={{ sm: "flex", md: "none" }}>
            <IconButton
              size="large"
              // edge="center"
              color="inherit"
              aria-label="open drawer"
              // sx={{ mr: 2 }}
              onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
          </NavBarItems>
        </Grid>
        {/* <NavBarItems component="div">
          <Button size="large" variant="primary">
            About
          </Button>
        </NavBarItems>

        <NavBarItems component="div">
          <Button size="large" variant="primary">
            Contact Us
          </Button>
        </NavBarItems>

        <NavBarItems component="div"></NavBarItems> */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorElNav}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={Boolean(anchorElNav)}
          onClick={handleCloseNavMenu}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "none" },
          }}>
          {menuItems.map((mItem) => {
            return <MenuItem>{mItem}</MenuItem>;
          })}
        </Menu>
        {/* </Container> */}
      </NavBar>
    </div>
  );
};
export default NavigationBar;
