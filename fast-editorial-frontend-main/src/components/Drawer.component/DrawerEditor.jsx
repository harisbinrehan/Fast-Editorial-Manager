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
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import Accordion from "../../components/Accordian.component/Accordion";
import { Link as RouterLink } from "react-router-dom";
import Drawer from "./Drawer";
import Avatar from "../../components/Avatar.component/Avatar";
import lens from "../../assets/Lens.jpg";
import paper from "../../assets/papers.jpg";
import { UserContext } from "../../context/Users/User";
import { Outlet, useLocation } from "react-router-dom";
const DrawerEditor = ({ mobileOpen, handleDrawerToggle }) => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Drawer mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} >
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
                to="/Editor/Edit-Profile-Editor"
                style={{ textDecoration: "none" }}>
                <Typography textAlign={"center"} color={"black"}>Edit Profile</Typography>
              </RouterLink>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ mb: "3px" }}>
            <Accordion title="New Submissions">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      backgroundImage:
                        "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                    }}>
                    {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
                    <CardContent sx={{ py: "10px" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        New Submissions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please click on the button to see all the requests. The
                        requests are sent to you by Editors You are able to
                        Accept or Decline the Pending Requests.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ py: "0px", pb: "3px" }}>
                      {/* <Button size="small">Share</Button> */}
                      <Button size="small">
                        Click to see all the requests
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
          <ListItem disablePadding sx={{ mb: "3px" }}>
            <Accordion title="Assign Reviewers">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      backgroundImage:
                        "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                    }}>
                    {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
                    <CardContent sx={{ py: "10px" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Assign Reviewers
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please click on the button to see all the requests. The
                        requests are sent to you by Editors You are able to
                        Accept or Decline the Pending Requests.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ py: "0px", pb: "3px" }}>
                      {/* <Button size="small">Share</Button> */}
                      <Button size="small">
                        Click to see all the requests
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
          <ListItem disablePadding sx={{ mb: "3px" }}>
            <Accordion title="Pending Decisions">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      backgroundImage:
                        "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                    }}>
                    {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
                    <CardContent sx={{ py: "10px" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Pending Decisions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please click on the button to see all the requests. The
                        requests are sent to you by Editors You are able to
                        Accept or Decline the Pending Requests.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ py: "0px", pb: "3px" }}>
                      {/* <Button size="small">Share</Button> */}
                      <Button size="small">
                        Click to see all the requests
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </Accordion>
          </ListItem>
          <ListItem disablePadding sx={{ mb: "3px" }}>
            <Accordion title="Final Decisions">
              <Grid container spacing={1}>
                <Grid item md={12} sm={12} xs={12}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      backgroundImage:
                        "linear-gradient(to bottom,#dad4ec,#f3e7e9)",
                    }}>
                    {/* <CardMedia
                      sx={{ height: 100 }}
                      image={paper}
                      title="green iguana"
                    /> */}
                    <CardContent sx={{ py: "10px" }}>
                      <Typography gutterBottom variant="h5" component="div">
                        Final Decisions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Please click on the button to see all the requests. The
                        requests are sent to you by Editors You are able to
                        Accept or Decline the Pending Requests.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ py: "0px", pb: "3px" }}>
                      {/* <Button size="small">Share</Button> */}
                      <Button size="small">
                        Click to see all the requests
                      </Button>
                    </CardActions>
                  </Card>
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
export default DrawerEditor;
