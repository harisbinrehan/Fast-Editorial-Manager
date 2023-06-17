import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../../context/Users/User';

const EditorModal = ({ open, reviewers, manuscriptId, handleClose }) => {
    const { user } = useContext(UserContext);
    const editorId = user.editorId;

    const handlePing = async (type, reviewerId) => {
        const url = `http://localhost:8000/editor/ping-reviewer`;
        const data = { manuscriptId, reviewerId, editorId };

        try {
            const response = await axios.post(url, data);
            if (response.status === 200) {
                alert(`Reviewer has been successfully pinged!`);
            }
            handleClose();
        } catch (error) {
            console.error(`Failed to ${type} review`, error);
        }
    };
    const handleReject = async (type, reviewerId) => {
        const url = `http://localhost:8000/editor/reject-review`;
        const data = { manuscriptId, reviewerId, editorId };

        try {
            const response = await axios.patch(url, data);
            if (response.status === 200) {
                alert(`Reviewer has been successfully rejected!`);
            }
            handleClose();
        } catch (error) {
            console.error(`Failed to ${type} review`, error);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Reviewer Actions</DialogTitle>
            <DialogContent>
                {reviewers.map((reviewer, index) => (
                    <Box
                        key={index}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography style={{ marginRight: '1rem' }}>{reviewer.name}</Typography>
                        <Box>
                            <Button
                                variant="outlined"
                                onClick={() => handlePing('ping', reviewer.id)}
                                color="success"
                                mr={2}
                                sx={{ marginRight: '.5rem' }}
                            >
                                Ping Reviewer
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => handleReject('reject', reviewer.id)}
                                color="error"
                            >
                                Reject Reviewer
                            </Button>
                        </Box>
                    </Box>
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

export default EditorModal;
