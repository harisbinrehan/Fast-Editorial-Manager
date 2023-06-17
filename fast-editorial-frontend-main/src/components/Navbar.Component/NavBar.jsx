import { Container, AppBar, Grid, Button } from "@mui/material";
import { useState } from "react";

const Navbar = (props) => {
  const [temp, setTemp] = useState(false);
  return (
    <>
      <AppBar {...props} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, marginBottom: "2px" }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          //   spacing={{ sm: 12, md: 0 }}
          sx={{
            // border: 2,
            // borderColor: "green",
            justifyContent: {
              sm: "space-between",
              md: "space-between",
              xs: "space-between",
            },
          }}>
          {props.children}
        </Grid>
      </AppBar>
    </>
  );
};

export default Navbar;
