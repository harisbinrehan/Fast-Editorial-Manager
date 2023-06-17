import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Input,
  Select,
  InputLabel,
  Grid,
  Typography,
  Container,
  TextField,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { maxWidth } from "@mui/system";
import { ManuscriptContext } from "../../context/Manuscript/Manuscript";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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
const fields = [
  'Computer Science',
  'Civil Engineering',
  'Electrical Engineering',
  'Business',
];

function getStyles(name, minorfields, theme) {
  return {
    fontWeight:
      minorfields.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const FillForm = () => {
  // const options = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];
  const {
    imageFileName,
    title,
    setTitle,
    correspondingAuthorName,
    setCorrespondingAuthorName,
    correspondingAuthorEmail,
    setCorrespondingAuthorEmail,
    correspondingAuthorPhoneNumber,
    setCorrespondingAuthorPhoneNumber,
    abstract,
    setAbstract,
    minorfields,
    setMinorFields,
    majorFields,
    setMajorFields
  } = useContext(ManuscriptContext);
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleCorrespondingAuthorNameChange = (event) => {
    setCorrespondingAuthorName(event.target.value);
  };

  const handleCorrespondingAuthorEmailChange = (event) => {
    setCorrespondingAuthorEmail(event.target.value);
  };

  const handleCorrespondingAuthorPhoneNumberChange = (event) => {
    setCorrespondingAuthorPhoneNumber(event.target.value);
  };
  const handlemajorChange = (event) => {
    setMajorFields(event.target.value);
  };
  const handleAbstractChange = (event) => {
    setAbstract(event.target.value);
    console.log(event.target.value);
  };
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handlefieldChange = (event) => {
    const {
      target: { value },
    } = event;
    setMinorFields(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <>
      <Container>
        <Grid
          container
          // sx={{ border: "2px solid red" }}
          justifyContent={"center"}
          alignItems={"center"}>
          <Grid item md={12} sm={12} xs={12} marginTop={3} marginBottom={2}>
            <Typography variant="h5" textAlign={"center"}>
              Please fill out the information for your Document
            </Typography>
          </Grid>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="major-field-select-label">Major Field</InputLabel>
            <Select
              labelId="major-field-select-label"
              id="major-field-select"
              value={majorFields}
              label="Major Field"
              onChange={handlemajorChange}
            >
              {fields.map((field) => (
                <MenuItem key={field} value={field}>
                  {field}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">
              Select the Relevent Fields
            </InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={minorfields}
              onChange={handlefieldChange}
              input={
                <OutlinedInput
                  id="select-multiple-chip"
                  label="Select the Relevent Fields"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}>
              {names.map((name) => (
                <MenuItem
                  key={name}
                  value={name}
                  style={getStyles(name, minorfields, theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Container>
      <Grid
        container
        alignItems="center"
        alignContent="center"
        justifyContent={"center"}>
        <Grid item container md={12} justifyContent={"center"}>
          <Grid item md={12} sm={12} xs={12} margin={1}>
            <Typography variant="h6" textAlign={"center"}>
              Please fill in the general details
            </Typography>
          </Grid>
          <Grid item md={3} sm={6} xs={12} sx={{ margin: "8px" }}>
            <TextField
              label="Title"
              fullWidth
              onChange={handleTitleChange}
              value={title}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12} sx={{ margin: "8px" }}>
            <TextField
              value={correspondingAuthorName}
              label="Corresponding Author Name"
              fullWidth
              onChange={handleCorrespondingAuthorNameChange}
            />
          </Grid>
        </Grid>
        <Grid item container md={12} justifyContent={"center"}>
          <Grid item md={3} sm={6} xs={12} sx={{ margin: "8px" }}>
            <TextField
              value={correspondingAuthorEmail}
              label="Corresponding Author Email"
              fullWidth
              onChange={handleCorrespondingAuthorEmailChange}
            />
          </Grid>
          <Grid item md={3} sm={6} xs={12} sx={{ margin: "8px" }}>
            <TextField
              value={correspondingAuthorPhoneNumber}
              label="Corresponding Author Phone Number"
              fullWidth
              onChange={handleCorrespondingAuthorPhoneNumberChange}
            />
          </Grid>
        </Grid>
        <Grid container item md={12} justifyContent={"center"}>
          <Grid item md={6.12} sm={8} xs={12} sx={{ margin: "8px" }}>
            <TextField
              label="Abstract"
              value={abstract}
              multiline
              rows={4}
              fullWidth
              onChange={handleAbstractChange}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FillForm;
