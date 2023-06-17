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
    useMediaQuery,
    Alert,
    AlertTitle,
    useTheme,
} from "@mui/material";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
import { UserContext } from "../../context/Users/User";
import DeclineDialog from "../../components/Editor.component/declinedialogue";
import PlagiarismDialogue from "../../components/Editor.component/plagiarismDialogue";
import EditorViewDetalsModal from "../../components/Editor.component/EditorViewDetalsModal";
const NewSubmissionTable = ({ manuscript }) => {
    // ...state and functions...
    const theme = useTheme();
    const { user } = useContext(UserContext);

    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [showAbstract, setShowAbstract] = useState(false);
    const [hideDecline, setHideDecline] = useState(false);
    const [hideCard, setHideCard] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleViewDetails = () => {
        // Set the state to open the modal
        setOpenModal(true);
    };

    const closeModal = () => {
        // Set the state to close the modal
        setOpenModal(false);
    };
    const handleViewAbstract = () => {
        setShowAbstract(!showAbstract);
    };

    const handleApprove = async () => {
        try {
            setHideDecline(true);
            const response = await axios.put(
                `http://localhost:8000/editor/accept-by-editor/${manuscript._id}`
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
    return !hideCard ? (
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
                                Date
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    color: "white"
                                }}
                            >
                                Author's Name
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
                    onClick={handleViewDetails}
                >
                    View Details
                </Button>

                <PlagiarismDialogue plagiarismReport={manuscript.plagReport} />
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
                    sx={{ marginRight: "10px", marginLeft: "10px" }}
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
                        {manuscript.abstract}
                    </Typography>
                </Card>
            )}
            <EditorViewDetalsModal open={openModal} handleClose={closeModal} manuscript={manuscript} />
        </Card>
    ) : null;
};

const NewSubmissions = () => {
    const { user } = useContext(UserContext);
    const editorId = user.editorId;
    const [manuscriptData, setManuscriptData] = useState([]);

    const fetchManuscripts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/editor/get-new-submissions/${editorId}`
            );
            if (response.data.status === "success") {
                setManuscriptData(response.data.data.manuscripts);
            }
        } catch (error) {
            console.error("Error fetching manuscripts", error);
        }
    };

    useEffect(() => {
        fetchManuscripts();
    }, []);
    return (
        <div>
            {manuscriptData.length > 0 ? (
                manuscriptData.map((manuscript, index) => (
                    <NewSubmissionTable key={index} manuscript={manuscript} />
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

export default NewSubmissions;

