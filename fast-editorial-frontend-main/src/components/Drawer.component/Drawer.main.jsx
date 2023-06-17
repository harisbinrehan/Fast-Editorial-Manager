import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  CssBaseline,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Typography,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import Accordion from "../../components/Accordian.component/Accordion";
import { Link as RouterLink } from "react-router-dom";
import Drawer from "./Drawer";
import Avatar from "../../components/Avatar.component/Avatar";
import { UserContext } from "../../context/Users/User";
import { Outlet, useLocation } from "react-router-dom";
const DrawerMain = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Drawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                justifyContent: "center",
              }}>
              <Avatar sx={{ width: "100px", height: "100px" }} src={user.profilePicture}>
                NA
              </Avatar>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                justifyContent: "center",
              }}>
              <Chip label={`${user.firstName} ${user.lastName}`} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                justifyContent: "center",
              }}>
              <RouterLink
                to="/Author/Edit-Profile-Author"
                style={{ textDecoration: "none" }}>
                <Typography textAlign={"center"} color={"black"}>Edit Profile</Typography>
              </RouterLink>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <Accordion title="New Submission">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  {/* resusable make a component of a grid item and pass all the buttons with name */}
                  <RouterLink
                    to="/Author/Stepper"
                    style={{ textDecoration: "none" }}>
                    <Button color="secondary" variant="outlined" size="small">
                      Submit New Manuscript
                    </Button>
                  </RouterLink>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Button color="secondary" variant="outlined" size="small">
                    Incomplete Submission
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Button color="secondary" variant="outlined" size="small">
                    Submission in Process
                  </Button>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
          <ListItem disablePadding>
            <Accordion title="Review">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  {/* resusable make a component of a grid item and pass all the buttons with name */}
                  <Button color="error" variant="outlined" size="small">
                    Submissions Needing Revision
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Button color="error" variant="outlined" size="small">
                    Revisions being Processed
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Button color="error" variant="outlined" size="small">
                    Declined Revisions
                  </Button>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
          <ListItem disablePadding>
            <Accordion title="Completed">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  {/* resusable make a component of a grid item and pass all the buttons with name */}
                  <Button color="success" variant="outlined" size="small">
                    Submissions with Decision
                  </Button>
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <Button color="success" variant="outlined" size="small">
                    Completed Submissions
                  </Button>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
        </List>
      </Drawer>
      <Outlet />
    </>
  );
};
export default DrawerMain;
