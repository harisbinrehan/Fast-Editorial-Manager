import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Avatar,
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
    Grid,
} from "@mui/material";
import ReviewerCard from "./Reviewercard";
import AssignRevManually from "./AssignRevManually";

const AssignReviewersTable = ({ manuscript }) => {
    const [recommendedReviewers, setRecommendedReviewers] = useState([]);
    const fetchRecommendedReviewers = async () => {
        try {
            const response = await fetch(`http://localhost:8000/editor/recommend-reviewers/${manuscript._id}`);
            const data = await response.json();
            setRecommendedReviewers(data.recommendedReviewers);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRecommendedReviewers();
    }, []);
    // ...state and functions...
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [showAbstract, setShowAbstract] = useState(false);
    const [showReviewers, setShowReviewers] = useState(false);
    const [showManualReviewerForm, setShowManualReviewerForm] = useState(false);
    const handleViewAbstract = () => {
        setShowAbstract(!showAbstract);
    };
    const handleSendRequest = () => {
        // Handle sending the request here
    };
    const handleAssignReviewer = () => {
        setShowReviewers(!showReviewers);
    };
    const handleManualReviewerForm = () => {
        setShowManualReviewerForm(!showManualReviewerForm);
    };

    return (
        <Card sx={{ mt: "75px", mx: "10px", p: "10px" }} elevation={3}>
            <TableContainer >
                <Table >
                    <TableHead
                        elevation={3}
                        sx={{
                            backgroundColor: "#292E49",
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
                                    color: "white"
                                }}
                            >
                                Manuscript ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    color: "white"
                                }}
                            >
                                Manuscript Title
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    color: "white"
                                }}
                            >
                                Manuscript Field
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    color: "white"
                                }}
                            >
                                Invitation Date
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    color: "white"
                                }}
                            >
                                Editor's Name
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                        sx={{
                            // background: "linear-gradient(to right,#085078,#85D8CE)",
                            border: "3px solid #b8d1c6",
                            color: "white",
                        }}
                    >
                        <TableRow>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript._id}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.title}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.minorfields.join(", ")}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {new Date(manuscript.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.author.user.firstName} {manuscript.author.user.lastName}
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
                    onClick={handleViewAbstract}
                >
                    View Abstract
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    size={isXs ? "small" : "medium"}
                    onClick={handleManualReviewerForm}
                >
                    Assign Reviewer
                </Button>
                <Button
                    variant="outlined"
                    color="primary"
                    size={isXs ? "small" : "medium"}
                    sx={{ marginLeft: "10px" }}
                    onClick={handleAssignReviewer}
                >
                    Reviewer Reccomendations
                </Button>
            </Box>
            {/* ... abstract card components ... */}
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
                        {manuscript.abstract}
                    </Typography>
                </Card>
            )}
            {showManualReviewerForm && (
                <Grid container spacing={2} sx={{ marginTop: "20px" }} justifyContent={'center'}>

                    <AssignRevManually manuscriptId={manuscript._id} />
                </Grid>
            )}
            {showReviewers && (
                <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                    {recommendedReviewers.map((reviewer, index) => (
                        <ReviewerCard key={index} reviewer={reviewer} manuscriptId={manuscript._id} />
                    ))}
                </Grid>
            )}
        </Card>
    );
};
export default AssignReviewersTable;
