import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { Save as SaveIcon, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
const Dropzone = styled.div`
  width: 100%;
  border: 1px dashed #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 0px;
  cursor: pointer;
  font-size: 16px;
  color: #ccc;
  transition: border-color 0.2s ease-in-out;
  &:hover {
    border-color: #2196f3;
  }
`;
const names = [
    "Algorithms",
    "Artificial intelligence",
    "Computer architecture",
    "Computer graphics",
    "Computer networks",
    "Computer programming",
    "Computer security",
    "Computer vision",
    "Data mining",
    "Data science",
    "Database systems",
    "Distributed systems",
    "Human-computer interaction",
    "Information retrieval",
    "Machine learning",
    "Natural language processing",
    "Operating systems",
    "Robotics",
    "Software engineering",
    "Theory of computation",
];
const EditManuscriptDetails = () => {
    const location = useLocation();
    const manuscript = location.state.manuscript;
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"));
    const [editing, setEditing] = useState(false);
    const [editData, setEditData] = useState({ ...manuscript });
    const [previewUrls, setPreviewUrls] = useState({
        manuscript: manuscript.manuscript,
        authorPhoto: manuscript.authorPhoto,
    });
    const handleEditToggle = () => {
        setEditing(!editing);
    };

    const handleInputChange = (event) => {
        setEditData({ ...editData, [event.target.name]: event.target.value });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEditData({ ...editData, [event.target.name]: file });
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrls({ ...previewUrls, [event.target.name]: fileUrl });
        }
    };
    const handleFileDrop = (event, fileType) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            setEditData({ ...editData, [fileType]: file });
            const fileUrl = URL.createObjectURL(file);
            setPreviewUrls({ ...previewUrls, [fileType]: fileUrl });
        }
    };
    // const handleSave = () => {
    //     // Save edited data
    //     console.log(editData);
    //     setEditing(false);
    // };
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(editData);
        const formData = new FormData();

        // Add other form data fields
        formData.append("manuscriptId", editData._id);
        formData.append("title", editData.title);
        formData.append("abstract", editData.abstract);
        formData.append("minorfields", editData.minorfields);
        formData.append("majorfield", editData.majorfield);
        formData.append("correspondingAuthorName", editData.correspondingAuthorName);
        formData.append("correspondingAuthorPhone", editData.correspondingAuthorPhone);
        formData.append("correspondingAuthorEmail", editData.correspondingAuthorEmail);

        if (editData.manuscript) {
            formData.append("manuscript", editData.manuscript);
        }
        if (editData.authorPhoto) {
            formData.append("authorPhoto", editData.authorPhoto);
        }

        const response = await fetch("http://localhost:8000/author/update-manuscript", {
            method: "PUT",
            body: formData,
        });

        const result = await response.json();
        setEditing(false);
        console.log(result);
    };

    const renderFileUpload = (label, fileType) => {
        return (
            <Dropzone
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleFileDrop(e, fileType)}
            >
                <Typography color="#1565C0">
                    Drag and drop {fileType === "manuscript" ? "PDF" : "Image"} file here
                    <CloudUploadIcon style={{ marginLeft: "10px" }} />
                </Typography>
                <Typography variant="h6" color="#1565C0">
                    OR
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>File Name:</strong> {editData[fileType]?.name}
                </Typography>
                <label htmlFor={`${fileType}FileInput`}>
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        style={{ margin: "8px" }}
                    >
                        {label}
                    </Button>
                    <input
                        type="file"
                        name={fileType}
                        id={`${fileType}FileInput`}
                        onChange={handleFileUpload}
                        accept={fileType === "manuscript" ? ".pdf" : "image/*"}
                        style={{ display: "none" }}
                    />
                </label>
            </Dropzone>
        );
    };
    const renderField = (label, value, name, multiline = false) => {
        if (editing && name !== "_id" && name !== "status" && name !== "editor") {
            return (
                <TextField
                    label={label}
                    value={value}
                    name={name}
                    onChange={handleInputChange}
                    fullWidth
                    multiline={multiline}
                    rows={multiline ? 4 : 1}
                    margin="dense"
                    variant="outlined"
                />
            );
        } else {
            return (
                <Typography variant="body1">
                    <strong>{label}:</strong> {value}
                </Typography>
            );
        }
    };
    const renderMinorFields = () => {
        if (editing) {
            return (
                <FormControl fullWidth margin="dense" variant="outlined" >
                    <InputLabel>Minor Fields</InputLabel>
                    <Select
                        multiple
                        label="Minor Fields"
                        name="minorfields"
                        value={editData.minorfields}
                        onChange={handleInputChange}
                        renderValue={(selected) => (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {names.map((name) => (
                            <MenuItem key={name} value={name}>
                                {name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        } else {
            return (
                <Typography variant="body1">
                    <strong>Minor Fields:</strong> {editData.minorfields && editData.minorfields.join(", ")}
                </Typography>
            );
        }
    };
    const renderReviewersComments = () => {
        return manuscript.commentsFromReviewer.map((comment, index) => (
            <Typography key={index} variant="body1" sx={{ mt: 1 }}>
                <strong>Reviewer {index + 1}:</strong> {comment}
            </Typography>
        ));
    };



    return (
        <Box>
            <Card elevation={3} sx={{ mx: "10px", my: "75px", p: "10px" }}>
                <CardContent>
                    <form onSubmit={handleSubmit} enctype="multipart/form-data">
                        {renderField("Manuscript ID", editData._id, "_id")}
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Editor's Comment:</strong> {editData.commentsFromEditor}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Reviewer Comments:</strong>
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Major Field : </strong>{editData.majorfield}
                        </Typography>

                        {renderReviewersComments()}
                        {renderField("Title", editData.title, "title")}
                        {renderField("Abstract", editData.abstract, "abstract", true)}


                        {renderMinorFields()}
                        {renderField("Corresponding Author Name", editData.correspondingAuthorName, "correspondingAuthorName")}
                        {renderField("Corresponding Author Email", editData.correspondingAuthorEmail, "correspondingAuthorEmail")}
                        {renderField("Corresponding Author Phone", editData.correspondingAuthorPhone, "correspondingAuthorPhone")}
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6} align="center">
                                <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                                    Manuscript
                                </Typography>
                                {editing ? (
                                    renderFileUpload("Upload Manuscript", "manuscript")
                                ) : (
                                    <iframe
                                        src={previewUrls.manuscript}
                                        width="100%"
                                        height="500px"
                                        title="Manuscript PDF"
                                        style={{ border: "1px solid black" }}
                                    />
                                )}
                            </Grid>
                            <Grid item xs={12} md={6} align="center">
                                <Typography variant="h6" align="center" sx={{ mt: 1 }}>
                                    Author Photo
                                </Typography>
                                {editing ? (
                                    renderFileUpload("Upload Author Photo", "authorPhoto")
                                ) : (
                                    <img
                                        src={previewUrls.authorPhoto}
                                        alt="Author"
                                        width="100%"
                                        style={{ display: "block", margin: "0 auto" }}
                                    />
                                )}
                            </Grid>

                        </Grid>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                            {editing ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon />}
                                    onClick={handleSubmit}
                                    sx={{ mx: 1 }}
                                >
                                    Save
                                </Button>
                            ) : (
                                <IconButton onClick={handleEditToggle} sx={{ mx: 1 }}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditManuscriptDetails;


