import React from 'react'
import Avatar from "@mui/material/Avatar";
import {Typography, Grid, Box, Button, IconButton, Menu, MenuItem } from "@mui/material";
import books1 from "../../assets/books1.jpg";
import author from "../../assets/author.png";
import reviewer from "../../assets/reviewer.png";
import editor from "../../assets/editor.png";
const AvatarDesc = ({text,desc,photo})=> {
  return (
    <>
      <Grid
        item
        md={4}
        sm={12}
        xs={12}
        // sx={{ border: "2px solid red" }}
        sx={{marginTop:"3px"}}
        // justifyContent="center"
        //   display="block"
      >
        <Avatar
          alt="Cindy Baker"
          src={photo}
          sx={{ width: 80, height: 80, margin: "auto" }}
        />{" "}
        <Typography sx={{ textAlign: "center" }}>{text}</Typography>
        <Typography sx={{ textAlign: "center", paddingX:"13%" }}>{desc}</Typography>
      </Grid>
      {/* <Grid
        item
        md={4}
        // sm={4}
        xs={12}
        sx={{ border: "2px solid red" }}
        justifyContent="center"
        display="flex"> */}
      {/* <Avatar alt="Cindy Baker" src={books1} sx={{ width: 80, height: 80 }} />{" "} */}
      {/* <Typography>jnndkcksdckkn</Typography>
      </Grid> */}
    </>
  );
}
export default AvatarDesc;