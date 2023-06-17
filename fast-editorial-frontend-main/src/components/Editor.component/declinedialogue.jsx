// DeclineDialog.js

import React, { useState } from 'react';
import axios from 'axios';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';

const DeclineDialog = ({ manuscript, user, onDecline, hideThisCard }) => {
    const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
    const [editorComment, setEditorComment] = useState('');

    const handleDeclineDialogClose = () => {
        setDeclineDialogOpen(false);
    };

    const handleDeclineDialogSubmit = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8000/editor/reject-by-editor/${manuscript._id}`,
                {
                    commentsFromEditor: editorComment,
                    editorId: user.editorId,
                }
            );

            if (response.data.status === 'success') {
                onDecline();
            }
        } catch (error) {
            console.error('Error rejecting manuscript', error);
        }

        handleDeclineDialogClose();
        hideThisCard();
    };

    const handleDecline = () => {
        setDeclineDialogOpen(true);
    };

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                size="medium"
                onClick={handleDecline}
            >
                Decline
            </Button>

            <Dialog
                open={declineDialogOpen}
                onClose={handleDeclineDialogClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Decline Manuscript</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please provide a reason for rejecting the manuscript:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reason"
                        label="Reason"
                        type="text"
                        fullWidth
                        value={editorComment}
                        onChange={(e) => setEditorComment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeclineDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeclineDialogSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeclineDialog;
