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
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/Users/User";
import axios from "axios";
import { Link as RouterLink } from "react-router-dom";
const SubmissionNeedingRevisionTable = ({ manuscript }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [showAbstract, setShowAbstract] = useState(false);
    const navigate = useNavigate();

    const handleShowDecision = () => {
        navigate("/Author/Show-decision", { state: { manuscript: manuscript } });
    };


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
                                Decision Date
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: "1px solid #195a7e",
                                    fontSize: "18px",
                                    lineHeight: "1rem",
                                    fontWeight: "600"
                                }}
                            >
                                Editor's Name
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody
                    >
                        <TableRow >
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
                                {manuscript.editor.user.firstName}{" "}  {manuscript.editor.user.lastName
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
                    sx={{
                        marginRight: "10px",
                        transition: "0.3s",
                        "&:hover": {
                            backgroundColor: "#4A93DC",
                            color: "white",
                        },
                    }}
                    onClick={handleShowDecision}
                >
                    Show Decision
                </Button>
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
const SubmissionNeedingRevision = () => {
    const { user } = useContext(UserContext);
    const authorId = user.authorId;
    console.log(authorId);
    const [manuscripts, setManuscripts] = useState([]);

    useEffect(() => {
        const fetchManuscripts = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/author/submissions-needing-revision/${authorId}`
                );
                setManuscripts(response.data.manuscripts);
            } catch (error) {
                console.error("Failed to fetch manuscripts:", error);
            }
        };

        fetchManuscripts();
    }, [authorId]);



    return (
        <div>
            {manuscripts.length > 0 ? (
                manuscripts.map((manuscript, index) => (
                    < SubmissionNeedingRevisionTable key={index} manuscript={manuscript} />
                ))
            ) : (
                <Box align="center">
                    <Alert
                        severity="info"
                        style={{ marginTop: '75px', marginBottom: '10px' }}
                    >
                        <AlertTitle>Not Found</AlertTitle>
                        You have no submissions needing revisions.
                    </Alert>
                    <RouterLink
                        to="/Author/main"
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

export default SubmissionNeedingRevision;
