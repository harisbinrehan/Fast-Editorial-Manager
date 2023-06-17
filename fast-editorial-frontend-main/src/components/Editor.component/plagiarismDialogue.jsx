// PlagiarismDialog.jsx

import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    DialogActions,
    Button,
    Box,
    Chip,
    Divider,
} from "@mui/material";

const PlagiarismDialog = ({ plagiarismReport }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" color="error" onClick={handleClickOpen}>
                View Plagiarism Report
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Plagiarism Report</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom variant="h6">
                        Document Details:
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography gutterBottom>
                            Total Words: {plagiarismReport.scannedDocument.totalWords}
                        </Typography>
                        <Typography gutterBottom>
                            Filename: {plagiarismReport.scannedDocument.metadata.filename}
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>

                        <Typography gutterBottom>
                            Identical Words: {plagiarismReport.results.score.identicalWords}
                        </Typography>
                        <Typography gutterBottom>
                            Related Meaning Words: {plagiarismReport.results.score.relatedMeaningWords}
                        </Typography>

                    </Box>
                    <Box display="flex" justifyContent="space-between" mb={2}>

                        <Typography gutterBottom>
                            Minor Changed Words: {plagiarismReport.results.score.minorChangedWords}
                        </Typography>
                        <Typography gutterBottom>
                            Total Identical Words: {plagiarismReport.results.score.identicalWords + plagiarismReport.results.score.relatedMeaningWords + plagiarismReport.results.score.minorChangedWords}
                        </Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Typography gutterBottom variant="h6">
                        Score Details:
                    </Typography>
                    <Box display="flex" justifyContent="center" mb={2}>
                        <Typography gutterBottom fontWeight={"500"}>
                            Similarity Index: {plagiarismReport.results.score.aggregatedScore}
                        </Typography>
                    </Box>
                    <Divider variant="middle" />
                    <Typography gutterBottom variant="h6">
                        Sources of Plagiarism:
                    </Typography>
                    {plagiarismReport.results.internet.map((source, index) => (
                        <Box key={index} my={2}>
                            <Typography gutterBottom>
                                URL:
                                <a href={source.url} target="_blank" rel="noreferrer">
                                    {source.url}
                                </a>
                            </Typography>
                            <Chip label={`Score: ${source.identicalWords + source.similarWords + source.paraphrasedWords}`} color="primary" />
                            <Typography gutterBottom>
                                Title: {source.title}
                            </Typography>
                            <Typography gutterBottom>
                                Introduction: {source.introduction}
                            </Typography>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PlagiarismDialog;
