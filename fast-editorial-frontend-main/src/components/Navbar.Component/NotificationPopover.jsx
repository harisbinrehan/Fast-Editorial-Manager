import React from "react";
import Popover from "@mui/material/Popover";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Divider from "@mui/material/Divider";
import axios from "axios";


const NotificationPopover = (props) => {
  const {
    anchorEl,
    open,
    onClose,
    notifications = [],
  } = props;
  const timeSince = (date) => {
    const now = new Date();
    const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;

    if (secondsPast < 60) {
      return parseInt(secondsPast) + "s ago";
    }
    if (secondsPast < 3600) {
      return parseInt(secondsPast / 60) + "m ago";
    }
    if (secondsPast <= 86400) {
      return parseInt(secondsPast / 3600) + "h ago";
    }
    if (secondsPast > 86400) {
      const day = parseInt(secondsPast / 86400);
      return day + "d ago";
    }
  };


  return (
    <Popover
      id="notification-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      sx={{ mt: 1 }}
    >
      <Box sx={{
        padding: 2, backgroundImage:
          "linear-gradient(to right,#243949,#517fa4)", color: "white"
      }}>
        <Typography variant="h6" component="div">
          Notifications
        </Typography>
      </Box>
      <List sx={{
        width: "100%",
        maxWidth: 300,
        bgcolor: "background.paper",
        maxHeight: 400, // Set a fixed maxHeight
        overflow: "auto", // Enable scrolling
      }}>
        {notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notification) => (
          <React.Fragment key={notification._id}>
            <ListItem
              alignItems="flex-end"
              onClick={() => props.markNotificationAsRead(notification._id)}
              sx={{ backgroundColor: notification.read ? "white" : "lightgray" }}
            >
              <NotificationsActiveIcon
                color="primary"
                sx={{ width: "40px", height: "30px", marginLeft: "-8px" }}
              />
              <ListItemText
                primary={notification.message}
                primaryTypographyProps={{ color: "primary" }}
                secondaryTypographyProps={{ color: "text.secondary" }}
                secondary={timeSince(notification.createdAt)}
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Popover>
  );
};

export default NotificationPopover;
