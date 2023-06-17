import React from "react";
import NavBar from "./NavBar";
import NavBarItems from "./NavBarItems";
import { Grid, Button, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../assets/logoauthor.png";
import { useState, useEffect, useContext } from "react";
import Avatar from "../Avatar.component/Avatar";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationPopover from "./NotificationPopover";
import lens from "../../assets/Lens.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { createSocket } from "../../socket";
import { UserContext } from "../../context/Users/User";
import axios from "axios";
const NavigationBarMain = (props) => {
  const { user } = props;
  // use local host to get user
  // const user = JSON.parse(localStorage.getItem('user'));
  // const { user } = useContext(UserContext);
  console.log("Current User ID:", user?._id);
  const navigate = useNavigate();
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const markNotificationAsRead = (notificationId) => {
    axios
      .post(`http://localhost:8000/notifications/${notificationId}/read`)
      .then((response) => {
        console.log(response.data.message);
        fetchNotifications();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    notifications.forEach((notification) => {
      if (!notification.read) {
        markNotificationAsRead(notification._id);
      }
    });
    setNotificationCount(0);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };
  const isAuthorAndReviewer = user && user?.authorId && user?.reviewerId;
  const switchDisabled = !isAuthorAndReviewer;
  const [displayswitch, setdisplayswitch] = useState(true);
  let location = useLocation();
  useEffect(() => {
    location.pathname.startsWith("/Editor")
      ? setdisplayswitch(false)
      : setdisplayswitch(true);
  }, [location.pathname]);
  const fetchNotifications = () => {
    axios

      .get(`http://localhost:8000/notifications/${user?._id}`)
      .then((response) => {
        setNotifications(response.data.notifications);
        const unreadNotifications = response.data.notifications.filter((notification) => !notification.read);
        setNotificationCount(unreadNotifications.length);
        // setNotificationCount(response.data.notifications.length);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);
  useEffect(() => {
    if (user?._id) {
      // console.log('USERRRRRRRRRR,', user._id);
      const socket = createSocket(user?._id);

      socket.connect();
      socket.emit("join", user?._id);
      // console.log("Socket connected for user:", user._id, 'with roles:', user.authorId, user.reviewerId);

      socket.on("notification", (newNotification) => {
        // console.log("Received notification:", newNotification);
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        setNotificationCount((prevCount) => prevCount + 1);
      });
      socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
        // Perform any necessary cleanup here
      });
      return () => {
        socket.disconnect();
      };
    }
  }, [user?._id, user?.reviewerId, user?.authorId]);
  // Update the dependency array


  const menuItems = [
    <Button size="large" variant="primary">
      About
    </Button>,
    <Button size="large" variant="primary">
      Contact Us
    </Button>,
    <Button size="large" variant="primary">
      Journal List
    </Button>,
    <RouterLink to="/SignIn" style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Sign In
      </Button>
    </RouterLink>,
    <RouterLink to="/Home" style={{ textDecoration: "none", color: "black" }}>
      <Button size="large" variant="primary">
        Logout
      </Button>
    </RouterLink>,
  ];
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const [switchcond, setswitchcond] = useState("Switch to Reviewer");
  useEffect(() => {
    if (user?.reviewerId && !user?.authorId) {
      setswitchcond("Switch to Author");
    } else if (!user?.reviewerId && user?.authorId) {
      setswitchcond("Switch to Reviewer");
    }
  }, [user]);
  const switchfunc = (event) => {
    if (event.target.checked === true) {
      setswitchcond("Switch to Author");
      navigate("/Reviewer/main");
    } else if (event.target.checked === false) {
      setswitchcond("Switch to Reviewer");
      navigate("/Author/main");
    }
  };
  function notificationsLabel(count) {
    if (count === 0) {
      return "no notifications";
    }
    if (count > 99) {
      return "more than 99 notifications";
    }
    return `${count} notifications`;
  }
  const items = [
    (displayswitch && <FormControlLabel
      control={
        <Switch name="OurSwitch" onChange={switchfunc} color="default" disabled={switchDisabled} />
      }
      label={switchcond}
    />),
    <IconButton
      aria-label={notificationsLabel(notificationCount)}
      onClick={handleNotificationClick}
    >
      <Badge badgeContent={notificationCount} color="secondary">
        <NotificationsIcon />
      </Badge>
    </IconButton>
    ,
    <Button
      id="demo-customized-button"
      // aria-controls={open ? "demo-customized-menu" : undefined}
      aria-haspopup="true"
      // aria-expanded={open ? "true" : undefined}
      variant="contained"
      disableElevation
      alignItems={"center"}
      onClick={handleOpenNavMenu}
      endIcon={<KeyboardArrowDownIcon />}>
      <Avatar sx={{ width: "30px", height: "30px" }} src={user?.profilePicture}>
        NA
      </Avatar>
    </Button>,
  ];
  const [anchorElNav, setAnchorElNav] = useState(null);

  return (
    <div>
      <NavBar position="fixed" color="primary">
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
              onClick={props.handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </NavBarItems>
        </Grid>
        <Grid
          item
          md={2}
          display={{ xs: "none", sm: "none", md: "flex" }}
          // justifyContent="center"
          sx={{ paddingLeft: "1%" }}>
          {/* border */}
          <RouterLink
            to="/Author/main"
            style={{ textDecoration: "none", color: "black" }}>
            <NavBarItems
              component="img"
              src={Logo}
              alt="Logo"
              display={"flex"}>

            </NavBarItems>
          </RouterLink>
        </Grid>
        {items.map((item) => {
          return (
            <Grid
              item
              md={2}
              display={{ sm: "flex", md: "flex" }}
              justifyContent="center"
            // sx={{ border: 2, borderColor: "red" }}
            >
              <NavBarItems
                component="div"
                display={{ xs: "flex", sm: "flex", md: "flex" }}>
                {item}
              </NavBarItems>
            </Grid>
          );
        })}
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
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: "block", md: "block" },
          }}>
          {menuItems.map((mItem) => {
            return <MenuItem>{mItem}</MenuItem>;
          })}
        </Menu>
      </NavBar>
      <NotificationPopover
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        notifications={notifications}
        fetchNotifications={fetchNotifications}
        markNotificationAsRead={markNotificationAsRead}
      />

    </div>
  );
};
export default NavigationBarMain;
