import { Box, Grid, Typography } from "@mui/material";
import Image from "../../assets/aboutus.jpg";

const AboutUs = () => {
  return (
    <>
      <Grid container>
        <Grid item sm={2} lg={1} xs={2} md={1}>
          <Box component={"div"} minHeight={"40vh"} backgroundColor="#b9c1cc" />
        </Grid>
        <Grid
          item
          sm={10}
          xs={10}
          lg={6}
          md={6}
          pt={{ sm: 2, xs: 2, md: 5, lg: 10 }}
          pr={2}
          pl={{ lg: 20, md: 10, sm: 5, xs: 2 }}>
          <Typography variant={"h1"} display="flex" justifyContent={"start"}>
            About
          </Typography>
          <Typography
            mt={-2}
            variant={"h1"}
            display="flex"
            justifyContent={"start"}>
            Us
          </Typography>
          <Typography variant={"overline"} fontSize={15} align="start">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            optio, soluta ratione voluptatibus ipsum nam dolor quisquam
            similique laborum esse, libero fuga commodi ex expedita vel eveniet
            qui delectus adipisci.
          </Typography>
        </Grid>
        <Grid
          item
          sm={10}
          xs={10}
          lg={3.5}
          md={3.5}
          ml={{ sm: "auto", xs: "auto", lg: 0, md: 0 }}
          pl={{ sm: 5, xs: 2, md: 10, lg: 0 }}>
          <Box
            component={"img"}
            src={Image}
            height={"91.3vh"}
            width={"auto"}
          // minHeight={"100%"}
          // minWidth={"100%"}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default AboutUs;
