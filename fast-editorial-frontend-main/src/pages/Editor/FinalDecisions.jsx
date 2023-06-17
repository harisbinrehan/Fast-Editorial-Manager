import React, { useState, useContext, useEffect } from "react";
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Alert,
    AlertTitle,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import axios from "axios";
import { UserContext } from "../../context/Users/User";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link as RouterLink } from "react-router-dom";
const FinalDecisionTable = ({ manuscript }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));

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
                                        {name}
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
                <RouterLink
                    to={`/Editor/ReviewerDecisions/${manuscript.manuscript._id}`}
                    style={{ textDecoration: "none" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size={isXs ? "small" : "medium"}
                        sx={{ marginRight: "10px" }}

                    >
                        Show Reviewer's Decision
                    </Button>
                </RouterLink>
            </Box>

        </Card >
    );
};

const FinalDecision = () => {

    const { user } = useContext(UserContext);
    const editorId = user.editorId;
    const [manuscripts, setManuscripts] = useState([]);


    const fetchManuscripts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/editor/get-final-decisions/${editorId}`
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
                    <FinalDecisionTable key={index} manuscript={manuscript} />
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

export default FinalDecision;
