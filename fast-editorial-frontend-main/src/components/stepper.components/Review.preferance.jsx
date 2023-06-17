import React, { useState, useContext } from "react";
import axios from 'axios';
import {
  Typography,
  Grid,
  TextField,
  Button,
  Checkbox,
  Select,
  InputLabel,
  Container,
  Chip,
  OutlinedInput,
  FormControl,
  Box,
  MenuItem,
  Card,
  CardContent
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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
function getStyles(name, fieldNames, theme) {
  return {
    fontWeight:
      fieldNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const saveReviewerToDatabase = async (reviewer) => {
  try {
    console.log('Saving reviewer:', reviewer)
    const response = await axios.post(
      'http://localhost:8000/author/recommend-reviewers', // Replace with your backend API URL
      reviewer
    );
    console.log(response.data);
  } catch (error) {
    console.error('Error saving reviewer:', error);
  }
};
const Reviewpref = () => {
  const [checked, setChecked] = useState(false);
  const theme = useTheme();

  //  const [reviewers, setReviewers] = useState([]);
  const [name, setname] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [degree, setdegree] = useState("");
  const [position, setposition] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [department, setdepartment] = useState("");
  const [minorFields, setMinorFields] = useState([]);
  const [majorField, setMajorFields] = useState("");
  const [email, setemail] = useState("");
  const { reviewers = [], setReviewers, manuscriptId, setManuscriptId } = useContext(ManuscriptContext);
  console.log(reviewers)
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleAdd = () => {
    if (
      name !== "" &&
      // firstName !== "" &&
      // lastName !== "" &&
      degree !== "" &&
      position !== "" &&
      organisation !== "" &&
      department !== "" &&
      email !== "" &&
      minorFields.length > 0 &&
      majorField.length !== ""
    ) {
      const newReviewer = {
        name: name,
        manuscript: manuscriptId,
        // firstName: firstName,
        // lastName: lastName,
        degree: degree,
        position: position,
        organisation: organisation,
        department: department,
        email: email,
        majorField: majorField,
        minorFields: minorFields,
      };
      setReviewers([...reviewers, newReviewer]);
      saveReviewerToDatabase(newReviewer);
      setname("");
      setdegree("");
      setposition("");
      setOrganisation("");
      setdepartment("");
      setemail("");
      setMinorFields([]);
      setMajorFields("");

    }

  };
  const handlemajorChange = (event) => {
    setMajorFields(event.target.value);
  };
  const handlefieldChange = (event) => {
    const {
      target: { value },
    } = event;
    setMinorFields(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  }
  const isDisabled =
    !name || !degree || !position || !organisation || !department || !email || !majorField || !minorFields.length > 0;
  return (
    <>
      <Container>
        <Typography variant={"h5"} textAlign={"center"} margin={2}>
          Select if you Want to Reccomend Reviewers?{" "}
          <Checkbox checked={checked} onChange={handleChange} />
        </Typography>

        {checked && (
          <Grid container spacing={2}>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(event) => setname(event.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Degree"
                fullWidth
                value={degree}
                onChange={(event) => setdegree(event.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Position"
                fullWidth
                value={position}
                onChange={(event) => setposition(event.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Organisation"
                fullWidth
                value={organisation}
                onChange={(event) => setOrganisation(event.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={department}
                onChange={(event) => setdepartment(event.target.value)}
              />
            </Grid>
            <Grid item md={4} xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={email}
                onChange={(event) => setemail(event.target.value)}
              />
            </Grid>
            <Grid item container md={12} sm={12} justifyContent={"center"}>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="major-field-select-label">Major Field</InputLabel>
                <Select
                  labelId="major-field-select-label"
                  id="major-field-select"
                  value={majorField}
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
                  value={minorFields}
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
                      style={getStyles(name, minorFields, theme)}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              md={12}
              sm={12}
              xs={12}
              display={"flex"}
              justifyContent={"center"}
              marginBottom={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAdd}
                disabled={isDisabled}>
                Add
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid container justifyContent={'center'}>
          {reviewers.map((reviewer) => {
            return (
              <Grid xs={12} sm={5.9} md={3.9} sx={{ mr: "5px", mb: "5px" }}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography>
                      <strong style={{ color: "blue" }}>Name:</strong>  {reviewer.name} {reviewer.firstName} {reviewer.lastName}
                    </Typography>
                    {/* <Typography variant="h6" color="primary">
                     
                    </Typography> */}
                    <Typography>
                      <strong style={{ color: "blue" }}>Degree:</strong> {reviewer.degree}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Position:</strong> {reviewer.position}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Department:</strong> {reviewer.department}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Organisation:</strong> {reviewer.organisation}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Email:</strong> {reviewer.email}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Major Field:</strong> {reviewer.majorField}
                    </Typography>
                    <Typography>
                      <strong style={{ color: "blue" }}>Minor Fields:</strong>
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {reviewer.minorFields.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
};
export default Reviewpref;
