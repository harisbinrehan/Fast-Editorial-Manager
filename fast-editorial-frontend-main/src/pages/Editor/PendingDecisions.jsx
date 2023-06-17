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
    useTheme,
    AlertTitle,
    Alert,
} from "@mui/material";
import { UserContext } from "../../context/Users/User";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { Check as CheckIcon, Close as CloseIcon, HourglassEmpty as HourglassEmptyIcon } from "@mui/icons-material";
import EditorModal from "../../components/Editor.component/EditorPendingModal";
const PendingDecisionTable = ({ manuscript }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [showAbstract, setShowAbstract] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const reviewers = manuscript.reviewerIDs.map((id, index) => ({
        id,
        name: manuscript.reviewerNames[index],
    }));
    const handleViewAbstract = () => {
        setShowAbstract(!showAbstract);
    };
    const renderReviewStatusIcon = (status) => {
        if (status === "onreq") {
            return <HourglassEmptyIcon color="action" />;
        } else if (status === "reject") {
            return <CloseIcon color="error" />;
        } else if (status === "pendingreview") {
            return <CheckIcon color="success" />;
        }
        return null;
    };
    return (
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
                                {manuscript.manuscript.minorfields && manuscript.manuscript.minorfields.join(", ")}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {new Date(manuscript.manuscript.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.reviewerNames.map((name, index) => (
                                    <div key={index}>
                                        {name} {renderReviewStatusIcon(manuscript.reviewStatuses[index])}
                                    </div>
                                ))}
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
                    variant="outlined"
                    color="primary"
                    size={isXs ? "small" : "medium"}
                    sx={{ marginRight: "10px" }}
                    onClick={handleOpenModal}
                >
                    Actions
                </Button>
                <EditorModal
                    open={modalOpen}
                    reviewers={reviewers}
                    manuscriptId={manuscript.manuscript._id}
                    handleClose={handleCloseModal}
                />
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

const PendingDecisions = () => {
    const { user } = useContext(UserContext);
    const editorId = user.editorId;
    // Replace this object with the actual data fetched from the API
    const [manuscripts, setManuscripts] = useState([]);


    const fetchManuscripts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/editor/get-pending-decisions/${editorId}`
            );
            setManuscripts(response.data);
        } catch (error) {
            console.error("Failed to fetch manuscripts", error);
        }
    };


    useEffect(() => {
        fetchManuscripts();
    }, []);
    return (
        <div>
            {manuscripts.length > 0 ? (
                manuscripts.map((manuscript, index) => (
                    < PendingDecisionTable key={index} manuscript={manuscript} />
                ))
            ) : (
                <Box align="center">
                    <Alert
                        severity="info"
                        style={{ marginTop: '75px', marginBottom: '10px' }}
                    >
                        <AlertTitle>No Pending Decisions Found</AlertTitle>
                        You have no Reviewers that has pending decision.
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

export default PendingDecisions;
