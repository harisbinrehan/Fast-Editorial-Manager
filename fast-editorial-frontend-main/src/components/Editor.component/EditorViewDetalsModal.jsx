import React from 'react';
import { Typography, Box, Button, Modal, Link, Chip, Card, CardContent, Grid, Divider, List, ListItem, CardHeader } from '@mui/material';

const EditorViewDetailsModal = ({ open, handleClose, manuscript }) => {
    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Card sx={{ width: '70%', maxHeight: '90vh', overflowY: 'scroll', padding: 2, backgroundColor: '#fff', margin: 'auto', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'absolute', borderRadius: 2 }}>
                <CardHeader title="Manuscript Details" Align={"center"} />
                <Divider variant="middle" />
                <CardContent>
                    <Grid container spacing={3} >
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Title:</Typography>
                            <Typography variant="body2">{manuscript.title}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Abstract:</Typography>
                            <Typography variant="body2">{manuscript.abstract}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Major Field:</Typography>
                            <Typography variant="body2">{manuscript.majorfield}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Minor Fields:</Typography>
                            {manuscript.minorfields.map(minorField => (
                                <Chip label={minorField} sx={{ marginRight: 1, marginBottom: 1 }} />
                            ))}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Additional Comments:</Typography>
                            <List>
                                {manuscript.additionalComments.filter(comment => comment).map((comment, index) => (
                                    <ListItem key={index}>
                                        <Typography variant="body2">{comment}</Typography>
                                    </ListItem>
                                ))}
                            </List>
                        </Grid>
                        <Grid item xs={12} justifyContent={"center"}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Manuscript:</Typography>
                            <Link href={manuscript.manuscript} target="_blank" rel="noopener noreferrer">View Manuscript</Link>
                        </Grid>
                        <Grid item xs={12} justifyContent={"center"}>
                            <Typography variant="h5" Align={"center"}>Author Details</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Author Photo:</Typography>
                            <Link href={manuscript.authorPhoto} target="_blank" rel="noopener noreferrer">View Photo</Link>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Author Biography:</Typography>
                            <Link href={manuscript.authorBiography} target="_blank" rel="noopener noreferrer">View Biography</Link>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Corresponding Author:</Typography>
                            <Typography variant="body2">{manuscript.correspondingAuthorName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Corresponding Author Email:</Typography>
                            <Typography variant="body2">{manuscript.correspondingAuthorEmail}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>Corresponding Author Phone:</Typography>
                            <Typography variant="body2">{manuscript.correspondingAuthorPhone}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 1 }}>
                    <Button onClick={handleClose} >Close</Button>
                </Box>

            </Card>
        </Modal>
    );
};

export default EditorViewDetailsModal;
