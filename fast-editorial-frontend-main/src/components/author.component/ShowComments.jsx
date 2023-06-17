import React, { useState } from 'react';
import {
    Dialog,
    Typography,
    DialogTitle,
    Button,
    DialogContent,
    DialogActions
} from "@mui/material";
const ShowComments = ({ open, handleClose, editorComments, reviewerComments }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            aria-labelledby="comments-dialog"
        >
            <DialogTitle id="comments-dialog">Comments from Editor and Reviewers</DialogTitle>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    Editor:
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {editorComments}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Reviewers:
                </Typography>
                {reviewerComments.map((comment, index) => (
                    <Typography key={index} variant="body1" gutterBottom>
                        Reviewer {index + 1}: {comment}
                    </Typography>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default ShowComments