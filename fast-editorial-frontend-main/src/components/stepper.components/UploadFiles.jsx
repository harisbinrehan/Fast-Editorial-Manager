import React, { useContext } from "react";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";

import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Input,
  Select,
  InputLabel,
  ListItemIcon,
  Grid,
  List,
  ListItemText,
  ListItem,
  Typography,
} from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Error from "@mui/icons-material/Error";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import styled from "styled-components";

const Dropzone = styled.div`
  width: 75%;
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

const FileUploader = () => {
  const {
    imageFile,
    imageFileName,
    setImageFile,
    setImageFileName,
    pdfFile,
    pdfFileName,
    setPdfFileName,
    setPdfFile,
    bioFile,
    bioFileName,
    setBioFileName,
    setBioFile,
    fileType,
    setFileType,
  } = useContext(ManuscriptContext);

  const handleFileSelect = (e) => {
    if (fileType === "pdf" && e.target.files[0].type === "application/pdf") {
      setPdfFile(e.target.files[0]);
      setPdfFileName(e.target.files[0].name);
    } else if (fileType === "bio" && (e.target.files[0].type === "application/pdf" || e.target.files[0].type === "application/msword" || e.target.files[0].type === "text/plain")) {
      setBioFile(e.target.files[0]);
      setBioFileName(e.target.files[0].name);
    } else if (fileType === "image" && (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/png")) {
      setImageFile(e.target.files[0]);
      setImageFileName(e.target.files[0].name);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    handleFileSelect({
      target: {
        files: e.dataTransfer.files,
      },
    });
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Box
              display="flex"
              alignItems={"center"}
              flexDirection="column"
              justifyContent={"center"}
              marginTop={3}
              marginBottom={2}>
              <Typography variant="h5" display={"flex"} textAlign={"center"}>
                Please upload the following documents:
              </Typography>
              <List
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "50px",
                }}>
                <ListItem sx={{ width: "320px" }}>
                  <ListItemIcon>
                    {imageFileName ? (
                      <CheckCircle
                        style={{ color: "green", marginLeft: "20px" }}
                      />
                    ) : (
                      <Error style={{ color: "red", marginLeft: "20px" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Author's Photo" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {pdfFileName ? (
                      <CheckCircle
                        style={{ color: "green", marginLeft: "20px" }}
                      />
                    ) : (
                      <Error style={{ color: "red", marginLeft: "20px" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Research Paper" />
                </ListItem>
                {/* <ListItem>
                  <ListItemIcon>
                    {bioFileName ? (
                      <CheckCircle
                        style={{ color: "green", marginLeft: "20px" }}
                      />
                    ) : (
                      <Error style={{ color: "red", marginLeft: "20px" }} />
                    )}
                  </ListItemIcon>
                  <ListItemText primary="Author Biography" />
                </ListItem> */}
              </List>
            </Box>
          </Grid>
        </Grid>

        <FormControl style={{ width: "200px", marginBottom: "20px" }}>
          <InputLabel htmlFor="fileTypeSelect">Select file type:</InputLabel>
          <Select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            input={<Input name="fileType" id="fileTypeSelect" />}>
            <MenuItem value="">
              <em>Select...</em>
            </MenuItem>
            <MenuItem value="pdf">Research Paper</MenuItem>
            <MenuItem value="image">Author's Photo</MenuItem>
            <MenuItem value="bio">Author Biography</MenuItem>
          </Select>
        </FormControl>

        {["pdf", "image", "bio"].map((type) => (
          fileType === type && (
            <Grid
              container
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}>
              <Dropzone
                className="dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}>
                <Box>
                  <Typography color="#1565C0">
                    Drag and drop {type.toUpperCase()} file here{""}
                    <CloudUploadIcon style={{ marginLeft: "10px" }} />
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="#1565C0">
                    OR
                  </Typography>
                </Box>
                <Box>
                  <label htmlFor={`${type}FileInput`}>
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ margin: "8px" }}>
                      Upload {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                    <input
                      type="file"
                      name={`${type}File`}
                      id={`${type}FileInput`}
                      onChange={handleFileSelect}
                      accept={type === 'pdf' ? '.pdf' : (type === 'image' ? '.jpg, .png, .gif' : '.pdf, .doc, .docx, .txt')}
                      style={{ display: "none" }}
                    />
                  </label>
                </Box>
                <Box>
                  {(type === 'pdf' ? pdfFile : (type === 'image' ? imageFile : bioFile)) && (
                    <Typography
                      variant="body2"
                      component="span"
                      style={{ margin: "8px" }}>
                      {type === 'pdf' ? pdfFileName : (type === 'image' ? imageFileName : bioFileName)}
                    </Typography>
                  )}
                </Box>
              </Dropzone>
            </Grid>
          )
        ))}
      </form>
    </>
  );
};

export default FileUploader;
