import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  AlertTitle,
  Alert,
} from "@mui/material";
import { UserContext } from "../../context/Users/User";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
const NewInvitations = ({ manuscript }) => {
  // ...state and functions...
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAbstract, setShowAbstract] = useState(false);
  const [hideDecline, setHideDecline] = useState(false);
  const [hideCard, setHideCard] = useState(false);

  const handleViewAbstract = () => {
    setShowAbstract(!showAbstract);
  };

  const handleApprove = async () => {
    setHideDecline(true);
    try {
      const response = await axios.patch('http://localhost:8000/reviewer/accept-request', {
        manuscriptId: manuscript.manuscript._id,
        reviewerId: manuscript.reviewer,
        editoruserId: manuscript.editor.user._id,
      });
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert('Failed to accept the request');
      }
    } catch (error) {
      console.error('Failed to accept the request:', error);
      alert('Failed to accept the request. Please try again.');
    }
  };

  const handleDecline = async () => {
    setHideCard(true);
    // console.log("THESE ARE THE IDSSS", manuscript.manuscript._id, manuscript.reviewer, manuscript.editor.user._id)
    try {
      const response = await axios.patch('http://localhost:8000/reviewer/reject-request', {
        manuscriptId: manuscript.manuscript._id,
        reviewerId: manuscript.reviewer,
        editoruserId: manuscript.editor.user._id,
      });
      if (response.status === 200) {
        alert(response.data.message);
      } else {
        alert('Failed to reject the request');
      }
    } catch (error) {
      console.error('Failed to decline the request:', error);
      alert('Failed to decline the request. Please try again.');
    }
  };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return !hideCard ? (
    <Card sx={{ mt: "75px", mx: "10px", p: "10px" }} elevation={3}>
      <TableContainer>
        <Table>
          <TableHead
            elevation={3}
            sx={{
              backgroundColor: "#489097",
              border: "3px solid #697796",
              height: "50px",
              lineHeight: "1rem",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  border: "1px solid #195a7e",
                  fontSize: "18px",
                  lineHeight: "1rem",
                }}
              >
                Manuscript ID
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #195a7e",
                  fontSize: "18px",
                  lineHeight: "1rem",
                }}
              >
                Manuscript Title
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #195a7e",
                  fontSize: "18px",
                  lineHeight: "1rem",
                }}
              >
                Manuscript Field
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #195a7e",
                  fontSize: "18px",
                  lineHeight: "1rem",
                }}
              >
                Invitation Date
              </TableCell>
              <TableCell
                sx={{
                  border: "1px solid #195a7e",
                  fontSize: "18px",
                  lineHeight: "1rem",
                }}
              >
                Editor's Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody
            sx={{
              background: "linear-gradient(to right,#A5B5D4,#E3EFE8)",
              border: "3px solid #b8d1c6",
            }}
          >
            <TableRow>
              <TableCell
                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
              >
                {manuscript.manuscript._id}
              </TableCell>
              <TableCell
                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
              >
                {manuscript.manuscript.title}
              </TableCell>
              <TableCell
                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
              >
                {manuscript.manuscript.minorfields.join(", ")}
              </TableCell>
              <TableCell
                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
              >
                {new Date(manuscript.date).toLocaleDateString()}
              </TableCell>
              <TableCell
                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
              >
                {manuscript.editor.user.firstName} {manuscript.editor.user.lastName}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size={isXs ? "small" : "medium"}
          sx={{ marginRight: "10px" }}
          onClick={() => openInNewTab(manuscript.manuscript.manuscript)}
        >
          View Manuscript
        </Button>
        <Button
          variant="outlined"
          color="primary"
          size={isXs ? "small" : "medium"}
          sx={{ marginRight: "10px" }}
          onClick={handleViewAbstract}
        >
          View Abstract
        </Button>
        {!hideDecline && (
          <Button
            variant="contained"
            color="primary"
            size={isXs ? "small" : "medium"}
            sx={{ marginRight: "10px" }}
            onClick={handleApprove}
          >
            Approve
          </Button>
        )}
        {!hideDecline && (
          <Button
            variant="contained"
            color="secondary"
            size={isXs ? "small" : "medium"}
            onClick={handleDecline}
          >
            Decline
          </Button>
        )}
      </Box>
      {showAbstract && (
        <Card
          elevation={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginY: "10px",
          }}
        >
          <Typography variant="h6" textAlign={"center"} color="#1565C0">
            Abstract
          </Typography>
          <Typography
            variant="body"
            sx={{ paddingX: "10px", paddingBottom: "10px" }}
          >
            {manuscript.manuscript.abstract}
          </Typography>
        </Card>
      )}
    </Card>
  ) : null;
};

const ReviewerInvitations = () => {
  const { user } = useContext(UserContext);
  const reviewerId = user.reviewerId;
  // console.log(reviewerId);
  // Replace this object with the actual data fetched from the API
  const [manuscripts, setManuscripts] = useState([]);
  // Replace this object with the actual data fetched from the API
  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/reviewer/get-review-requests/${reviewerId}`
        );
        if (response.data.status === "success") {
          setManuscripts(response.data.data.reviews);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchReviewRequests();
  }, [reviewerId]);

  return (

    <div>
      {manuscripts.length > 0 ? (
        manuscripts.map((manuscript, index) => (
          <NewInvitations key={index} manuscript={manuscript} />
        ))
      ) : (
        <Box align="center">
          <Alert
            severity="info"
            style={{ marginTop: '75px', marginBottom: '10px' }}
          >
            <AlertTitle>No New Submission Found</AlertTitle>
            You have no New Manuscript submissions.
          </Alert>
          <RouterLink
            to="/Reviewer/main"
            style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginBottom: '10px' }}
            >
              Go Back To Main
            </Button>
          </RouterLink>
        </Box>
      )}
    </div>
  );
};

export default ReviewerInvitations;

