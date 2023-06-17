import React, { useState, useCallback } from "react";
import signinbg from "../../assets/signinbg.jpg";
import logo from "../../assets/fem-logo.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dropdown from "../../components/Dropdown.Usable/Dropdown";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Grid,
  Typography,
  Container,
  Checkbox,
  Card,
  Divider,
  TextField,
  Chip,
  OutlinedInput
} from "@mui/material";
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
const SignUp = () => {
  const [organisation, setOrganisation] = useState('Select');
  const [country, setCountry] = useState('Select');
  const organistaionname = ['Fast', 'Nust'];
  const countryname = ['Afghanistan', 'Pakistan', 'USA', 'UK']
  const [payload, setPayload] = useState({});
  const [checked, setChecked] = useState(false);
  const [minorFields, setMinorFields] = useState([]);
  const [majorField, setMajorField] = useState("");
  const theme = useTheme();

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  console.log("🚀 ~ file: SignUp.jsx:28 ~ SignUp ~ payload", payload);
  const navigate = useNavigate();
  const onSubmit = useCallback(async () => {
    try {
      const userData = {
        ...payload,
        isReviewer: checked,
        majorField: majorField,
        minorFields: minorFields,
        country: country,
        organisation: organisation
      };

      const response = await axios.post("http://localhost:8000/users/signup", userData);

      if (response.status === 201) {
        navigate("/SignIn"); // Redirect to sign in page after successful sign up
      }
    } catch (error) {
      console.error("Error signing up", error);
    }
  }, [payload, checked, majorField, minorFields, navigate, country, organisation]);

  const updatePayload = (field, val) => {
    //field = pdfField, val=FILE
    // console.log("here", field, val);
    let temp;
    temp = { ...payload, [field]: val };
    setPayload(temp);
  };
  const handlemajorChange = (event) => {
    setMajorField(event.target.value);
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
  return (
    <Container sx={{ marginTop: "5%", overflow: "hidden" }}>
      <Card
        elevation={3}
        style={{
          backgroundColor: "#F5F5F5",
          padding: "10px",
          margin: "10px",
        }}>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            onSubmit();
          }}
        >

          <Grid
            container
            // sx={{ overflow: "hidden" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={"center"}>
            <Grid item md={4} sm={12} xs={12} sx={{ marginTop: "20px" }}>
              <Typography
                variant="h4"

              >
                Create FEM Account
              </Typography>
            </Grid>
            <Grid item md={1.5} display={{ sm: "none", md: "flex" }}>
              <Divider
                orientation="vertical"
                style={{
                  height: "55px",
                  width: "1px",
                  backgroundColor: "black",
                  marginRight: "15px",
                }}
              />
            </Grid>
            <Grid
              item
              md={3.5}
              sm={12}
              xs={12}
              flexDirection={"row-reverse"}
              sx={{ marginTop: "20px" }}>
              <Typography variant="body" fullWidth display={"flex"}>
                Already have an FEM account?
                <RouterLink
                  to="/SignIn"
                  style={{ color: "black", marginLeft: "5px" }}>
                  Sign In
                </RouterLink>
              </Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="First Name"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("firstName", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Middle Name"
                fullWidth
                onChange={(e) => {
                  updatePayload("middleName", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Last Name"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("lastName", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                required
                onChange={(e) => {
                  updatePayload("email", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Password"
                type={"password"}
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("password", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField label="Confirm Password" fullWidth required type={"password"} onChange={(e) => {
                updatePayload("passwordConfirm", e.target.value);
              }} />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Degree"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("degree", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Phone Number"
                fullWidth
                onChange={(e) => {
                  updatePayload("phone", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Fax Number"
                fullWidth
                onChange={(e) => {
                  updatePayload("fax", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={12}>
              <Typography variant="h5" textAlign={"center"}>
                Institutional Information
              </Typography>
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Dropdown
                label="Choose Country"
                state={country}
                setstate={setCountry}
                names={countryname}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="State"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("state", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="City"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("city", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <Dropdown
                label="Choose Organisation"
                state={organisation}
                setstate={setOrganisation}
                names={organistaionname}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Position"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("position", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={4} sm={12} xs={12}>
              <TextField
                label="Department"
                fullWidth
                required
                onChange={(e) => {
                  updatePayload("department", e.target.value);
                }}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <Typography variant="h5" textAlign={"center"}>
                Do You Want to Be a Reviewer?
                <Checkbox checked={checked} onChange={handleChange} />
              </Typography>
              {
                checked && (
                  <Grid item container md={12} sm={12} xs={12} justifyContent={"center"}>
                    <FormControl sx={{ m: 1, width: { xs: "100%", md: 350 } }}>
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
                    <FormControl sx={{ m: 1, width: { xs: "100%", md: 350 } }}>
                      <InputLabel id="demo-multiple-chip-label">
                        Select the Minor Fields
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

                )
              }
            </Grid>
            <Grid
              item
              md={12}
              alignItems="center"
              display="flex"
              justifyContent="center">
              <Button
                variant="outlined"
                type={"submit"}
                // onClick={onSubmit}
                color="success"
                size="large"
                sx={{ borderRadius: "30px" }}>
                Sign Up
              </Button>
            </Grid>

          </Grid>
        </form>
      </Card>
    </Container >
  );
};
export default SignUp;