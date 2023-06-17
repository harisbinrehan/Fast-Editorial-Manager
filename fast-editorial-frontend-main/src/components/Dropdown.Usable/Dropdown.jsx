import React from 'react'
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
  Link,
  Card,
  Divider,
  TextField,
} from "@mui/material";
const Dropdown = (props) => {
    const handleChange = (event) => {
      props.setstate(event.target.value);
    };
  return (
    <FormControl fullWidth required>
      <InputLabel id="demo-simple-select-label" shrink>
        {props.label}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label={props.label}
        value={props.state}
        onChange={handleChange}>
        {props.names.map((name) => {
          return (
            <MenuItem value={name} key={name}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
export default Dropdown;