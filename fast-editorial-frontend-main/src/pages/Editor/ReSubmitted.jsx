import React, { useState, useContext, useEffect } from "react";
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
    Grid,
    useMediaQuery,
    useTheme,
    Alert,
    AlertTitle,
} from "@mui/material";
import { UserContext } from "../../context/Users/User";
import DeclineDialog from "../../components/Editor.component/declinedialogue";
import AssignRevManually from "../../components/Editor.component/AssignRevManually";
import { Link as RouterLink } from "react-router-dom";
import ReviewerCard from "../../components/Editor.component/Reviewercard";
import axios from "axios";
const ReSubmittedPapersTable
    = ({ manuscript }) => {
        const theme = useTheme();
        const { user } = useContext(UserContext);
        const isXs = useMediaQuery(theme.breakpoints.down("sm"));
        const [showAbstract, setShowAbstract] = useState(false);
        const [hideDecline, setHideDecline] = useState(false);
        const [hideCard, setHideCard] = useState(false);

        const handleViewAbstract = () => {
            setShowAbstract(!showAbstract);
        };
        const handleApprove = async () => {
            try {
                setHideDecline(true);
                const response = await axios.put(
                    `http://localhost:8000/editor/final-accept-by-editor/${manuscript._id}`
                );
                if (response.data.message === 'Manuscript accepted and status updated to pendingReview') {
                    // setHideCard(true);
                } else {
                    // Handle any error messages here
                    console.error('Error updating manuscript status:', response.data.error);
                }
            } catch (error) {
                console.error('Error updating manuscript status:', error);
            }
        };
        const hideThisCard = () => {
            setHideCard(true);
            // Implement your logic for handling decline here
        };
        const openInNewTab = (url) => {
            const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
            if (newWindow) newWindow.opener = null;
        };
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
        const [showReviewers, setShowReviewers] = useState(false);
        const [showManualReviewerForm, setShowManualReviewerForm] = useState(false);
        const handleAssignReviewer = () => {
            setShowReviewers(!showReviewers);
        };
        const handleManualReviewerForm = () => {
            setShowManualReviewerForm(!showManualReviewerForm);
        };
        return !hideCard ? (
            <Card sx={{ mt: "75px", mx: "10px", p: "10px" }} elevation={3}>
                <TableContainer>
                    <Table>
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
                                        color: "white",
                                    }}
                                >
                                    Manuscript ID
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #195a7e",
                                        fontSize: "18px",
                                        lineHeight: "1rem",
                                        color: "white",
                                    }}
                                >
                                    Manuscript Title
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #195a7e",
                                        fontSize: "18px",
                                        lineHeight: "1rem",
                                        color: "white",
                                    }}
                                >
                                    Manuscript Field
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #195a7e",
                                        fontSize: "18px",
                                        lineHeight: "1rem",
                                        color: "white",
                                    }}
                                >
                                    Decision Date
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: "1px solid #195a7e",
                                        fontSize: "18px",
                                        lineHeight: "1rem",
                                        color: "white",
                                    }}
                                >
                                    Reviewer's Name
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
                                    {manuscript.minorfields && manuscript.minorfields.join(", ")}
                                </TableCell>
                                <TableCell
                                    sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                                >
                                    {new Date(manuscript.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell
                                    sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                                >
                                    {manuscript.author.user.firstName}{" "}  {manuscript.author.user.lastName
                                    }
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
                        onClick={() => openInNewTab(manuscript.manuscript)}
                    >
                        View Manuscript
                    </Button>
                    {/* <Button
                    variant="outlined"
                    color="primary"
                    size={isXs ? "small" : "medium"}
                    sx={{ marginRight: "10px" }}
                    onClick={() => openInNewTab(manuscript.authorPhoto)}
                >
                    View Photo
                </Button> */}
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
                        sx={{ marginLeft: "10px", marginRight: "10px" }}
                        onClick={handleAssignReviewer}
                    >
                        Reviewer Reccomendations
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size={isXs ? "small" : "medium"}
                        sx={{ marginRight: "10px" }}
                        onClick={handleApprove}
                    >
                        Approve
                    </Button>
                    {!hideDecline && (
                        <DeclineDialog
                            manuscript={manuscript}
                            user={user}
                            onDecline={() => setHideCard(true)}
                            hideThisCard={hideThisCard}
                        />
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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sit
                            amet iaculis diam, ac suscipit neque. Suspendisse potenti. Vivamus
                            eleifend magna vel ante maximus, sit amet sollicitudin turpis
                            blandit. Duis in tellus ac tellus rhoncus egestas. Nunc malesuada
                            augue vitae lectus rhoncus, id eleifend nulla dapibus. Phasellus
                            vestibulum malesuada mi sit amet gravida. Sed id velit purus. Duis
                            ac lorem eu turpis commodo efficitur. In hac habitasse platea
                            dictumst. Ut porta blandit mi, at convallis metus commodo non. Sed
                            ut nisi non tortor efficitur euismod vel sed risus. Donec
                            pellentesque vulputate ex, id porttitor enim aliquet in.
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
        ) : null;
    };

const ReSubmittedPapers = () => {
    const { user } = useContext(UserContext);
    const [manuscriptData, setManuscriptData] = useState([]);
    useEffect(() => {
        axios
            .get(`http://localhost:8000/editor/get-changes-done/${user.editorId}`)
            .then((res) => {
                setManuscriptData(res.data.manuscripts);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    return (
        <div>
            {manuscriptData.length > 0 ? (
                manuscriptData.map((manuscript, index) => (
                    <ReSubmittedPapersTable
                        key={index} manuscript={manuscript} />
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
                        to="/Editor/main"
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

export default ReSubmittedPapers;
