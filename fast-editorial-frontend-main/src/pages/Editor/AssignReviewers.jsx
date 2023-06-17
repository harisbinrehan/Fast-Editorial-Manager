import React, { useState, useContext, useEffect } from "react";
import AssignReviewersTable from "../../components/Editor.component/AssignReviewersTable";
import { UserContext } from "../../context/Users/User";
import axios from "axios";
import { AlertTitle, Alert, Box, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
const AssignReviewers = () => {

    const { user } = useContext(UserContext);
    const editorId = user.editorId;
    const [manuscriptData, setManuscriptData] = useState([]);

    const fetchManuscripts = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/editor/get-pending-for-review/${editorId}`
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
                    <AssignReviewersTable key={index} manuscript={manuscript} />
                ))
            ) : (
                <Box align="center">
                    <Alert
                        severity="info"
                        style={{ marginTop: '75px', marginBottom: '10px' }}
                    >
                        <AlertTitle>No Manuscript For Assigning Reviewer</AlertTitle>
                        You have no manuscript to assign reviewer.
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

export default AssignReviewers;

