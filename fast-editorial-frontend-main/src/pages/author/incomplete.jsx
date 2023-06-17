import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/Users/User";
import { Link as RouterLink } from "react-router-dom";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";
import axios from "axios";
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Alert,
    AlertTitle,
    Box,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
const IncompleteSubmissionTable = ({ manuscript }) => {
    const { setManuscriptData } = useContext(ManuscriptContext);
    const handleClick = () => {
        setManuscriptData(manuscript);
    };
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Card sx={{ mt: "75px", mx: "10px", p: "10px" }} elevation={3}>
            <TableContainer>
                <Table>
                    <TableHead
                        elevation={3}
                        sx={{
                            backgroundImage: "linear-gradient(to bottom right, #1976D2, white)",
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
                                    fontWeight: "600"
                                }}
                            >
                                Manuscript ID
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    fontWeight: "600"
                                }}
                            >
                                Manuscript Title
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    fontWeight: "600"
                                }}
                            >
                                Manuscript Field
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    fontWeight: "600"
                                }}
                            >
                                Date
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    fontWeight: "600"
                                }}
                            >
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript._id}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.title ? manuscript.title : "Not yet filled"}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.minorfields.length > 0
                                    ? manuscript.minorfields.join(", ")
                                    : "Not yet filled"}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {new Date(manuscript.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell
                                sx={{ border: "1px solid #195a7e", lineHeight: "1rem" }}
                            >
                                {manuscript.status}
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
                    to="/Author/stepper"
                    style={{ textDecoration: "none" }}>
                    <Button
                        variant="outlined"
                        color="primary"
                        size={isXs ? "small" : "medium"}
                        sx={{ marginRight: "10px" }}
                        onClick={handleClick}
                    >
                        Complete Submission
                    </Button>
                </RouterLink>
            </Box>
        </Card>
    );
};
const IncompleteSubmission = () => {
    const { user } = useContext(UserContext);
    const [manuscriptData, setManuscriptData] = useState([]);
    useEffect(() => {
        const fetchManuscripts = async () => {
            const authorId = user.authorId;
            const response = await axios.get(`http://localhost:8000/author/incomplete-submissions/${authorId}`);
            setManuscriptData(response.data.data.manuscripts);
        };
        console.log(manuscriptData);
        fetchManuscripts();
    }, []);
    return (
        <div>
            {manuscriptData.length > 0 ? (
                manuscriptData.map((manuscript, index) => (
                    <IncompleteSubmissionTable key={index} manuscript={manuscript} />
                ))
            ) : (
                <Alert
                    severity="info"
                    style={{ marginTop: '75px', marginBottom: '10px' }}
                >
                    <AlertTitle>No Incomplete Submission Found</AlertTitle>
                    You have no incomplete manuscript submissions.
                </Alert>
            )}
        </div>
    );
};
export default IncompleteSubmission;
