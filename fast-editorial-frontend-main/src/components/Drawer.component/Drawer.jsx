import React from "react";
import Box from "@mui/material/Box";
import { Drawer as DrawerMUI, Chip } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "../Avatar.component/Avatar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
const drawerWidth = 300;

const Drawer = (props) => {
  const [handleshowdrawer, setHandleshowdrawer] = useState(false);
  const location = useLocation();

  useEffect(() => {
    location.pathname.startsWith("/Author/main") ||
    location.pathname.startsWith("/Reviewer/main")|| location.pathname.startsWith("/Editor/main")
      ? setHandleshowdrawer(true)
      : setHandleshowdrawer(false);
  },[location.pathname]);
  // const container =
  //   window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      <DrawerMUI
        // container={container}
        variant="temporary"
        open={props.mobileOpen}
        onClose={props.handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          
        }}>
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 0.5 }}>{props.children}</Box>
      </DrawerMUI>
      {handleshowdrawer && (
        <DrawerMUI
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
            
            display: { xs: "none", sm: "none", md: "block" },
          }}>
          <Toolbar />
          <Box sx={{ overflow: "auto", mt: 0.5 }}>{props.children}</Box>
        </DrawerMUI>
      )}
    </>
  );
};

export default Drawer;
