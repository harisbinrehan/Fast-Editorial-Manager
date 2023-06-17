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
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../context/Users/User"
const PendingReview = ({ manuscript }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [showAbstract, setShowAbstract] = useState(false);
  //   const history = useHistory();

  const handleViewAbstract = () => {
    setShowAbstract(!showAbstract);
  };

  //   const handleStartReview = () => {
  //     history.push("/startreview"); // Update the route according to your routing setup
  //   };
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };
  return (
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
        <RouterLink
          to={`/Reviewer/StartReview/${manuscript.manuscript._id}`}
          style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            size={isXs ? "small" : "medium"}
          //   onClick={handleStartReview}
          >

            Start Review
          </Button>
        </RouterLink>
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
  );
};

const PendingReviews = () => {
  // Replace this object with the actual data fetched from the API
  const { user } = useContext(UserContext);
  const reviewerId = user.reviewerId;
  const [manuscripts, setManuscripts] = useState([]);
  // Replace this object with the actual data fetched from the API
  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/reviewer/get-pending-reviews/${reviewerId}`
        );
        if (response.data.status === "success") {
          setManuscripts(response.data.data.reviews);
          console.log(response.data.data.reviews);
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
          <PendingReview key={index} manuscript={manuscript} />
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

export default PendingReviews;
