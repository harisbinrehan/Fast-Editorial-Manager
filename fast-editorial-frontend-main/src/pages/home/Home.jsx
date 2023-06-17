import React from "react";
import { red, green, blue } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import Logo from "../../assets/logoauthor.png";
import author from "../../assets/author.png";
import reviewer from "../../assets/reviewer.png";
import editor from "../../assets/editor.png";
import {
  Container,
  Grid,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import books1 from "../../assets/books1.jpg";
import { Typography } from "@mui/material";
import avatarplusdescinner from "./../../components/Homepage.component/avatarplusdescinner";
import AvatarDesc from "./../../components/Homepage.component/avatarplusdescinner";
// const MaxHeight = styled("div")(({ theme }) => ({
//   // width:"100%",
//   [theme.breakpoints.down("md")]: {
//     backgroundImage: `url(${books1})`,
//     // backgroundRepeat: "no-repeat",
//         backgroundSize: "cover",
//     width:"100%",
//     height: "86vh",
//     "&:hover": {
//       backgroundColor: "primary.main",
//       opacity: [0.9, 0.8, 0.7],
//     },
//   },
// }));
const Home = () => {
  return (
    <div>
      {/* <MaxHeight> */}
      <Box
        component="div"
        sx={{
          backgroundImage: `url(${books1})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          //   opacity: [0.9, 0.8, 0.7],
        }}
        //   sx={{
        //     width: "100%",
        //     height: "65vh",
        //     backgroundColor: "primary.dark",
        //     backgroundImage: `url(${books1})`,
        //     backgroundRepeat: "no-repeat",
        //     backgroundSize: "cover",
        //     "&:hover": {
        //       backgroundColor: "primary.main",
        //       opacity: [0.9, 0.8, 0.7],
        //     },
        //   }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            sx={{ pb: "5%" }} //border
          >
            <Grid
              item
              xs={12}
              display={"flex"}
              // justifyContent="center"
              // sx={{ border: 2, borderColor: "red" }}
            >
              <Box
                component="img"
                src={Logo}
                alt="Logo"
                display={"flex"}
                sx={{
                  height: 100,
                  marginY: 0.5,
                }}></Box>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h3"
                textAlign={"center"}
                color="white"
                sx={{ pt: "5%", paddingX: "15%", marginBottom: "1.5%" }}>
                Welcome To FAST Editorial Manager
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="body1"
                textAlign={"center"}
                color="white"
                sx={{ paddingX: "16%", paddingBottom: "2.5%" }}>
                If you want to build your career and your professional network,
                this is the community for you. With the tools made for
                discovering what's important to your work, connecting to
                technical communities and collaborating with people on ideas
                that can move technology forward, IEEE Collabratec will help you
                own your future.
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
      {/* </MaxHeight> */}
      {/* <ImageAvatars /> */}
      <Grid container justifyContent={"center"} marginTop="7px">
        <AvatarDesc
          text="Authors"
          desc="Authors can submit their manuscripts and supplemental files, act on revision requests and track
their manuscript status."
          photo={author}
        />
        <AvatarDesc
          text="Editor"
          desc="Editors can process submissions, utilize quality check tools, assign and manage reviewers and
set final disposition."
          photo={editor}
        />
        <AvatarDesc
          text="Reviewers"
          desc="Reviewers manage peer review, submit review commentary, rank the journals and receive
credits and contributions."
          photo={reviewer}
        />
      </Grid>
    </div>
  );
};
export default Home;
